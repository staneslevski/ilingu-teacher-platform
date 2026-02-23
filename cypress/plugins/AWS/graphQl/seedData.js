import rp from "request-promise";
import testingConfig from "../../../../cypress.env";
import * as Sentry from "@sentry/browser";

Sentry.init(testingConfig.sentry);

export const seedData = (testName) => {
  return new Promise((resolve, reject) => {
    try {
      const baseUrl = testingConfig.amplify.API.endpoints[0].endpoint;
      let query = `
      mutation {
        seedDatabase(testName: "${testName}") {
          success
          message
        }
      }
      `;

      const options = {
        method: 'POST',
        uri: `${baseUrl}/graphql/testing`,
        body: JSON.stringify({
          query,
          variables: {
            testName: testName
          }
        })
      };

      rp(options).then((parsedBody) => {
        console.log("parsedb", parsedBody);
        resolve(parsedBody)
      })
    } catch (e) {
      console.log(e);
      Sentry.captureException(e);
      reject(e)
    }
  })
};

