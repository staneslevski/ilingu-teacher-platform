// import {testStudentProfile} from "../../../fixtures/student/testStudentProfile";
import { getDynamoDbTables } from "./getDynamoDbTables";
import * as AWS from "aws-sdk";

export async function createStudentProfile(studentProfile) {
  const dynamoDb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: "ap-northeast-1",
  });
  let ddbTables = await getDynamoDbTables();
  let studentTable = ddbTables.filter(table => table.PhysicalResourceId === 'testing-StudentTable');
  studentTable = studentTable[0];

  // if (studentProfile === null || studentProfile === undefined) {
  //   studentProfile = testStudentProfile;
  // }
  const params = {
    Item: studentProfile,
    TableName: studentTable.PhysicalResourceId
  };

  return new Promise((resolve, reject) => {
    dynamoDb.putItem(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        console.log("createStudentProfile result: ", data);
        resolve(data)
      }           // successful response
    });
  })
}