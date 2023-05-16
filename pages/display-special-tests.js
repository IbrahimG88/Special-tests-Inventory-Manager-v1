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
import TextField from "@mui/material/TextField";

import Fuse from "fuse.js";

export default function DisplaySpecialTests() {
  const { data: session } = useSession();
  const [specialTestsList, setSpecialTestsList] = useState([]);
  const [filteredTestsList, setFilteredTestsList] = useState([]);

  useEffect(() => {
    const fetchTestsList = async () => {
      const specialTestsData = await fetcher("/api/get-specialTestsList");
      if (specialTestsData) {
        setSpecialTestsList(specialTestsData);
        setFilteredTestsList(specialTestsData);
      } else {
        console.error("Error fetching tests list from database");
      }
    };

    if (specialTestsList.length === 0) {
      fetchTestsList();
    }
  }, []);

  const fuse = new Fuse(specialTestsList, {
    keys: ["specialTestName", "testConnections.testName"],
    threshold: 0.3,
  });

  const handleSearch = (event) => {
    const query = event.target.value;
    if (query === "") {
      setFilteredTestsList(specialTestsList);
    } else {
      const results = fuse.search(query);
      setFilteredTestsList(results.map((result) => result.item));
    }
  };

  if (session) {
    return (
      <div className="px-6">
        <TextField
          id="filled-search"
          label="Search Special Tests"
          type="search"
          variant="filled"
          onChange={handleSearch}
        />

        <Typography>Special Tests List:</Typography>
        {filteredTestsList.map((item) => (
          <Accordion key={item.id} className="bg-teal-100">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.specialTestName}</Typography>
            </AccordionSummary>
            <AccordionDetails className="bg-lime-100">
              <div>
                <Typography>Test Connections: </Typography>
                <Typography>
                  {item.perPatient ? "Deducts one Per Patient" : null}
                </Typography>
                {item.testConnections.map((testConnection) => (
                  <div key={testConnection.id}>
                    <Typography>{testConnection.testName}</Typography>
                  </div>
                ))}
              </div>
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
