import * as React from "react";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { getSession } from "next-auth/react";
import { useSession, signIn } from "next-auth/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DisplaySpecialTestds() {
  const { data: session } = useSession();
  const [specialTestsList, setSpecialTestsList] = useState([]);

  useEffect(() => {
    const fetchTestsList = async () => {
      const specialTestsData = await fetcher("/api/get-specialTestsList");
      if (specialTestsData) {
        setSpecialTestsList(specialTestsData);
      } else {
        console.error("Error fetching tests list from database");
      }
    };

    if (specialTestsList.length === 0) {
      fetchTestsList();
    }
  }, []);

  if (session) {
    return (
      <div>
        <Typography variant="h6" gutterBottom className="px-6">
          Special Tests List:
        </Typography>
        {specialTestsList.map((item) => (
          <Accordion key={item.id} className="bg-teal-100">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" gutterBottom>
                {item.specialTestName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="bg-lime-100">
              <Typography>
                <Typography variant="h6" gutterBottom>
                  Test Connections:{" "}
                </Typography>
                <Typography>
                  {item.perPatient ? "Deducts one Per Patient" : null}
                </Typography>
                {item.testConnections.map((testConnection) => (
                  <div key={testConnection.id}>
                    <Typography variant="subtitle1" gutterBottom>
                      {testConnection.testName}
                    </Typography>
                  </div>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4">Please login to continue</h2>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
}
