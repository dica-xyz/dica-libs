import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu } from 'antd';
import { EditorState } from 'draft-js';

const propTypes = {
    theme: PropTypes.object,
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
};

export default (config) => (props) => {
    const { theme, getEditorState, setEditorState } = props;

    const onSelect = ({ key: language }) => {
        let key; let block;
        const editorState = getEditorState();
        let currentContent = editorState.getCurrentContent();

        const currentSelection = editorState.getSelection();
        key = currentSelection.getStartKey();
        block = currentContent.getBlockForKey(key);
        do {
            const data = block.getData().merge({ language });
            block = block.merge({ data });
            currentContent = currentContent.merge({
                blockMap: currentContent.blockMap.set(key, block)
            });

            key = block.key;
            block = currentContent.getBlockAfter(key);
        }
        while (block && block.getType() === "code-block")
        setEditorState(EditorState.push(editorState, currentContent, "change-block-data"));
    };

    // const codeIcon = (<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>)

    return (
        <div
            className={theme.buttonWrapper}
            // onMouseDown={preventBubblingUp}
            role="button" tabIndex="-1"
        >
            <Dropdown items={{
                items: [{ key: 'javascript', label: 'JS' },
                { key: 'c#', label: 'C#' }
                ],
                onClick: onSelect
            }}>
                <button className={theme.button} type='button'>
                    code
                </button>
            </Dropdown>
        </div>
    );
};
