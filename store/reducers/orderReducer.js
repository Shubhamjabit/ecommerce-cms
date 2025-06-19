import {SET_ORDER_DETAILS} from '../actions/orderActions';
import {SET_ITEM_DETAILS} from '../actions/orderActions';

const initialState = {
  orderDetails: [],
  itemDetails: [],
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_DETAILS:
      return {...state, orderDetails: action.payload};
    case SET_ITEM_DETAILS:
      return {...state, itemDetails: action.payload};
    default:
      return {...state};
  }
};

export default orderReducer;
