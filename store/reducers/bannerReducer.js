import {SET_BANNER} from '../actions/bannerActions';

const initialState = {
  banner: null,
};

const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BANNER:
      console.log('SET_BANNER action.banner = ', action.banner);
      return {...state, banner: action.banner};
    default:
      return {...state};
  }
};

export default bannerReducer;
