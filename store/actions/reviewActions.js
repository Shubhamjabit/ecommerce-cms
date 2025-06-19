//Action Types
export const SET_REVIEW = 'SET_REVIEW';

export const setReview = (review) => {
  return {type: SET_REVIEW, review: review};
};