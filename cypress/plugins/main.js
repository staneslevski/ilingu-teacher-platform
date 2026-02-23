import { createCognitoUser } from "./AWS/cognito/createCognitoUser";
import { confirmCognitoUser } from "./AWS/cognito/confirmCognitoUser";
import { createAndConfirmCognitoUser } from "./AWS/cognito/createAndConfirmCognitoUser";
import { deleteCognitoUser } from "./AWS/cognito/deleteCognitoUser";
import { getStackResources } from "./AWS/cloudformation/getStackResources";
import { getDynamoDbTables } from "./AWS/dynamoDB/getDynamoDbTables";
import { createStudentProfile } from "./student/createStudentProfile";
import { cognitoUserExistsOrCreate } from "./AWS/cognito/cognitoUserExistsOrCreate";
import { cognitoUserAbsentOrDelete } from "./AWS/cognito/cognitoUserAbsentOrDelete";
import { getConfirmCode } from "./mailgun/getConfirmCode";
import { seedData } from "./AWS/graphQl/seedData";
import {createAndConfirmUser} from "./AWS/graphQl/createAndConfirmUser";


export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    createCognitoUser,
    confirmCognitoUser,
    createAndConfirmCognitoUser,
    deleteCognitoUser,
    getStackResources,
    getDynamoDbTables,
    createStudentProfile,
    cognitoUserExistsOrCreate,
    cognitoUserAbsentOrDelete,
    getConfirmCode,
    seedData,
    createAndConfirmUser,
  });
};
