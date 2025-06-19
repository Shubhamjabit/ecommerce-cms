import {SET_USER} from '../actions/userActions';
import {SET_CMS_USERS} from '../actions/userActions';

const initialState = {
  user: null,
  cmsUsers: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.user};
    case SET_CMS_USERS:
      return {...state, cmsUsers: action.cmsUsers};
    default:
      return {...state};
  }
};

export default userReducer;
