import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { connectToDatabase } from "../lib/db";
import { getPreviousDate } from "../lib/helpers/get-set-dates";
import { getNowDate } from "../lib/helpers/get-set-dates";
import { getConsumptionData } from "../lib/helpers/get-consumption-data";
import { subtractArrays } from "../lib/helpers/subtract-Consumption";

const inter = Inter({ subsets: ["latin"] });

// Use serverSideProps to fetch data on each request
export async function getServerSideProps() {
  // Connect to MongoDB Atlas

  // Use try/catch blocks to handle errors
  try {
    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collectionAppVariables = db.collection("appVariables");
    //todo prod: add collectionInventory2
    const collectionSpecialTests = db.collection("special_tests");

    // for more processing add another const collectionInventory2 = db.collection("inventory2");

    // Find one document in appVariables collection where date2 exists
    //todo prod: use here date3 to use it for this component same value as date2
    const appVariable = await collectionAppVariables.findOne({
      date3: { $exists: true },
    });
    if (!appVariable) {
      return res.status(404).json({ message: "date3 not found" });
    }

    // Use JSON.stringify() to convert date2 into a string
    //todo prod: change test-date to date3
    const dateValue = JSON.stringify(appVariable.date3);

    const testsListFromMongo = await collectionSpecialTests.findOne({});
    if (!testsListFromMongo) {
      return res.status(404).json({ message: "testsList not loaded" });
    }

    // get the consumptionArray
    const previousDateDetails = getPreviousDate(dateValue);
    const nowDateDetails = getNowDate();
    const consumptionArray = await getConsumptionData(
      previousDateDetails,
      nowDateDetails
    );

    // update the date only if you received the consumption data array
    if (consumptionArray.length >= 1) {
      // set Mongo Date to now add a conditional later to only update the date if the data in mongo was updated  also here in getServerSideProps
      // if no date2 was found set the date2 value to now
      const nowDate = await collectionAppVariables.updateOne(
        { date3: { $exists: true } },
        { $currentDate: { date3: true } },
        { upsert: true }
      );
      if (!nowDate) {
        return res.status(404).json({ message: "now Date on Mongo not found" });
      }
    }

    // get the testsList from MongoDB which is Array B:

    // calculate the consumption from the testsList in MongoDB
    // need to add the testsList
    const applyConsumptionToMongoData = subtractArrays(
      JSON.parse(consumptionArray),
      testsListFromMongo
    );

    // update the testsList in MongoDB with the updated consumption
    /*
    const query = { testsList: { $exists: true } };
    const updateDocument = { $set: { testsList: applyConsumptionToMongoData } };
    const result = await collectionInventory2.updateOne(query, updateDocument);
    client.close();
*/
    //
    // update the specialTestsList in MongoDB with the updated consumption added this code here:
    const query = { specialTestsList: { $exists: true } };
    const updateDocument = {
      $set: { specialTestsList: applyConsumptionToMongoData },
    };
    const result = await collectionSpecialTests.updateOne(
      query,
      updateDocument
    );
    client.close();

    return {
      props: {
        dateValue: dateValue,
        consumptionArray: consumptionArray,
        applyConsumptionToMongoData: applyConsumptionToMongoData,
      },
    };
  } catch (error) {
    // Log the error message and return an empty props object
    console.error(error.message);
  }
}

export default function Home(props) {
  const dateValue = props.dateValue;
  console.log("getPreviousDate()", getPreviousDate(dateValue));
  const previousDateDetails = getPreviousDate(dateValue);
  console.log("getNowDate()", getNowDate());
  const nowDateDetails = getNowDate();
  console.log("now hours", nowDateDetails.hours);
  const consumptionArray = props.consumptionArray;
  console.log("consumptionArray", consumptionArray);
  const applyConsumptionToMongoData = props.applyConsumptionToMongoData;
  console.log("applyConsumptionToMongoData", applyConsumptionToMongoData);

  return (
    <>
      <h1>Value for get Date: {dateValue}</h1>
    </>
  );
}
