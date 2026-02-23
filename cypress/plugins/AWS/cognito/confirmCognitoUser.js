 import testConfig from "../../../../cypress.env";
import * as AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: "ap-northeast-1"
});

export const confirmCognitoUser = async (userSub) => {
  console.log("confirmCogUser: userData", userSub);
  const params = {
    UserPoolId: testConfig.amplify.Auth.userPoolId, /* required */
    Username: userSub /* required */
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminConfirmSignUp(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err)
      } else {
        console.log("User has been successfully confirmed");
        console.log(data);
        resolve("User has been successfully confirmed");
      }
    });
  });
};