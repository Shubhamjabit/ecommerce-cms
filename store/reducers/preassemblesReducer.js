import {
  MODAL_EDIT_PREASSEMBLE_TERMINALS,
  SET_PREASSEMBLE_TERMINALS,
  SET_PREASSEMBLE_CABLES,
  SAVE_PREASSEMBLE_TERMINALS_DATA,
  PREASSEMBLE_TERMINALS_UPDATE_STATUS,
  SET_PREASSEMBLE_TERMINALS_MEDIA,
} from '../actions/preassemblesActions';

const initialState = {
  editPreassembleTerminalsModal: false,
  preassembleTerminals: null,
  preassembleCables: null,
  preassembleTerminalsresponse: null,
  preassembleTerminalsMedia: null,
};
const preassemblesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODAL_EDIT_PREASSEMBLE_TERMINALS:
      return {...state, editProductModal: action.state};
    case SET_PREASSEMBLE_TERMINALS:
      return {...state, preassembleTerminals: action.preassembleTerminals};
    case SET_PREASSEMBLE_CABLES:
      return {...state, preassembleCables: action.preassembleCables};
    case SAVE_PREASSEMBLE_TERMINALS_DATA:
      return {...state, product: action.product};
    case PREASSEMBLE_TERMINALS_UPDATE_STATUS:
      return {...state, response: action.response};
    case SET_PREASSEMBLE_TERMINALS_MEDIA:
      return {...state, productMedia: action.productMedia};
    default:
      return {...state};
  }
};

export default preassemblesReducer;
