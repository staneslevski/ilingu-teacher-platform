import testConfig from "../../../../cypress.env"
import * as AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: "ap-northeast-1"
});

export const deleteCognitoUser = async (userSub) => {
  let params = {
    UserPoolId: testConfig.amplify.Auth.userPoolId, /* required */
    Username: userSub, /* required */
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminDeleteUser(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        console.log("successfully created new user");
        console.log(data);
        resolve(data);
      }
    });
  });
};