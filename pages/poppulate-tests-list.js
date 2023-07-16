import { useState, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export default function PopulateTestsList() {
  const [testsList, setTestsList] = useState([]);

  const handlePopulate = async () => {
    const data = await fetcher(`http://196.219.64.243/api2/integration/tests`);

    const transformedTestsList = Object.entries(data).map(([key, value]) => ({
      id: value.profile_id,
      testName: value.report_name,
    }));

    const response = await fetch("/api/post-testslist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testsList: transformedTestsList }),
    });

    if (response.status === 201) {
      setTestsList(transformedTestsList);
    } else {
      const message = await response.json();
      alert(message.message);
    }
  };

  useEffect(() => {
    const fetchTestsList = async () => {
      const data = await fetcher("/api/get-testslist");
      if (data) {
        setTestsList(data);
        console.log("testsList", data);
      } else {
        console.error("Error fetching tests list from database");
      }
    };

    if (testsList.length === 0) {
      fetchTestsList();
    }
  }, [testsList]);

  const handleDelete = async (id, testName) => {
    const updatedTestsList = testsList.filter((test) => test.id !== id);
    setTestsList(updatedTestsList);

    const test = { id: id, testName: testName };

    const res = await fetch("/api/delete-test/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(test),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handlePopulate}
      >
        Populate Tests List
      </button>
      <div className="mt-4">
        <h2 className="text-lg font-medium">Tests List</h2>
        <ul className="mt-2">
          {testsList.map((test) => (
            <li
              key={test.id}
              className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
            >
              {test.testName}
              {"  "}
              <IconButton
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
                onClick={() => handleDelete(test.id, test.testName)}
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
