import testConfig from "../../../../cypress.env";
import * as AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: "ap-northeast-1"
});

export const createCognitoUser = async (userData) => {
  let params = {
    ClientId: testConfig.amplify.Auth.userPoolWebClientId, /* required */
    Password: userData.password, /* required */
    Username: userData.email, /* required */
    UserAttributes: [
      {
        Name: 'email', /* required */
        Value: userData.email
      },
    ],
    ValidationData: [
      {
        Name: 'email', /* required */
        Value: userData.email
      },
    ]
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.signUp(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("successfully created new user");
        console.log(data);
        resolve(data);
      }
    });
  });
};