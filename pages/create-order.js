import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function CreateOrder() {
  const { data: session } = useSession();
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

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

  const handleItemSelection = (item, orderQuantity) => {
    setSelectedItems((prevSelectedItems) => {
      const existingIndex = prevSelectedItems.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );

      if (existingIndex !== -1) {
        const newSelectedItems = [...prevSelectedItems];
        newSelectedItems[existingIndex].orderQuantity = orderQuantity;
        newSelectedItems[existingIndex].TotalAfterOrder =
          parseInt(newSelectedItems[existingIndex].TotalStocks) +
          parseInt(orderQuantity);
        return newSelectedItems;
      } else {
        let TotalAfterOrder;
        if (item.TotalStocks >= 1) {
          TotalAfterOrder =
            parseInt(item.TotalStocks) + parseInt(orderQuantity);
        } else {
          TotalAfterOrder = parseInt(orderQuantity);
        }
        return [
          ...prevSelectedItems,
          { ...item, orderQuantity, TotalAfterOrder },
        ];
      }
    });
  };

  const handleSubmit = () => {
    console.log(selectedItems);

    router.push({
      pathname: "/OrderDetailsPage",
      query: { selectedItems: JSON.stringify(selectedItems) },
    });

    setSelectedItems([]);
  };

  const filteredInventory = inventory.filter((item) =>
    item.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (session) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Select items from inventory</h2>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by test name"
            className="border border-gray-400 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit order
          </button>
        </div>
        <table className="table-auto mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Total Stocks</th>
              <th className="px-4 py-2">Order Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.testName}</td>
                <td className="border px-4 py-2">{item.TotalStocks}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={
                      selectedItems.find(
                        (selectedItem) => selectedItem.id === item.id
                      )?.orderQuantity || ""
                    }
                    onChange={(e) => handleItemSelection(item, e.target.value)}
                    className="border border-gray-400 rounded py-2 px-3 w-24 focus:outline-none focus:border-blue-500"
                  />
                </td>
              </tr>
            ))}
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
