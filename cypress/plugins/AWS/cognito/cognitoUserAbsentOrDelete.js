import * as AWS from "aws-sdk";
import testingConfig from "../../../../cypress.env";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: "ap-northeast-1"
});

export async function cognitoUserAbsentOrDelete(userToTest) {
  return new Promise((resolve, reject) => {
    const listParams = {
      UserPoolId: testingConfig.amplify.Auth.userPoolId, /* required */
      AttributesToGet: null,
    };
    cognitoIdentityServiceProvider.listUsers(listParams, (error, data) => {
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
          const deleteParams = {
            UserPoolId: testingConfig.amplify.Auth.userPoolId, /* required */
            Username: usersByEmail[userToTest.email].Username /* required */
          };
          cognitoIdentityServiceProvider.adminDeleteUser(deleteParams, function(err, data) {
            if (err) {
              console.log(err, err.stack);
              reject(err)
            } else {
              console.log(data);
              resolve("deleted! ", data)
            }
          });
        } else {
          resolve("user is already absent")
        }
      }
    });
  });
}