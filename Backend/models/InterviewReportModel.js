import mongoose from "mongoose";

const InterviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },

  resume: {
    type: String,
  },
  selfDescription: { type: String },

  matchScore: { type: Number, min: 0, max: 100 },

  technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapsSchema],
    preparationPlanSchema: [preparationPlanSchema],
});

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"],
    },
    focus:{
        type: String,
        required: [true, "Focus is required"]
    },
        tasks: [{type: String,
        required: [true, "Tasks are required"]}
        ],
});


const skillGapsSchema = new mongoose.Schema({
    skill: { type: String, required: [true, "Skill is required"] },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: [true, "Severity is required"] },
}, { _id: false });


const InterviewReport = mongoose.model("InterviewReport", InterviewReportSchema);

export default InterviewReport;