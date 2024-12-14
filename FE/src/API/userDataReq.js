import http from "./http";

export const fetchAllUsers = async () => {
  const response = await http.get("/users");
  return response.data;
};
