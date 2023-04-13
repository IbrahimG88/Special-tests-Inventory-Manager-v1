import { useState, useEffect } from "react";
import Select from "react-select";
import { fetcher } from "../lib/fetcher";
import ListTable from "../components/mui-table-select";

export default function AddSpecialTest() {
  const [specialTestName, setSpecialTestName] = useState("");
  const [connectedToTestOnLIS, setConnectedToTestOnLIS] = useState("");
  const [testsList, setTestsList] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(specialTestName, connectedToTestOnLIS);
  };

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

      <label htmlFor="connected-to-test-on-lis" className="text-lg font-medium">
        Connected to test on LIS
      </label>
      <Select
        options={testsList.map((test) => ({
          id: test.id,
          value: test.testName,
          label: test.testName,
        }))}
        value={{ value: connectedToTestOnLIS, label: connectedToTestOnLIS }}
        onChange={(option) => setConnectedToTestOnLIS(option.value)}
        isSearchable
        className="border border-gray-300 rounded-md shadow-sm p-2"
      />
      <ListTable testsList={testsList} />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
