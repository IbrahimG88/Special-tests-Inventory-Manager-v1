import { useState, useEffect } from "react";
import Select from "react-select";
import { fetcher } from "../lib/fetcher";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function AddSpecialTest() {
  const [specialTestName, setSpecialTestName] = useState("");

  const [testsList, setTestsList] = useState([]);
  // select the rows item.id
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [specialTestObject, setSpecialTestObject] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [perPatient, setPerPatient] = useState(false);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "testName", headerName: "Test Name", width: 130 },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("checked checkbox status", perPatient);

    const filteredTests = testsList.filter((test) =>
      rowSelectionModel.includes(test.id)
    );
    console.log(filteredTests);
    setSelectedTests(filteredTests);

    const specialTestObject = {
      specialTestName: specialTestName,
      testConnections: filteredTests,
      type: "special",
      perPatient: perPatient,// can evaluate to true or false
    };

    setRowSelectionModel([]);
    setSpecialTestName("");
    await saveItem(specialTestObject);
  };

  async function saveItem(testObject) {
    // save the updatedItem using the api update-stocks endpoint
    console.log("specialTestObject from saveItem function", testObject);

    try {
      setIsUpdating(true); // Set isUpdating to true before calling setUpdatedItem
      const response = await fetch("/api/save-special-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testObject),
      });

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      console.log("Item saved successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false); // Set isUpdating to false after setUpdatedItem is completed
    }
  }

  return (
    <form className="flex flex-col space-y-4 p-4" onSubmit={handleSubmit}>
      <label htmlFor="special-test-name" className="text-lg font-medium">
        Special Test Name
      </label>
      <input
        type="text"
        id="special-test-name"
        value={specialTestName}
        onChange={(e) => setSpecialTestName(e.target.value)}
        className="border border-gray-300 rounded-md shadow-sm p-2"
      />
          <div className="flex items-center">
        <label htmlFor="per-patient" className="text-lg font-medium mr-2">
          Deduct 1 per single patient registered:
        </label>
        <input
          type="checkbox"
          id="per-patient"
          checked={perPatient}
          onChange={(e) => setPerPatient(e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <label
        htmlFor=" Choose single or multiple items from the table"
        className="text-lg font-medium"
      >
        Choose single or multiple items from the table:
      </label>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={testsList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
            console.log("newRowSelectionModel", newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
