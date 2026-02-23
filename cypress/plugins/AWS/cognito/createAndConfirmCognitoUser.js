import { createCognitoUser } from "./createCognitoUser";
import { confirmCognitoUser } from "./confirmCognitoUser";
import { createStudentProfile } from "../dynamoDB/createStudentProfile";
import moment from "moment";
import { defaultAvatar } from "../../../fixtures/defaultAvatar";

export const createAndConfirmCognitoUser = async (userType) => {
  try {
    let returnValue = null;
    let currentTime = moment.utc();
    await createCognitoUser(userData).then(async createUserResult => {
      let studentProfile = {
        userId: {
          S: createUserResult.UserSub
        },
        studentName: {
          S: userData.studentName
        },
        email: {
          S: userData.email
        },
        createdAtMS: {
          S: currentTime.format('x')
        },
        // avatar: JSON.stringify(defaultAvatar),
        avatarURL: {
          S: defaultAvatar.secure_url
        }
      };
      returnValue = await createStudentProfile(studentProfile).then(async res => {
        console.log("res: ", res);
        // test if you can pull the mailGun message in time
        // answer: no. You'll nee to wait about a second for the messages to be delivered
        // let mailgunMessages = await mailGunGetMessages();
        // console.log(mailgunMessages);
        // console.log(currentTime.format());
        // mailgunMessages.forEach(message => {
        //   console.log(moment.utc(message.timestamp, 'X').format());
        // });
        let promises = [confirmCognitoUser(createUserResult.UserSub), ];
        await Promise.all(promises);

      });
      console.log("returnValue: ", returnValue);
    });
    return returnValue;
  } catch (e) {
    console.log(e)
  }
};