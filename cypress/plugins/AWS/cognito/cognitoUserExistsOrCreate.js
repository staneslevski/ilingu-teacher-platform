import testConfig from "../../../../cypress.env";
import * as AWS from "aws-sdk";

import { createAndConfirmCognitoUser } from "./createAndConfirmCognitoUser";

export async function cognitoUserExistsOrCreate(userToTest) {
// list all users in student group
  return new Promise((resolve, reject) => {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: "ap-northeast-1"
    });

    const params = {
      UserPoolId: testConfig.amplify.Auth.userPoolId, /* required */
      AttributesToGet: null,
    };
    cognitoIdentityServiceProvider.listUsers(params, async (error, data) => {
      if (error) {
        console.log("error: ", error);
        reject(error);
      } else {
        console.log("success! ", JSON.stringify(data));
        let usersByEmail = {};
        data.Users.forEach(user => {
          let userEmailAttribute = user.Attributes.filter(attribute => attribute.Name === "email");
          console.log("uEA: ", userEmailAttribute);
          usersByEmail = {
            ...usersByEmail,
            [userEmailAttribute[0].Value]: user,
          }
        });
        console.log(usersByEmail);
        if (usersByEmail.hasOwnProperty(userToTest.email)) {
          resolve("user already exists");
        } else {
          resolve(await createAndConfirmCognitoUser(userToTest))
        }
      }
    })
  })
}