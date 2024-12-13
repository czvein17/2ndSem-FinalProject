import http from "./http";

export const loginViaEmailAndPassword = async (email, password) => {
  try {
    const res = await http.post(
      "/signin/email",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    // console.error(error);
    return error.response;
  }
};

export const loginViaGoogle = async (codeResponse) => {
  const accessToken = codeResponse.access_token;

  try {
    // Fetch user information using the access token
    const res = await http.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const serverRes = await http.post(
      "/signin/google",
      {
        userInfo: res.data,
      },
      { withCredentials: true }
    );

    return serverRes.data;
  } catch (error) {
    console.error(error);
  }
};
