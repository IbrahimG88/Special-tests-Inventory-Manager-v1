import { useState, useEffect } from "react";
import { fetcher } from "../lib/fetcher";
import Fuse from "fuse.js";
import StocksForm from "../components/stocks-form-3";

import { useSession, signIn } from "next-auth/react";

export default function SpecialStocksToAdd() {
  const { data: session } = useSession();
  const [specialTestsList, setSpecialTestsList] = useState([]);

  const [userInput, setUserInput] = useState("");
  const [clickedItem, setClickedItem] = useState(null);
  const [addButton, setAddButton] = useState(false);

  useEffect(() => {
    const fetchTestsList = async () => {
      const specialTestsData = await fetcher("/api/get-specialTestsList");

      if (
        specialTestsData &&
        JSON.stringify(specialTestsData) !== JSON.stringify(specialTestsList)
      ) {
        setSpecialTestsList(specialTestsData);
      } else if (!specialTestsData) {
        console.error("Error fetching tests list from database");
      }

      console.log("specialTestsList:", specialTestsList);
    };

    fetchTestsList();

    // Refresh data every 5 seconds
    const intervalId = setInterval(() => fetchTestsList(), 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [specialTestsList]);

  const fuse = new Fuse(specialTestsList, {
    keys: ["specialTestName"],
    threshold: 0.3,
  });

  const results = fuse.search(userInput);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleClick = (item) => {
    console.log("item", item);

    setClickedItem(item);
  };

  const handleAddButton = () => {
    setAddButton(!addButton);
  };
  if (session) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-medium p-2"> Special Tests List</h2>
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
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
                  onClick={() => {
                    const item = specialTestsList.find(
                      (item) =>
                        item.specialTestName === result.item.specialTestName
                    );

                    handleClick(item);
                  }}
                >
                  {result.item.specialTestName}
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
              specialTestsList.map((test, index) => (
                <li
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
                  onClick={() => {
                    const itemClicked = specialTestsList.find(
                      (item) => item.specialTestName === test.specialTestName
                    );

                    handleClick(itemClicked);
                  }}
                >
                  {test.specialTestName}

                  {addButton ? (
                    <div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAddButton()}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                          Done
                        </button>

                        <StocksForm item={clickedItem} />
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

              <StocksForm item={clickedItem} />
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
