export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options) + " " + date.toLocaleTimeString("en-us");
};
