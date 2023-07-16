import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("canal_inventory");

    const existingTestsList = await collection.findOne({});
    if (existingTestsList) {
      return res.status(400).json({ message: "Tests list already exists" });
    }

    const { testsList } = req.body;
    if (!testsList) {
      throw { status: 400, message: "Missing tests list in request body" };
    }

    const result = await collection.insertOne({ testsList });

    client.close();

    return res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
