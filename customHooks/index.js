import {useEffect} from 'react';
const importScript = (resourceUrl) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    // script.onload = () => {
    //   console.log('Script loaded successfuly');
    //   const box = document.getElementById('box');
    //   box.textContent = 'The script has loaded.';
    // };

    // script.onerror = () => {
    //   console.log('Error occurred while loading script');
    // };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [resourceUrl]);
};
export default importScript;
