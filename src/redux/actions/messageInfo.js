import { GET_ERROR_MESSAGE, CLEAR_ERROR_MESSAGE } from "../action-types";

export const getErrorMessage = msg => ({
  type: GET_ERROR_MESSAGE,
  msg: msg
});

export const clearErrorMessage = () => ({
  type: CLEAR_ERROR_MESSAGE
});
