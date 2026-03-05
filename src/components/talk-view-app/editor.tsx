import React, { useState, useEffect } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const EditorIndex = () => {
    const [editorState, setEditorState] = useState(null);
    //   state = {
    //       editorState: null
    //   }

    useEffect(() => {
        setEditorState(BraftEditor.createEditorState(null));
    }, []);

    const handleEditorChange = (value) => {
        console.log(value.toHTML());
        setEditorState(value);
    };

    return (
        <div className="my-component">
            <BraftEditor
                value={editorState}
                onChange={handleEditorChange}
                controls={['media']}
                contentClassName={'my-component-editor'}
                //   onSave={this.submitContent}
            />
        </div>
    );
};
export default EditorIndex;
