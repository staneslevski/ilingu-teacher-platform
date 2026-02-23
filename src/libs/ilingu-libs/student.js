import { API } from "aws-amplify";
import { getUserId } from "./user";

// create
export async function createStudent(student) {
  return await API.post("students", "/students", {
    body: student
  });
}

// retrieve
export async function getStudent(studentId) {
  try {
    return await API.get("students", `/students/${studentId}`, {})
  } catch (e) {
    console.log(e);
  }
}

// update
export async function updateStudent(userId, data) {
  return await API.put("students", `/students/${userId}`, {
    body: data
  });
}


export async function getStudentFromUser() {
  try {
    let userId = await getUserId();
    return await getStudent(userId);
  } catch (e) {
    console.log(e);
  }
}
