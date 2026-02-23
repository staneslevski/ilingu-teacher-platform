import * as AWS from "aws-sdk";

const cloudformation = new AWS.CloudFormation({
  apiVersion: '2010-05-15',
  region: "ap-northeast-1"
});


export async function recursiveFetch(token) {
  let resp = await getStackResources(token);
  let stackResources = resp.StackResourceSummaries;
  if (resp.NextToken === null) {
    return stackResources;
  } else {
    let newResp = await getStackResources(resp.NextToken);
    stackResources = [
      ...stackResources,
      ...newResp.StackResourceSummaries,
    ];
    return stackResources
  }
}

export const getDDBTables = () => {
  return new Promise((resolve, reject) => {
    try {
      let resp = getStackResources();
      let stackResources = resp.StackResourceSummaries;
      let keepGoing = resp.NextToken !== null;
      while (keepGoing === true) {
        let nextResp = getStackResources(resp.NextToken);
        stackResources = [
          ...stackResources,
          ...nextResp.StackResourceSummaries
        ];
        keepGoing = nextResp.NextToken
      }
      resolve(stackResources)
    } catch (e) {
      reject(e)
    }
    //
    //
    // cloudformation.listStackResources(params, function(err, data) {
    //   if (err) {
    //     console.log(err, err.stack);
    //     reject(err);
    //   }
    //   else {
    //     console.log(data.NextToken);
    //     data.StackResourceSummaries = data.StackResourceSummaries.filter(item =>
    //       item.ResourceType === ( "AWS::DynamoDB::Table"  || "AWS::CloudFormation::Stack")
    //     );
    //     resolve(data)
    //   }
    // });
  })
};


export const getStackResources = (token) => {
  let params = {
    StackName: 'ilingu-api-testing', /* required */
  };
  if (token !== (undefined || null)) {
    params = {
      ...params,
      NextToken: token,
    }
  }
  return new Promise((resolve, reject) => {
    cloudformation.listStackResources(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      }
      else {
        console.log(data.NextToken);
        resolve(data)
      }
    });
  })
};
