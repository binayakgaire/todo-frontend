import axios from "axios";

export const sendEmail = async (name, email, message, subject) => {
  let response = await axios.post("http://161.35.52.83:9000/api/email", {
    name,
    email,
    message,
    subject,
  });

  console.log("Mailer response");
  console.log(response);
  return response.data;
};
