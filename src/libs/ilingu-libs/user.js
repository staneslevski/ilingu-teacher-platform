import { API, Auth, Storage } from "aws-amplify";
import s3Upload from "../awsLib";

export async function getUserId() {
  try {
    let user = await Auth.currentAuthenticatedUser();
    return user.username;
  } catch (e) {
    console.log(e);
  }
}

export async function createNewUser(email, password) {
  try {
    return await Auth.signUp({
      username: email,
      password: password
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getAvatarURL(avatar) {
  try {
    if (avatar === undefined) {
      return require("assets/img/default_avatar.png")
    } else {
      return await Storage.vault.get(avatar);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function uploadAvatar(file) {
  try {
    return await s3Upload(file);
  } catch (e) {
    console.log(e);
  }
}

export async function listAddresses(userId) {
  try {
    return await API.get("addresses", `/addresses/${userId}`, {});
  } catch (e) {
    console.log(e);
  }
}

export async function addAddress(userId, address) {
  let addressBody = {
    userId: userId,
    country: address.country,
    postCode: address.postCode,
    state: address.state,
    city: address.city,
    addressLine1: address.addressLine1
  };
  if (address.addressLine2) {
    addressBody.addressLine2 = address.addressLine2;
  }
  if (address.addressLine3) {
    addressBody.addressLine3 = address.addressLine3;
  }
  return API.post("addresses", "/addresses", {
    body: addressBody
  });
}

export async function changeDefaultAddress(userId, addressId) {
  return await API.put("addresses", `/addresses/active/${userId}`, {
    body: { addressId: addressId }
  });
}

export async function updateZohoBooksContact(zohoContactID, student, address) {
  let data = {
    contact_name: student.studentName.concat(" - ", student.userId),
    billing_address: {
      address: `${address.addressLine1} ${address.addressLine2}
       ${address.addressLine3}`,
      city: address.city,
      state: address.state,
      zip: address.postCode,
      country: address.country
    }
  };
  return await API.put("zoho-book", `/zoho-book/contacts/${zohoContactID}`, {
    body: data
  });
}
