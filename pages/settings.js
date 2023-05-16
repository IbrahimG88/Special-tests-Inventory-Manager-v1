import { Inventory, NavigateNext } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import { Button } from "@mui/material";
import { useSession, signIn } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();
  const [inventory, setInventory] = useState([]);
  const [testsList, setTestsList] = useState([]);

  //fetch data from database
  useEffect(() => {
    fetch(`/api/get-testslist`)
      .then((response) => response.json())
      .then((data) => {
        const transformedInventory = [];

        for (const key in data) {
          transformedInventory.push({
            id: data[key].id,
            testName: data[key].testName,
            TotalStocks: data[key].totalStocks,
          });
        }

        transformedInventory.sort((a, b) => {
          if (a.TotalStocks == null || a.TotalStocks < 1) {
            return 1;
          }
          if (b.TotalStocks == null || b.TotalStocks < 1) {
            return -1;
          }
          return a.TotalStocks - b.TotalStocks;
        });

        setInventory(transformedInventory);
      });
  }, []);

  //fetch data from LIS

  const handlePopulate = async () => {
    const data = await fetcher(`http://197.45.107.206/api2/integration/tests`);

    const transformedTestsList = Object.entries(data).map(([key, value]) => ({
      id: value.profile_id,
      testName: value.report_name,
    }));

    if (transformedTestsList.length !== inventory.length) {
      const response = await fetch("/api/settings-update-testsList", {
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
    }

    if (inventory === 0) {
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
    }
  };

  if (session && session.user.role === "super-user") {
    return (
      <>
        {testsList.length > 0 ? (
          <h1 className="p-4">
            Number of tests in Inventory: {testsList.length}
          </h1>
        ) : inventory.length === 0 ? (
          <h1> Number of tests in Inventory: ..Loading</h1>
        ) : (
          <h1 className="p-4">
            Number of tests in Inventory: {inventory.length}
          </h1>
        )}
        <div className="flex justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handlePopulate}
          >
            Update or Upload TestsList
          </Button>
        </div>
      </>
    );
  } //component code
  else if (!session) {
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
  } else {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">
          You are not authorized to access the settings component..
        </h2>
      </div>
    );
  }
}

// update the testsList from lis locally to avoid using http request
