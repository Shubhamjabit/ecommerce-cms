export const SAVE_USER = 'SAVE_USER';
export const SET_CMS_USERS = 'SET_CMS_USERS';

export const updateStatusAction = (data) => {
  console.log('UPDATE ACTION CALLED :', data);
  return {
    type: SAVE_USER,
    data,
  };
};

//Action Types
export const SET_USER = 'SET_USER';

export const setUser = (user) => {
  return {type: SET_USER, user: user};
};

export const setCmsUsers = (cmsUsers) => {
  return {type: SET_CMS_USERS, cmsUsers: cmsUsers};
};
