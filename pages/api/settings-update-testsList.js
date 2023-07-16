import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("canal_inventory");

    const { testsList } = req.body;
    if (!testsList) {
      throw { status: 400, message: "Missing tests list in request body" };
    }

    const updatedTestsList = testsList;

    const result = await collection.updateOne(
      { testsList: { $exists: true } },
      { $set: { testsList } },
      { upsert: true }
    );
    client.close();

    return res.status(201).json({ message: "Tests list updated" });
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
