import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  console.log("from api updatedItem", req.body);
  const { specialTestName, totalStocks, stocksArray } = req.body;

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const collection = db.collection("special_tests");
    const filter = { "specialTestsList.specialTestName": specialTestName };
    const update = {
      $set: {
        "specialTestsList.$.totalStocks": totalStocks,
        "specialTestsList.$.stocksArray": stocksArray,
      },
    };
    const result = await collection.updateOne(filter, update);

    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating item" });
  } finally {
    client.close();
  }
}
