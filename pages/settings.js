import { Inventory, NavigateNext, Tram } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import { Button } from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import PopulateTestsList from "./poppulate-tests-list";

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

  /// Updating the mongo list with the tests from LIS functionality:
  // we have inventory: from mongo collection and testsList or transformedTestsList: from lis
  // 1. if tests were added from lis: variable: find tests in testsList that are not in inventory
  // 2. if tests were deleted from lis: variable: find tests in inventory that are not in testsList
  // 1. send these additional tests to api and add them to mongo list
  // 2. send these deleted tests to api and delete them from mongo list
  // 2. to test: delete some tests manually from settings component which mimics deletion from lis

  // 1. if tests were added from lis: variable: find tests in testsList that are not in inventory:
  // to test: delete some tests manually from mongo
  const updateTests = async () => {
    const data = await fetcher(`http://197.45.107.206/api2/integration/tests`);

    const transformedTestsList = Object.entries(data).map(([key, value]) => ({
      id: value.profile_id,
      testName: value.report_name,
    }));

    const addedTests = transformedTestsList.filter((test) => {
      return !inventory.some(
        (inventoryTest) => inventoryTest.testName === test.testName
      );
    });

    // 2. if tests were deleted from lis: variable: find tests in inventory that are not in testsList
    // to test add manually some tests to mongo testsList
    const removeTestsFromMongo = inventory.filter((test) => {
      return !transformedTestsList.some(
        (transformedTest) => transformedTest.testName === test.testName
      );
    });

    console.log("addedTests", addedTests);
    console.log("inventory", inventory);
    console.log("transformedTestsList", transformedTestsList);
    console.log("removeTestsFromMongo", removeTestsFromMongo);

    if (addedTests.length > 0) {
      const response = await fetch("/api/addedTests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addedTests: addedTests }),
      });
    } else if (removeTestsFromMongo.length > 0) {
      const response = await fetch("/api/removeTestsFromMongo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeTestsFromMongo: removeTestsFromMongo }),
      });
    }
  };

  if (session && session.user.role === "super-user") {
    return (
      <>
        <h1 className="p-4">
          If you added or deleted tests on LIS add them or delete them manually
          on Mongo...
        </h1>
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
            Reset TestsList on Mongo
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={updateTests}
          >
            Update Tests List bidirectional
          </Button>
        </div>

        <PopulateTestsList />
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
