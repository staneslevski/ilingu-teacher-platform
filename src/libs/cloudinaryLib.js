import { API } from "aws-amplify";

export async function getUploadWidget() {
  return await API.get('cloudinaryWidget', "", {})
}