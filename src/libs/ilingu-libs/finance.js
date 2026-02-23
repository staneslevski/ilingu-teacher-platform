import { API } from "aws-amplify";

export async function getBillingProfile(userId) {
  try {
    return await API.get(
      "students",
      `/students/billing-profile/${userId}/`,
      {}
    );
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function getSources(stripeCustomerId) {
  try {
    return await API.get("stripe", "/stripe/list-source", {
      queryStringParameters: {
        customerId: stripeCustomerId
      }
    });
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function attachSource(stripeCustomerId, sourceId) {
  return API.post("stripe", "/stripe/attach-source", {
    body: {
      customerId: stripeCustomerId,
      sourceId: sourceId
    }
  });
}

export async function deleteSource(stripeCustomerId, sourceId) {
  return API.del("stripe", "/stripe/detach-source", {
    body: {
      customerId: stripeCustomerId,
      sourceId: sourceId
    }
  });
}

export async function changeDefaultSource(stripeCustomerId, sourceId) {
  return await API.put("stripe", "/stripe/default-source", {
    body: {
      customerId: stripeCustomerId,
      sourceId: sourceId
    }
  });
}

export function toHumanPrice(x) {
  return Number.parseFloat(x).toFixed(2);
}