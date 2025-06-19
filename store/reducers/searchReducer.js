import { SET_KEYWORD } from '../actions/searchAction';
const initialState = {
    keyword: null
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_KEYWORD:
            { return { ...state, keyword: action.keyword }; }
        default:
            { return { ...state }; }
    }
}
export default searchReducer;