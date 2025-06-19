import {SET_REVIEW} from '../actions/reviewActions';

const initialState = {
    review: null
  };

  const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_REVIEW:
        return {...state, review: action.review};
      default:
        return {...state};
    }
  };
  
  export default reviewReducer;