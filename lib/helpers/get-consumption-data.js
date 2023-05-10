export const getConsumptionData = async (previousDate, nowDate) => {
  const panelTypes = [];
  const res = await fetch(
    `${process.env.LIS_LAB_URL}/api2/integration/worklist/${previousDate.year}-${previousDate.month}-${previousDate.day}%20${previousDate.hours}:${previousDate.minute}:00:00/${nowDate.year}-${nowDate.month}-${nowDate.day}%20${nowDate.hours}:${nowDate.minute}:00:00`,
    { mode: "cors" }
  ).then((response) => {
    return response.json().then((data) => {
      console.log("data", data);

      return data;
    });
  });
  console.log("res.length for number of patients", res.length);
  // need to add res.length to get syringes consumption

  for (const key in res) {
    for (const myItem in res[key].panels) {
      panelTypes.push(res[key].panels[myItem].report_name);
    }
  }

  const custFreq = panelTypes.reduce((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;

    return acc;
  }, {});

  const finalArray = [];

  for (const key in custFreq) {
    finalArray.push({
      name: key,
      frequency: custFreq[key],
    });
  }

  return JSON.stringify(finalArray);
};
