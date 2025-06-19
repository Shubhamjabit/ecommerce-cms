export const SAVE_ORDER = 'SAVE_ORDER';

export const saveOrderAction = (data) => {
  console.log('SAVE_ORDER ACTION ON ORDER CALLED :', data);
  return {
    type: SAVE_ORDER,
    data,
  };
};

//Action Types
export const SET_ORDER_DETAILS = 'SET_ORDER_DETAILS';

export const setOrderDetailsAction = (order) => {
  console.log('SET_ORDER ACTION ON ORDER CALLED :', order);
  return {type: SET_ORDER_DETAILS, payload: order};
};

export const SET_ITEM_DETAILS = 'SET_ITEM_DETAILS';

export const setItemDetailsAction = (item) => {
  console.log('SET_ITEM_DETAILS ACTION ON ORDER CALLED :', item);
  return {type: SET_ITEM_DETAILS, payload: item};
};
