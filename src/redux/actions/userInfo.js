import {
  REQUEST_USER_GROUPS,
  RECEIVE_USER_GROUPS,
  REQUEST_STUDENT,
  RECEIVE_STUDENT,
  REQUEST_TEACHER,
  RECEIVE_TEACHER,
  REQUEST_ADDRESSES,
  RECEIVE_ADDRESSES,
  CHANGING_DEFAULT_ADDRESSES,
  CHANGED_DEFAULT_ADDRESSES,
  ADDING_ADDRESS,
  ADDED_ADDRESS,
  UPDATE_TEACHER_START,
  UPDATE_TEACHER_RETURN,
  FETCH_TEACHER_DATA_START,
  FETCH_TEACHER_DATA_RETURN
} from "../action-types";
import { getErrorMessage } from "./messageInfo";

import { Auth } from "aws-amplify";

import {
  listAddresses,
  changeDefaultAddress as changeDefaultAddressAPI,
  addAddress as addAddressAPI,
  updateZohoBooksContact as updateZohoBooksContactAPI
} from "../../libs/ilingu-libs/user";
import {
  getStudentFromUser,
} from "../../libs/ilingu-libs/student";
import {
  getTeacherFromUser,
  updateTeacher as updateTeacherAPI,
  loadTeacherData,
} from "../../libs/ilingu-libs/teacher";


// teacher functions

export const requestTeacher = () => ({
  type: REQUEST_TEACHER,
  isLoadingTeacher: true
});

export const receiveTeacher = data => ({
  type: RECEIVE_TEACHER,
  teacher: data,
  isLoadingTeacher: false
});

export function fetchTeacher() {
  return function(dispatch) {
    dispatch(requestTeacher());

    return getTeacherFromUser().then(
      response => dispatch(receiveTeacher(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const fetchTeacherDataStart = () => ({
  type: FETCH_TEACHER_DATA_START,
  isLoadingTeacherData: true
});

export const fetchTeacherDataReturn = data => ({
  type: FETCH_TEACHER_DATA_RETURN,
  courses: data.courses,
  lessons: data.lessons,
  isLoadingTeacherData: false
});

export function fetchTeacherData(teacherId) {
  return function(dispatch) {
    dispatch(fetchTeacherDataStart());

    return loadTeacherData(teacherId).then(
      // response => console.log('response: ', response),
      response => dispatch(fetchTeacherDataReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateTeacherStart = () => ({
  type: UPDATE_TEACHER_START,
  isUpdatingTeacher: true,
});

export const updateTeacherReturn = (data) => ({
  type: UPDATE_TEACHER_RETURN,
  isUpdatingTeacher: false,
  teacher: data,
});

export function updateTeacher(userId, newData) {
  return function(dispatch) {
    dispatch(updateTeacherStart());

    return updateTeacherAPI(userId, newData)
      .then(
        response => dispatch(updateTeacherReturn(response)),
        error => dispatch(getErrorMessage(error.message || "API Internal Error"))
      );
  }
}


// student functions

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

// general user functions

export const requestUserGroups = () => ({
  type: REQUEST_USER_GROUPS,
  isLoadingUserGroups: true
});

export const receiveUserGroups = data => ({
  type: RECEIVE_USER_GROUPS,
  userGroups: data.idToken.payload["cognito:groups"],
  isLoadingUserGroups: false
});

export function fetchUserGroups() {
  return function(dispatch) {
    dispatch(requestUserGroups());

    return Auth.currentSession().then(
      response => dispatch(receiveUserGroups(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestAddresses = () => ({
  type: REQUEST_ADDRESSES,
  isLoadingAddresses: true
});

export const receiveAddresses = addresses => ({
  type: RECEIVE_ADDRESSES,
  addresses: addresses,
  isLoadingAddresses: false
});

export function fetchAddresses(userId) {
  return function(dispatch) {
    dispatch(requestAddresses());

    return listAddresses(userId).then(
      addresses => dispatch(receiveAddresses(addresses)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const changingDefaultAddress = addressId => ({
  type: CHANGING_DEFAULT_ADDRESSES,
  changingToDefaultAddressId: addressId
});

export const changedDefaultAddress = () => ({
  type: CHANGED_DEFAULT_ADDRESSES
});

export function changeDefaultAddress(userId, addressId) {
  return function(dispatch) {
    dispatch(changingDefaultAddress(addressId));

    return changeDefaultAddressAPI(userId, addressId).then(
      () => {
        dispatch(changedDefaultAddress());
        dispatch(fetchAddresses(userId));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const addingAddress = () => ({
  type: ADDING_ADDRESS,
  isAddingAddress: true
});

export const addedAddress = () => ({
  type: ADDED_ADDRESS,
  isAddingAddress: false
});

export function addAddress(userId, address) {
  return function(dispatch) {
    dispatch(addingAddress());

    return addAddressAPI(userId, address).then(
      () => {
        dispatch(addedAddress());
        dispatch(fetchAddresses(userId));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
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
