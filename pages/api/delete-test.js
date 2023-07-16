import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("canal_inventory");

    const { id, testName } = req.body;

    console.log("logging: ", testName);

    // add code here
    const result = await collection.updateOne(
      { "testsList.testName": { $eq: testName } },
      {
        $pull: { testsList: { testName: testName } },
      }
    );
    console.log(`${result.deletedCount} item(s) deleted`);

    client.close();
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
