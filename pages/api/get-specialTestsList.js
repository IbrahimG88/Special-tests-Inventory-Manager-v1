import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("canal_inventory_special_tests");

    const existingTestsList = await collection.findOne({});
    if (!existingTestsList) {
      return res.status(404).json({ message: "Tests list not found" });
    }

    client.close();
    return res.status(200).json(existingTestsList.specialTestsList);
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
