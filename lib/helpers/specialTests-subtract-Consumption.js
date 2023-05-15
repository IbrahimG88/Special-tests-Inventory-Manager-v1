// Define a function to subtract A from B
// Array A is consumption array from LIS with frequencies
// Array B is the testsList array from MongoDB with stocks and stocksArrays
export const subtractArrays = (A, B) => {
  //console.log("A", A);
  // console.log("B", B);

  const perRegisteredPatients = A.find(
    (obj) => obj.name === "numberOfRegisteredPatients"
  );

  console.log("perRegisteredPatients length:", perRegisteredPatients.frequency);

  A.forEach((objA) => {
    console.log("objA", objA);

    ///New code special tests:
    // B is the specialTestsArray that includes connections to lis tests
    //  change: let objB = B.specialTestsList.find((b) => b.testConnections === objA.name);//only this line needs changes
    ///

    B.specialTestsList.forEach((specialTest) => {
      //syringes code part:
      if (specialTest.perPatient && objA.name === perRegisteredPatients.name) {
        specialTest.totalStocks = Math.max(
          specialTest.totalStocks - objA.frequency,
          0
        );
        // Sort the stocksArray of objB by expiryDate in ascending order
        // Use ?. to avoid errors if stocksArray does not exist
        specialTest.stocksArray?.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        // Initialize a variable to store the remaining frequency to subtract
        let remaining = objA.frequency;
        // Loop through each object in the stocksArray of objB
        // Use ?. to avoid errors if stocksArray does not exist
        for (let stock of specialTest.stocksArray ?? []) {
          // If the remaining frequency is less than or equal to the amount of stock, subtract it from the stock and break the loop
          if (remaining <= stock.amount) {
            stock.amount -= remaining;
            break;
          }
          // Otherwise, subtract the amount of stock from the remaining frequency and set the stock amount to zero
          else {
            remaining -= stock.amount;
            stock.amount = 0;
          }
          // Filter out any stocks that have zero amount
          specialTest.stocksArray = specialTest.stocksArray.filter(
            (stock) => stock.amount > 0
          );
        }
      }

      specialTest.testConnections.forEach((objB) => {
        console.log(objB.id);
        console.log(objB.testName);

        if (objB.testName === objA.name) {
          // B is specialTestsList
          //for each specialtest in B specialTestslist
          //

          // Find the matching object in B based on the name or testName property
          //  let objB = B.testsList.find((b) => b.testName === objA.name);// commented out this line
          console.log("objB", objB);
          // If there is a match, update the totalStocks and amount properties of objB
          if (objB) {
            // Subtract the frequency of objA from the totalStocks of objB
            // Use ?. to avoid errors if totalStocks does not exist
            // Use Math.max() to return either the result or zero
            specialTest.totalStocks = Math.max(
              specialTest.totalStocks - objA.frequency,
              0
            );
            // Sort the stocksArray of objB by expiryDate in ascending order
            // Use ?. to avoid errors if stocksArray does not exist
            specialTest.stocksArray?.sort(
              (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
            );
            // Initialize a variable to store the remaining frequency to subtract
            let remaining = objA.frequency;
            // Loop through each object in the stocksArray of objB
            // Use ?. to avoid errors if stocksArray does not exist
            for (let stock of specialTest.stocksArray ?? []) {
              // If the remaining frequency is less than or equal to the amount of stock, subtract it from the stock and break the loop
              if (remaining <= stock.amount) {
                stock.amount -= remaining;
                break;
              }
              // Otherwise, subtract the amount of stock from the remaining frequency and set the stock amount to zero
              else {
                remaining -= stock.amount;
                stock.amount = 0;
              }
              // Filter out any stocks that have zero amount
              specialTest.stocksArray = specialTest.stocksArray.filter(
                (stock) => stock.amount > 0
              );
            }
            // If there is no match, do nothing
          }
        }
      });
    });
  });
  // Return the updated array B
  console.log("B.specialTestsList", B.specialTestsList);

  return B.specialTestsList;
};
