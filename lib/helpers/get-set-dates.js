export const getPreviousDate = (dateValue) => {
  const previousDate = new Date(JSON.parse(dateValue));
  const previousDateDetails = {
    day: previousDate.getDate(), // e.g. 26
    month: previousDate.getMonth() + 1, // e.g. 3
    year: previousDate.getFullYear(), // e.g. 2023
    hours: previousDate.getHours(), // e.g. 15
    minute: previousDate.getMinutes(), // e.g. 19
  };
  console.log("previousDateDetails", previousDateDetails);
  return previousDateDetails;
};

export const getNowDate = () => {
  const nowLocalDate = new Date();
  console.log("typeof nowLocalDate", typeof nowLocalDate);

  const nowDateDetails = {
    day: nowLocalDate.getDate(), // e.g. 26
    month: nowLocalDate.getMonth() + 1, // e.g. 3
    year: nowLocalDate.getFullYear(), // e.g. 2023
    hours: nowLocalDate.getHours(), // e.g. 15
    minute: nowLocalDate.getMinutes(), // e.g. 19
  };
  console.log("nowDateDetails", nowDateDetails);
  return nowDateDetails;
};
