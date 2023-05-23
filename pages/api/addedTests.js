import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { addedTests } = req.body;

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const collection = db.collection("inventory2");
    const result = await collection.updateOne(
      { testsList: { $exists: true } },
      { $addToSet: { testsList: { $each: addedTests } } }
    );

    res.status(200).json({ message: "Tests added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding tests" });
  } finally {
    client.close();
  }
}
