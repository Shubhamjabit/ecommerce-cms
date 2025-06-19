import React, {useState, useEffect, useRef, useMemo} from 'react';
import JoditEditor from 'jodit-react';
function Editor({setContent, content}) {
  const config = {
    readonly: false,
    width: '100%',
    height: 500,
  };
  const editor = useRef(null);
  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
    </div>
  );
}

export default Editor;
