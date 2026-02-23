import {
  REQUEST_STUDENT,
  RECEIVE_STUDENT,
  REQUEST_TEACHER,
  RECEIVE_TEACHER,
  REQUEST_AVATAR_URL,
  RECEIVE_AVATAR_URL,
  UPLOADING_AVATAR,
  UPLOADED_AVATAR,
  REQUEST_ADDRESSES,
  RECEIVE_ADDRESSES,
  CHANGING_DEFAULT_ADDRESSES,
  CHANGED_DEFAULT_ADDRESSES,
  ADDING_ADDRESS,
  ADDED_ADDRESS,
  REQUEST_USER_GROUPS,
  RECEIVE_USER_GROUPS,
  UPDATE_TEACHER_RETURN,
  UPDATE_TEACHER_START,
  FETCH_TEACHER_DATA_START,
  FETCH_TEACHER_DATA_RETURN,
} from "../action-types";

import defaultAvatar from "../../assets/img/default_avatar.png";

export default function getUserInfo(
  state = {
    addresses: [],
    avatarURL: undefined,
    courses: [],
    lessons: [],
    student: {},
    teacher: {
      availabilitySlots: [],
    },
    userGroups: [],
    isLoadingAvatarURL: false,
    isLoadingAddresses: false,
    isAddingAddress: false,
    isLoadingUserGroups: false,
    isLoadingStudent: false,
    isLoadingTeacher: false,
    isLoadingTeacherData: false,
    isUpdatingTeacher: false,
    changingToDefaultAddressId: undefined
  },
  action
) {
  switch (action.type) {
    case UPDATE_TEACHER_START:
      return Object.assign({}, state, {
        isUpdatingTeacher: action.isUpdatingTeacher,
      });
    case UPDATE_TEACHER_RETURN:
      let avatarURL;
      if (action.teacher.hasOwnProperty("avatarURL")) {
        avatarURL = action.teacher.avatarURL
      } else {
        avatarURL = defaultAvatar;
      }
      return Object.assign({}, state, {
        isUpdatingTeacher: action.isUpdatingTeacher,
        teacher: action.teacher,
        avatarURL: avatarURL,
      });
    case REQUEST_USER_GROUPS:
      return Object.assign({}, state, {
        isLoadingUserGroups: action.isLoadingUserGroups
      });
    case RECEIVE_USER_GROUPS:
      return Object.assign({}, state, {
        isLoadingUserGroups: action.isLoadingUserGroups,
        userGroups: action.userGroups,
      });
    case REQUEST_STUDENT:
      return Object.assign({}, state, {
        isLoadingStudent: action.isLoadingStudent
      });
    case RECEIVE_STUDENT:
      return Object.assign({}, state, {
        student: action.student,
        isLoadingStudent: action.isLoadingStudent
      });
    case REQUEST_TEACHER:
      return Object.assign({}, state, {
        isLoadingTeacher: action.isLoadingTeacher
      });
    case RECEIVE_TEACHER:
      return Object.assign({}, state, {
        teacher: action.teacher,
        avatarURL: action.teacher.avatarURL,
        isLoadingTeacher: action.isLoadingTeacher
      });
    case REQUEST_AVATAR_URL:
      return Object.assign({}, state, {
        isLoadingAvatarURL: action.isLoadingAvatarURL
      });
    case RECEIVE_AVATAR_URL:
      return Object.assign({}, state, {
        avatarURL: action.avatarURL,
        isLoadingAvatarURL: action.isLoadingAvatarURL
      });
    case UPLOADING_AVATAR:
      return Object.assign({}, state, {
        isUploadingAvatar: action.isUploadingAvatar
      });
    case UPLOADED_AVATAR:
      return Object.assign({}, state, {
        isUploadingAvatar: action.isUploadingAvatar
      });
    case REQUEST_ADDRESSES:
      return Object.assign({}, state, {
        isLoadingAddresses: action.isLoadingAddresses
      });
    case RECEIVE_ADDRESSES:
      return Object.assign({}, state, {
        addresses: action.addresses,
        isLoadingAddresses: action.isLoadingAddresses
      });
    case CHANGING_DEFAULT_ADDRESSES:
      return Object.assign({}, state, {
        changingToDefaultAddressId: action.changingToDefaultAddressId
      });
    case CHANGED_DEFAULT_ADDRESSES:
      return Object.assign({}, state, {
        changingToDefaultAddressId: undefined
      });
    case ADDING_ADDRESS:
    case ADDED_ADDRESS:
      return Object.assign({}, state, {
        isAddingAddress: action.isAddingAddress
      });
    case FETCH_TEACHER_DATA_START:
      return Object.assign({}, state, {
        isLoadingTeacherData: action.isLoadingTeacherData
      });
    case FETCH_TEACHER_DATA_RETURN:
      return Object.assign({}, state, {
        isLoadingTeacherData: action.isLoadingTeacherData,
        courses: action.courses,
        lessons: action.lessons,
      });
    default:
      return state;
  }
}
