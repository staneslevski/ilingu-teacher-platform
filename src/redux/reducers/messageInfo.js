import { GET_ERROR_MESSAGE, CLEAR_ERROR_MESSAGE } from "../action-types";

export default function Message(state = {}, action) {
  switch (action.type) {
    case GET_ERROR_MESSAGE:
      return Object.assign({}, state, {
        msg: action.msg
      });
    case CLEAR_ERROR_MESSAGE:
      return Object.assign({}, state, {
        msg: null
      });
    default:
      return state;
  }
}
