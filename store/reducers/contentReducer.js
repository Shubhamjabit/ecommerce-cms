import {SET_CONTENT, SAVE_CONTENT_DATA} from '../actions/contentActions';

const initialState = {
  content: null,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONTENT:
      return {...state, content: action.content};
    case SAVE_CONTENT_DATA:
      return {...state, content: action.content};
    default:
      return {...state};
  }
};

export default contentReducer;
