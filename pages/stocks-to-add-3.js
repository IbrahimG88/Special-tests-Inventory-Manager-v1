import { useState, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import Fuse from "fuse.js";
import StocksForm from "../components/stocks-form-3";

import { useSession, signIn } from "next-auth/react";

export default function StocksToAdd() {
  const { data: session } = useSession();
  const [testsList, setTestsList] = useState([]);

  const [userInput, setUserInput] = useState("");
  const [index, setIndex] = useState(null);
  const [addButton, setAddButton] = useState(false);

  useEffect(() => {
    const fetchTestsList = async () => {
      const data = await fetcher("/api/get-testslist");

      // update testsList value if its value has changed each 5 seconds interval
      if (data && JSON.stringify(data) !== JSON.stringify(testsList)) {
        setTestsList(data);
      } else if (!data) {
        console.error("Error fetching tests list from database");
      }
    };

    fetchTestsList();

    // Refresh data every 5 seconds
    const intervalId = setInterval(() => fetchTestsList(), 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [testsList]);

  const fuse = new Fuse(testsList, {
    keys: ["testName"],
    threshold: 0.3,
  });

  const results = fuse.search(userInput);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleClick = (index) => {
    console.log("index", index);

    setIndex(index);
  };

  const handleAddButton = () => {
    setAddButton(!addButton);
  };
  if (session) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-medium p-2">Tests List</h2>
        <div className="flex items-center border border-gray-300 rounded-md">
          <input
            type="text"
            placeholder="Search..."
            value={userInput}
            onChange={handleChange}
            className="flex-1 px-4 py-2 outline-none"
          />
        </div>

        <div className="mt-4">
          <ul>
            {!addButton &&
              results.map((result, index) => (
                <li
                  key={result.item.id}
                  className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
                  onClick={() => {
                    const itemClickedIndex = testsList.findIndex(
                      (item) => item.id === result.item.id
                    );

                    handleClick(itemClickedIndex);
                  }}
                >
                  {result.item.testName}
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                      onClick={() => handleAddButton()}
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="mt-4">
          <ul className="mt-2">
            {!addButton &&
              results.length === 0 &&
              testsList.map((test, index) => (
                <li
                  key={test.id}
                  className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
                  onClick={() => handleClick(index)}
                >
                  {test.testName}
                  {addButton ? (
                    <div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAddButton()}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                          Done
                        </button>

                        <StocksForm item={testsList[index]} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAddButton()}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
          {addButton && (
            <div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleAddButton()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Done
                </button>
              </div>

              <StocksForm item={testsList[index]} />
            </div>
          )}
        </div>
      </div>
    );
  } //component code
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
