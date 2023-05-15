import * as XLSX from "xlsx";
import { useState } from "react";

export default function OrderDetails({ selectedItems }) {
  const [orderName, setOrderName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierMobile, setSupplierMobile] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(selectedItems);
    const headerData = [
      [`Order Name: ${orderName}`],
      [`Date of Order: ${new Date().toLocaleDateString()}`],
      [`Supplier Name: ${supplierName}`],
      [`Supplier Mobile Number: ${supplierMobile}`],
      [`Urgency: ${urgency}`],
      [],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, headerData, { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${orderName}.xlsx`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <label htmlFor="orderName" className="block font-bold mb-2">
        Order Name
      </label>
      <input
        type="text"
        id="orderName"
        value={orderName}
        onChange={(e) => setOrderName(e.target.value)}
        className="border border-gray-400 rounded py-2 px-3 mb-4 w-full focus:outline-none focus:border-blue-500"
      />
      <label htmlFor="supplierName" className="block font-bold mb-2">
        Supplier Name
      </label>
      <input
        type="text"
        id="supplierName"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
        className="border border-gray-400 rounded py-2 px-3 mb-4 w-full focus:outline-none focus:border-blue-500"
      />

      <label htmlFor="supplierMobile" className="block font-bold mb-2">
        Supplier Mobile Number
      </label>
      <input
        type="text"
        id="supplierMobile"
        value={supplierMobile}
        onChange={(e) => setSupplierMobile(e.target.value)}
        className="border border-gray-400 rounded py-2 px-3 mb-4 w-full focus:outline-none focus:border-blue-500"
      />

      <label htmlFor="urgency" className="block font-bold mb-2">
        Urgency
      </label>
      <select
        id="urgency"
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
        className="border border-gray-400 rounded py-2 px-3 mb-4 w-full focus:outline-none focus:border-blue-500"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/2 py-2 px-4 text-left font-bold">Test Name</th>
            <th className="w-1/4 py-2 px-4 text-left font-bold">
              Order Quantity
            </th>
            <th className="w-1/4 py-2 px-4 text-left font-bold">
              Total Stocks
            </th>
            <th className="w-1/4 py-2 px-4 text-left font-bold">
              Total After ordering
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedItems &&
            selectedItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4">{item.testName}</td>
                <td className="py-2 px-4">{item.orderQuantity}</td>
                <td className="py-2 px-4">
                  {item.TotalStocks ? item.TotalStocks : parseInt(0)}
                </td>
                <td className="py-2 px-4">
                  {item.TotalStocks
                    ? parseInt(item.orderQuantity) + parseInt(item.TotalStocks)
                    : parseInt(item.orderQuantity)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={downloadExcel}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Export to Excel
      </button>
    </div>
  );
}
