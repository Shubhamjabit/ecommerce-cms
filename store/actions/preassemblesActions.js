//Action Types
export const MODAL_EDIT_PREASSEMBLE_TERMINALS =
  'MODAL_EDIT_PREASSEMBLE_TERMINALS';
export const SET_PREASSEMBLE_TERMINALS = 'SET_PREASSEMBLE_TERMINALS';
export const SET_PREASSEMBLE_CABLES = 'SET_PREASSEMBLE_CABLES';
export const SET_PREASSEMBLE_TERMINALS_MEDIA =
  'SET_PREASSEMBLE_TERMINALS_MEDIA';
export const PREASSEMBLE_TERMINALS_UPDATE_STATUS =
  'PREASSEMBLE_TERMINALS_UPDATE_STATUS';
export const SAVE_PREASSEMBLE_TERMINALS_DATA =
  'SAVE_PREASSEMBLE_TERMINALS_DATA';

export const editProductModal = (state) => {
  return {type: MODAL_EDIT_PREASSEMBLE_TERMINALS, state: !state};
};

export const setPreassembleTerminals = (preassembleTerminals) => {
  localStorage.setItem(
    'preassembleTerminals',
    JSON.stringify(preassembleTerminals)
  );
  return {
    type: SET_PREASSEMBLE_TERMINALS,
    preassembleTerminals: preassembleTerminals,
  };
};

export const setPreassembleCables = (preassembleCables) => {
  localStorage.setItem('preassembleCables', JSON.stringify(preassembleCables));
  return {
    type: SET_PREASSEMBLE_CABLES,
    preassembleCables: preassembleCables,
  };
};

export const setProductMediaList = (productMedia) => {
  console.log('setProductMediaList');
  return {type: SET_PREASSEMBLE_TERMINALS_MEDIA, productMedia: productMedia};
};

export const setValueWhenProduUpdate = (res) => {
  return {type: PREASSEMBLE_TERMINALS_UPDATE_STATUS, response: res};
};

export const initProduct = () => {
  const product = JSON.parse(localStorage.getItem('product'))
    ? JSON.parse(localStorage.getItem('product'))
    : null;
  return {type: SAVE_PREASSEMBLE_TERMINALS_DATA, product: product};
};
