import { API } from "aws-amplify";

// create
export default async function main(userId, file, options) {
  console.log("typeof file: ", typeof file);
  console.log("file: ", file);

  return await API.post("ilingu", `/teachers/${userId}/avatar`, {
    body: {
      image: file
    }
  });
}