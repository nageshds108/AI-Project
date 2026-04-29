import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in Backend/.env");
}

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function toObjectArrayFromFlatPairs(items, fields) {
    if (!Array.isArray(items)) return [];
    if (items.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
        return items;
    }

    const out = [];
    let current = {};

    for (let i = 0; i < items.length; i += 1) {
        const key = items[i];
        const value = items[i + 1];
        if (typeof key === "string" && fields.includes(key)) {
            current[key] = value;
            i += 1;
            const isComplete = fields.every((field) => Object.prototype.hasOwnProperty.call(current, field));
            if (isComplete) {
                out.push(current);
                current = {};
            }
        }
    }

    return out;
}

function normalizeInterviewReportShape(data) {
    if (!data || typeof data !== "object") return data;

    const normalized = { ...data };
    normalized.technicalQuestions = toObjectArrayFromFlatPairs(normalized.technicalQuestions, ["question", "intention", "answer"]);
    normalized.behavioralQuestions = toObjectArrayFromFlatPairs(normalized.behavioralQuestions, ["question", "intention", "answer"]);
    normalized.skillGaps = toObjectArrayFromFlatPairs(normalized.skillGaps, ["skill", "severity"]).map((item) => ({
        skill: String(item.skill ?? ""),
        severity: ["low", "medium", "high"].includes(String(item.severity).toLowerCase())
            ? String(item.severity).toLowerCase()
            : "medium"
    }));
    normalized.preparationPlan = toObjectArrayFromFlatPairs(normalized.preparationPlan, ["day", "focus", "tasks"]).map((item) => {
        const dayNum = Number(item.day);
        return {
            day: Number.isFinite(dayNum) ? dayNum : 1,
            focus: String(item.focus ?? ""),
            tasks: Array.isArray(item.tasks) ? item.tasks.map((t) => String(t)) : [String(item.tasks ?? "")]
        };
    });

    return normalized;
}

// Helper function to parse stringified JSON objects in arrays
function parseStringifiedObjects(data) {
    if (!data || typeof data !== "object") return data;

    const parseValue = (val) => {
        if (typeof val === "string") {
            // Try to parse if it looks like JSON
            if ((val.startsWith("{") && val.endsWith("}")) || (val.startsWith("[") && val.endsWith("]"))) {
                try {
                    return JSON.parse(val);
                } catch {
                    return val;
                }
            }
        }
        return val;
    };

    // Parse stringified objects in arrays
    if (Array.isArray(data.technicalQuestions)) {
        data.technicalQuestions = data.technicalQuestions.map(q => parseValue(q));
    }
    if (Array.isArray(data.behavioralQuestions)) {
        data.behavioralQuestions = data.behavioralQuestions.map(q => parseValue(q));
    }
    if (Array.isArray(data.skillGaps)) {
        data.skillGaps = data.skillGaps.map(s => parseValue(s));
    }
    if (Array.isArray(data.preparationPlan)) {
        data.preparationPlan = data.preparationPlan.map(p => {
            const parsed = parseValue(p);
            // Ensure tasks is an array of strings
            if (parsed && parsed.tasks && typeof parsed.tasks === "string") {
                try {
                    parsed.tasks = JSON.parse(parsed.tasks);
                } catch {
                    parsed.tasks = [parsed.tasks];
                }
            }
            return parsed;
        });
    }

    return data;
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY valid JSON with EXACTLY these keys:
- matchScore (number 0-100)
- technicalQuestions (array of objects: { question, intention, answer })
- behavioralQuestions (array of objects: { question, intention, answer })
- skillGaps (array of objects: { skill, severity }, severity must be one of: low, medium, high)
- preparationPlan (array of objects: { day, focus, tasks }, tasks must be string array)
- title (string)

Do not include any extra keys like candidate_name, recommendation, strengths, weaknesses, notes, report_date, etc.

Example format:
{
  "matchScore": 78,
  "technicalQuestions": [
    { "question": "Explain SQL JOINs.", "intention": "Check SQL depth", "answer": "Define each JOIN and give examples." }
  ],
  "behavioralQuestions": [
    { "question": "Tell me about a challenge.", "intention": "Assess problem solving", "answer": "Use STAR with measurable impact." }
  ],
  "skillGaps": [
    { "skill": "Power BI", "severity": "medium" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "SQL revision", "tasks": ["Practice joins", "Practice window functions"] }
  ],
  "title": "Interview Report - Candidate Name - Data Analyst"
}`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    console.log("Gemini interview raw response:", response?.text);

    let parsed;
    try {
        parsed = JSON.parse(response.text);
    } catch {
        throw new Error("AI returned invalid JSON format.");
    }

    // Parse stringified JSON objects in arrays
    parsed = parseStringifiedObjects(parsed);
    parsed = normalizeInterviewReportShape(parsed);

    let validated = interviewReportSchema.safeParse(parsed);
    if (!validated.success) {
        parsed = await reformatInterviewReportWithAI(parsed, { resume, selfDescription, jobDescription });
        parsed = parseStringifiedObjects(parsed);
        parsed = normalizeInterviewReportShape(parsed);
        validated = interviewReportSchema.safeParse(parsed);
    }

    if (!validated.success) {
        throw new Error("AI response is missing required fields (question/intention/answer format) even after reformat.");
    }

    return validated.data;
}

async function reformatInterviewReportWithAI(rawReport, context) {
    const technicalQuestions = Array.isArray(rawReport?.technicalQuestions) ? rawReport.technicalQuestions : [];
    const behavioralQuestions = Array.isArray(rawReport?.behavioralQuestions) ? rawReport.behavioralQuestions : [];
    const skillGaps = Array.isArray(rawReport?.skillGaps) ? rawReport.skillGaps : [];
    const preparationPlan = Array.isArray(rawReport?.preparationPlan) ? rawReport.preparationPlan : [];
    const matchScore = Number.isFinite(Number(rawReport?.matchScore)) ? Number(rawReport.matchScore) : 0;
    const title = typeof rawReport?.title === "string" ? rawReport.title : "Interview Report";

    const reformatPrompt = `You are a strict JSON transformer.

Task:
Transform the provided content into EXACTLY this schema and return ONLY valid JSON:
{
  "matchScore": number,
  "technicalQuestions": [{ "question": string, "intention": string, "answer": string }],
  "behavioralQuestions": [{ "question": string, "intention": string, "answer": string }],
  "skillGaps": [{ "skill": string, "severity": "low" | "medium" | "high" }],
  "preparationPlan": [{ "day": number, "focus": string, "tasks": string[] }],
  "title": string
}

Critical rules:
1) technicalQuestions and behavioralQuestions MUST be arrays of OBJECTS, never strings.
2) For each question string, generate meaningful intention and answer specific to that question.
3) skillGaps MUST be object array with severity.
4) preparationPlan MUST be object array; parse "Day X: ..." text into day/focus/tasks.
5) Do not add any keys beyond the schema keys.
6) Return JSON only.

Context:
- Resume: ${context.resume}
- Self Description: ${context.selfDescription}
- Job Description: ${context.jobDescription}

Input values:
- matchScore: ${matchScore}
- title: ${JSON.stringify(title)}
- technicalQuestions: ${JSON.stringify(technicalQuestions)}
- behavioralQuestions: ${JSON.stringify(behavioralQuestions)}
- skillGaps: ${JSON.stringify(skillGaps)}
- preparationPlan: ${JSON.stringify(preparationPlan)}
`;

    const reformatResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: reformatPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
            temperature: 0,
        }
    });

    console.log("Gemini interview reformatted response:", reformatResponse?.text);
    return JSON.parse(reformatResponse.text);
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

export { generateInterviewReport, generateResumePdf };
