import { API } from "aws-amplify";
import {getUserId} from "../../user";

// create
export default async function main(lessonId) {
  const userId = await getUserId();
  return await API.del("ilingu", `/lessons/${lessonId}`, {
    body: {
      cancellingUserId: userId,
    }
  });
}