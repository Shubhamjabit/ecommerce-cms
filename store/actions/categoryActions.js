export const SAVE_IMG_STATUS = 'SAVE_BANNER_IMG';

export const updateStatusAction = (data) => {
  console.log('UPDATE ACTION CALLED :', data);
  return {
    type: SAVE_IMG_STATUS,
    data,
  };
};

//Action Types
export const SET_CATEGORY = 'SET_CATEGORY';

export const setCategory = (category) => {
  return {type: SET_CATEGORY, category: category};
};
