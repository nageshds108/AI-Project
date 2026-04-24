/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [reports, setReports] = useState([]);

    return (
        <InterviewContext.Provider
          value={{
            report,
            setReport,
            loading,
            setLoading,
            loadingMessage,
            setLoadingMessage,
            reports,
            setReports
          }}
        >
            {children}
        </InterviewContext.Provider>
    );
};
