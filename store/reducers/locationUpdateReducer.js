import {SUB_MENU_ITEM,LINK} from '../actions/locationUpdateAction';

const initialState = {
    rootMenuItem:"Product Management  Product",
    link:null
}
const locationUpdateReducer =(state =initialState,action) =>{
    switch(action.type)
    {
        case SUB_MENU_ITEM:
            return {...state,rootMenuItem:action.rootMenuItem}
        case LINK :
            return {...state,link:action.menuItemLink}
        default:
            return {...state};
    }
}
export default locationUpdateReducer;