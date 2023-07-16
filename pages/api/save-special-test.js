import { connectToDatabase } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  const specialTestObject = req.body;
  const { specialTestName, testConnections } = req.body;

  try {
    console.log("from api object", req.body);
    const collection = db.collection("canal_inventory_special_tests");

    // Check if the array exists
    const result = await collection.findOne({
      specialTestsList: {
        $exists: true,
      },
    });
    if (!result) {
      // The array does not exist, so create it
      await collection.insertOne({ specialTestsList: [] });
    }

    //Here’s a MongoDB query that you can use to update an item in the specialTestsList array by its specialTestName property
    // using an object called specialTestObject, and push that object into specialTestsList if not found by its name:
    //The arrayFilters option specifies that the update should only be applied to elements
    // in the specialTestsList array where the specialTestName property is equal to "yourSpecialTestName".
    await collection.updateOne(
      { "specialTestsList.specialTestName": specialTestName },
      {
        $set: {
          "specialTestsList.$[elem].testConnections":
            specialTestObject.testConnections,
          "specialTestsList.$[elem].type": specialTestObject.type,
        },
      },
      {
        arrayFilters: [{ "elem.specialTestName": specialTestName }],
      }
    );

    // The second updateOne operation pushes an object called specialTestObject into the specialTestsList array
    // if no item with a specialTestName property equal to "yourSpecialTestName" is found. The query searches for
    //a document in the collection where no item in the specialTestsList array has a specialTestName property equal
    //to "yourSpecialTestName". The update operation uses the $push operator to add the specialTestObject to the end of the specialTestsList array.
    await collection.updateOne(
      { "specialTestsList.specialTestName": { $ne: specialTestName } },
      {
        $push: { specialTestsList: specialTestObject },
      }
    );
    //
    res.status(200).json({ message: "Item updated successfully" });
  } finally {
    await client.close();
  }
}

/*Yes, you need both queries to achieve the desired result. 
The first updateOne operation updates an existing item in the
 specialTestsList array by its specialTestName property using
  an object called specialTestObject. The second updateOne
   operation pushes the specialTestObject into the specialTestsList
    array if no item with a specialTestName property equal to the value 
    of the specialTestName variable is found.

The first query alone will only update an existing item in the array but will not insert
 a new item if it doesn’t exist. The second query alone will only insert a new item into 
 the array but will not update an existing item if it exists. So, both queries are necessary 
 to achieve the desired result of updating an existing item or inserting a new item if it doesn’t exist.*/
