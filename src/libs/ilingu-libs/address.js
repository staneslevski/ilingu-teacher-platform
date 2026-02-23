import { API } from "aws-amplify";

export async function createAddress(body) {
  return API.post("addresses", "/addresses", {
    body: body
  });
}

export async function listAddressesByUserId(userId) {
  try {
    return await API.get("addresses", `/addresses/${userId}`, {});
  } catch (e) {
    console.log(e);
    return e
  }
}