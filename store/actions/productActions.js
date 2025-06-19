//Action Types
export const MODAL_EDIT_PRODUCT = 'MODAL_EDIT_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';
export const SET_PRODUCT_TOTAL = 'SET_PRODUCT_TOTAL';
export const SET_PRODUCT_MEDIA = 'SET_PRODUCT_MEDIA';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const SAVE_PRODUCT_DATA = 'SAVE_PRODUCT_DATA';

export const editProductModal = (state) => {
  return {type: MODAL_EDIT_PRODUCT, state: !state};
};

export const setProduct = (product) => {
  localStorage.setItem('product', JSON.stringify(product));
  return {type: SET_PRODUCT, product: product};
};

export const setProductTotal = (totalProducts) => {
  return {type: SET_PRODUCT_TOTAL, totalProducts: totalProducts};
};

export const setProductMediaList = (productMedia) => {
  console.log('setProductMediaList');
  return {type: SET_PRODUCT_MEDIA, productMedia: productMedia};
};

export const setValueWhenProduUpdate = (res) => {
  return {type: UPDATE_STATUS, response: res};
};

export const initProduct = () => {
  const product = JSON.parse(localStorage.getItem('product'))
    ? JSON.parse(localStorage.getItem('product'))
    : null;
  return {type: SAVE_PRODUCT_DATA, product: product};
};
