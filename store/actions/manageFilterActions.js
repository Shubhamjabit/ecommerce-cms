//Action Types
export const SET_MANAGE_FILTER_DATA = 'SET_MANAGE_FILTER_DATA';
export const SET_MANAGE_SubcatTitle_DATA = 'SET_MANAGE_SubcatTitle_DATA';

export const setManageFilterData = (data) => {
  // console.log('setManageFilterData ACTION CALLED :', data);
  return {type: SET_MANAGE_FILTER_DATA, data: data};
};

export const setManageSubcatTitlteData = (data) => {
  console.log('setManageFilterData ACTION CALLED :', data);
  return {type: SET_MANAGE_SubcatTitle_DATA, data: data};
};
