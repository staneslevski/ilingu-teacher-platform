import rp from "request-promise";
import testingConfig from "../../../cypress.env"

export const createStudentProfile = async (profileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseURL = testingConfig.amplify.API.endpoints[0].endpoint;

      const options = {
        method: 'POST',
        uri: `${baseURL}/students`,
        body: profileData,
        json: true // Automatically stringifies the body to JSON
      };

      await rp(options).then((parsedBody) => {
        console.log("parsedb", parsedBody);
          return resolve(parsedBody)
        })
    } catch (e) {
      return reject(e)
    }
  })
};

