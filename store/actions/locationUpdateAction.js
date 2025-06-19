export const SUB_MENU_ITEM = "SUBMENUITEM"
export const LINK = "LINK"


export const setLocation = (rootMenuItem) =>{
    return{
        type : SUB_MENU_ITEM,
        rootMenuItem: rootMenuItem
    }
}
export const setLocationLink = (link) =>{
    return{
        type : LINK,
        menuItemLink : link
    }
}