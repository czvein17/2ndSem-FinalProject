import axios from "axios";
import http from "./http";

export const loginViaEmailAndPassword = async ({ email, password }) => {
  console.log("email", email);
  console.log("password", password);
  const res = await http.post("/signin/email", {
    email,
    password,
  });
  return res.data;
};

export const loginViaGoogle = async (codeResponse) => {
  const accessToken = codeResponse.access_token;

  try {
    // Fetch user information using the access token
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const serverRes = await http.post("/signin/google", {
      userInfo: res.data,
    });

    return serverRes.data;
  } catch (error) {
    console.error(error);
  }
};
