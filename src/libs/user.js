import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

import config from "../config";


export async function resendConfirmationCode(email) {
  try {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    return cognitoUser
  } catch (e) {
    console.log(e);
    return e
  }
}