/* eslint-disable no-use-before-define */
import React, { useRef } from 'react';
import { AtomicBlockUtils, RichUtils } from 'draft-js';
import PropTypes from 'prop-types';
import { VideoCameraOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddVideoInput from './AddVideoInput';

export const VIDEOTYPE = 'draft-js-video-plugin-video';
export const ATOMIC = 'atomic';

const propTypes = {
    theme: PropTypes.object,
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
};

const defaultProps = {};

const AddVideoButton = (props) => {
    const { theme, setEditorState, getEditorState } = props;
    const url = useRef();
    let modal;

    /**
    * Insert video
    *
    * @param {*} image
    */
    const inserVideo = (_url) => {
        if (!_url || _url.trim() === '') return;
        const editorState = getEditorState();
        setEditorState(addVideo(editorState, { src: _url }));
    };

    const handleAdd = (_url) => {
        inserVideo(_url);
        toggleModal(false);
    };

    const toggleModal = (_expanded) => {
        if (_expanded) {
            modal = Modal.info({
                title: 'Add Video',
                closable: true,
                footer: null,
                width: '600px',
                maskClosable: true,
                onOk: () => handleAdd(url.current),
                content: <AddVideoInput onChange={(_url) => { url.current = _url; }} />
            });
        } else {
            modal.destroy();
        }
    };

    const addVideo = (editorState, { src }) => {
        if (RichUtils.getCurrentBlockType(editorState) === ATOMIC) {
            return editorState;
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            VIDEOTYPE,
            'IMMUTABLE',
            { src },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    };

    return (
        <div
            className={theme.buttonWrapper}
        >
            <button
                type="button"
                title="Insert a video. Support youtube and vimeo"
                onClick={() => toggleModal(true)}
                className={theme.button}>
                <VideoCameraOutlined style={{ fontSize: "20px" }} />
            </button>
        </div>
    );
};
AddVideoButton.propTypes = propTypes;

AddVideoButton.defaultProps = defaultProps;
export default AddVideoButton;