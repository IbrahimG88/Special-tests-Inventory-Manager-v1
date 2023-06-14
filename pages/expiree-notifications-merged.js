import { useState } from "react";
import Fuse from "fuse.js";
import SearchIcon from "@mui/icons-material/Search";
import { connectToDatabase } from "../lib/db";

import { useSession, signIn } from "next-auth/react";

export async function getServerSideProps() {
  try {
    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");

    const collectionInventory2 = db.collection("inventory2");
    const testsListFromMongo = await collectionInventory2.findOne({});
    if (!testsListFromMongo) {
      return res.status(404).json({ message: "testsList not loaded " });
    }
    console.log("testsList", testsListFromMongo.testsList);

    const collectionSpecialTests = db.collection("special_tests");
    const specialTestsListFromMongo = await collectionSpecialTests.findOne({});
    if (!specialTestsListFromMongo) {
      return res.status(404).json({ message: "specialtestsList not loaded" });
    }

    return {
      props: {
        data: [
          ...testsListFromMongo.testsList,
          ...specialTestsListFromMongo.specialTestsList,
        ],
      },
    };
  } catch (error) {
    // Log the error message and return an empty props object
    console.error(error.message);
    return { props: {} };
  }
}

export default function StocksComponent({ data }) {
  const { data: session } = useSession();
  const [expiryFilter, setExpiryFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredData = data
    .map((item) => {
      if (!Array.isArray(item.stocksArray)) {
        return null;
      }
      const filteredStocks = showAll
        ? item.stocksArray
        : item.stocksArray.filter((stock) => {
            const [year, month, day] = stock.expiryDate.split("-").map(Number);
            const expiryDate = new Date(Date.UTC(year, month - 1, day));
            const currentDate = new Date();
            const timeDiff = expiryDate.getTime() - currentDate.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            if (expiryFilter === 30) {
              return daysDiff <= expiryFilter;
            } else if (expiryFilter === 60) {
              return daysDiff <= expiryFilter;
            } else {
              return true;
            }
          });
      if (filteredStocks.length > 0) {
        return { ...item, stocksArray: filteredStocks };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);

  const fuse = new Fuse(filteredData, {
    keys: [
      "testName",
      "specialTestName",
      "stocksArray.instrument",
      "stocksArray.amount",
      "stocksArray.expiryDate",
    ],
    threshold: 0.3,
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : filteredData;
  if (session) {
    return (
      <div className="p-4">
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-400 rounded-md pl-8 pr-2 py-1"
          />
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="mt-4 flex flex-wrap">
          <button
            onClick={() => setExpiryFilter(30)}
            disabled={showAll}
            className={`${
              expiryFilter === 30
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } mb-2 text-white px-4 py-2 rounded-md mr-2  focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
              showAll ? "bg-gray-400" : ""
            }`}
          >
            1 Month till Expiry
          </button>
          <button
            onClick={() => setExpiryFilter(60)}
            disabled={showAll}
            className={`${
              expiryFilter === 60
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } mb-2 text-white px-4 py-2 rounded-md mr-2 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
              showAll ? "bg-gray-400" : ""
            }`}
          >
            2 Months till Expiry
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className={`${
              showAll
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } mb-2 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50`}
          >
            {showAll ? "All Inventory: On" : "All Inventory: Off"}
          </button>
        </div>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Test Name</th>
              <th className="px-4 py-2 text-left">Instrument</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((item, itemIndex) => [
              <tr key={`${item.testName}-${itemIndex}`}>
                <td className="border px-4 py-2 font-bold text-lg" colSpan={4}>
                  {item.testName ? item.testName : "* " + item.specialTestName}:
                </td>
              </tr>,
              ...item.stocksArray.map((stock, stockIndex) => {
                const [year, month, day] = stock.expiryDate
                  .split("-")
                  .map(Number);
                const expiryDate = new Date(Date.UTC(year, month - 1, day));
                const currentDate = new Date();
                const timeDiff = expiryDate.getTime() - currentDate.getTime();
                const daysDiff = timeDiff / (1000 * 3600 * 24);
                let rowClass = "";
                if (daysDiff <= 30) {
                  rowClass = "bg-red-100";
                } else if (daysDiff <= 60) {
                  rowClass = "bg-yellow-100";
                }
                return (
                  <tr
                    key={`${stock.instrument}-${stockIndex}`}
                    className={rowClass}
                  >
                    <td className="border px-4 py-2">{stockIndex + 1}</td>
                    <td className="border px-4 py-2">{stock.instrument}</td>
                    <td className="border px-4 py-2">{stock.amount}</td>
                    <td className="border px-4 py-2">{stock.expiryDate}</td>
                  </tr>
                );
              }),
            ])}
          </tbody>
        </table>
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
