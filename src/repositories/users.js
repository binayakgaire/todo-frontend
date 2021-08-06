import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../utils/localStorage";

export const getAllUsers = async () => {
  try {
    let response = await axios.get("http://161.35.52.83:9000/api/user", {
      headers: {
        "auth-token": getToken(),
      },
    });

    console.log(response.data);
    return response.data;
  } catch (e) {
    toast.error(e.response.message);
  }
};
