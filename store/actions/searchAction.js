export const SET_KEYWORD = "SET_KEYWORD";

export const setKeyword = (keyword) => {
    console.log('Search Keyword ', keyword);
    return { type: SET_KEYWORD, keyword: keyword };
}