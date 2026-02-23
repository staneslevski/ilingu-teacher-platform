import {
  REQUEST_STUDENT,
  RECEIVE_STUDENT,
  REQUEST_AVATAR_URL,
  RECEIVE_AVATAR_URL,
  UPLOADING_AVATAR,
  UPLOADED_AVATAR,
  REQUEST_ADDRESSES,
  RECEIVE_ADDRESSES,
  CHANGING_DEFAULT_ADDRESSES,
  CHANGED_DEFAULT_ADDRESSES,
  ADDING_ADDRESS,
  ADDED_ADDRESS
} from "../action-types";

export default function getUserInfo(
  state = {
    isLoadingStudent: false,
    student: {},
    isLoadingAvatarURL: false,
    avatarURL: undefined,
    isLoadingAddresses: false,
    addresses: [],
    isAddingAddress: false,
    changingToDefaultAddressId: undefined
  },
  action
) {
  switch (action.type) {
    case REQUEST_STUDENT:
      return Object.assign({}, state, {
        isLoadingStudent: action.isLoadingStudent
      });
    case RECEIVE_STUDENT:
      return Object.assign({}, state, {
        student: action.student,
        isLoadingStudent: action.isLoadingStudent
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
    default:
      return state;
  }
}
