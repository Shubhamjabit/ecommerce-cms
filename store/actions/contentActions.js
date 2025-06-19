export const SET_CONTENT = 'SET_CONTENT';
export const SAVE_CONTENT_DATA = 'SAVE_CONTENT_DATA';

export const setContent = (content) => {
  localStorage.setItem('content', JSON.stringify(content));
  return {type: SET_CONTENT, content: content};
};
export const initContent = () => {
  const content = JSON.parse(localStorage.getItem('content'))
    ? JSON.parse(localStorage.getItem('content'))
    : null;
  return {type: SAVE_CONTENT_DATA, content: content};
};
