import {SET_MANAGE_FILTER_DATA} from '../actions/manageFilterActions';
import {SET_MANAGE_SubcatTitle_DATA} from '../actions/manageFilterActions';
const initialState = {
  data: null,
  dataForSubcatTitle: null,
};

const manageFilterReducer = (state = initialState, action) => {
  // console.log('FUNCTION REDUCER RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR', action);
  switch (action.type) {
    case SET_MANAGE_FILTER_DATA:
      // console.log(
      //   'manageFilterReducer REDUCER RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      //   action.data
      // );
      return {...state, data: action.data};
    case SET_MANAGE_SubcatTitle_DATA:
      console.log(
        'SET_MANAGE_SubcatTitle_DATA REDUCER RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
        action.data
      );
      return {...state, dataForSubcatTitle: action.data};
    default:
      return {...state};
  }
};

export default manageFilterReducer;
