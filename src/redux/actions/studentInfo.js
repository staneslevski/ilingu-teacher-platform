import {
  REQUEST_STUDENT,
  RECEIVE_STUDENT,
  REQUEST_AVATAR_URL,
  RECEIVE_AVATAR_URL,
  UPLOADING_AVATAR,
  UPLOADED_AVATAR,
} from "../action-types";
import { getErrorMessage } from "./messageInfo";

import {
  getAvatarURL,
  uploadAvatar as uploadAvatarAPI,
  updateZohoBooksContact as updateZohoBooksContactAPI
} from "../../libs/ilingu-libs/user";
import {
  getStudentFromUser,
  updateStudent
} from "../../libs/ilingu-libs/student";
// import { getTeacherFromUser } from "libs/ilingu-libs/teacher";
import config from "../../config";

export const requestStudent = () => ({
  type: REQUEST_STUDENT,
  isLoadingStudent: true
});

export const receiveStudent = data => ({
  type: RECEIVE_STUDENT,
  student: data,
  isLoadingStudent: false
});

export function fetchStudent() {
  return function(dispatch) {
    dispatch(requestStudent());

    return getStudentFromUser().then(
      response => dispatch(receiveStudent(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestAvatarURL = () => ({
  type: REQUEST_AVATAR_URL,
  isLoadingAvatarURL: true
});

export const receiveAvatarURL = data => ({
  type: RECEIVE_AVATAR_URL,
  avatarURL: data,
  isLoadingAvatarURL: false
});

export function fetchAvatarURL(avatar) {
  return function(dispatch) {
    dispatch(requestAvatarURL());

    return getAvatarURL(avatar).then(
      response => dispatch(receiveAvatarURL(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const uploadingAvatar = () => ({
  type: UPLOADING_AVATAR,
  isUploadingAvatar: true
});

export const uploadedAvatar = () => ({
  type: UPLOADED_AVATAR,
  isUploadingAvatar: false
});

export function uploadAvatar(userId, file) {
  return async function(dispatch) {
    dispatch(uploadingAvatar());

    const ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (file && !ValidImageTypes.includes(file.type)) {
      dispatch(getErrorMessage("Please pick a image file."));
      return;
    }
    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      dispatch(
        getErrorMessage(
          `Please pick a file smaller than
           ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`
        )
      );
      return;
    }

    const avatar = await uploadAvatarAPI(file);

    return updateStudent(userId, { avatar: avatar })
      .then(
        () => dispatch(uploadedAvatar()),
        error =>
          dispatch(getErrorMessage(error.message || "API Internal Error"))
      )
      .then(() => dispatch(fetchAvatarURL(avatar)));
  };
}

export function updateZohoBooksContact(zohoContactID, student, address) {
  return function(dispatch) {
    return updateZohoBooksContactAPI(zohoContactID, student, address).then(
      () => {},
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}
