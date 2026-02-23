import * as AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
  // other service API versions
};

const dynamodb = new AWS.DynamoDB();


/* This example lists all of the tables associated with the current AWS account and endpoint. */

export function listAllTables() {
  let params = {
  };

  dynamodb.listTables(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
     TableNames: [
        "Forum",
        "ProductCatalog",
        "Reply",
        "Thread"
     ]
    }
    */
  });
}
