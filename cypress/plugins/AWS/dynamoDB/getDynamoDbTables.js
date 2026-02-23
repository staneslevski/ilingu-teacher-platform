import { getStackResources } from "../cloudformation/getStackResources";
import * as AWS from "aws-sdk";

const cloudformation = new AWS.CloudFormation({
  apiVersion: '2010-05-15',
  region: "ap-northeast-1"
});

export const getDynamoDbTables = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let resp = await getStackResources();
      let stackResources = resp.StackResourceSummaries;
      console.log("nt", resp.NextToken);
      let keepGoing = resp.hasOwnProperty('NextToken');
      console.log("kg init", keepGoing);
      while (keepGoing === true) {
        console.log("kg loop", keepGoing);
        let nextResp = await getStackResources(resp.NextToken);
        stackResources = [
          ...stackResources,
          ...nextResp.StackResourceSummaries
        ];
        keepGoing = nextResp.hasOwnProperty('NextToken');
      }
      stackResources.forEach(resource => {
        console.log(resource.ResourceType)
      });
      console.log(Object.keys(stackResources[0]));
      const DDBNestedStack = stackResources.filter(resource =>
        resource.LogicalResourceId === 'DynamoDbNestedStack'
      );
      // stackResources = stackResources.filter(item =>
      //   ((item.ResourceType ===  "AWS::DynamoDB::Table")
      //     || (item.ResourceType === "AWS::CloudFormation::Stack"))
      // );
      // console.log("DDB or nestedStacks: ", stackResources);
      console.log("DDBNestedStack: ", DDBNestedStack);

      let params = {
        StackName: DDBNestedStack[0].PhysicalResourceId,
      };
      await cloudformation.listStackResources(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          // reject(err);
        } else {
          console.log("list DDBNestedStack", data);
          console.log(data.StackResourceSummaries.length);
          return resolve(data.StackResourceSummaries)
          // resolve(data)
        }
      });
    } catch (e) {
      return reject(e)
    }
  })
};