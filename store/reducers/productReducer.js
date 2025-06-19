import {
  MODAL_EDIT_PRODUCT,
  SET_PRODUCT,
  SET_PRODUCT_TOTAL,
  UPDATE_STATUS,
  SET_PRODUCT_MEDIA,
  SAVE_PRODUCT_DATA,
} from '../actions/productActions';

const initialState = {
  editProductModal: false,
  product: null,
  response: null,
  productMedia: null,
  totalProducts: null,
};
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODAL_EDIT_PRODUCT:
      return {...state, editProductModal: action.state};
    case SET_PRODUCT:
      return {...state, product: action.product};
    case SET_PRODUCT_TOTAL:
      return {...state, totalProducts: action.totalProducts};
    case SAVE_PRODUCT_DATA:
      return {...state, product: action.product};
    case UPDATE_STATUS:
      return {...state, response: action.response};
    case SET_PRODUCT_MEDIA:
      return {...state, productMedia: action.productMedia};
    default:
      return {...state};
  }
};

export default productReducer;
