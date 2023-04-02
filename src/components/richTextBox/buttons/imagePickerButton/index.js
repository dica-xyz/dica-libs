import React from 'react';
import PropTypes from 'prop-types';
import { PictureOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import ImagePicker from '../../../imagePicker';
import './styles.less';

const propTypes = {
    theme: PropTypes.object,
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
};

const defaultProps = {};

const ImagePickerButton = (props) => {
    const { theme, getEditorState, setEditorState } = props;
    let modal;

    /**
     * Insert image with/without author info at the bottom of image
     *
     * @param {*} image
     */
    const insertImage = (image) => {
        const editorState = getEditorState();
        let entityData;
        if (typeof image === 'object') {
            entityData = {
                // insert image with author info
                src: image.urls.regular, height: 'auto', width: 'auto', author: image.user,
            };
        } else {
            // insert image from either image url or image base64
            entityData = { src: image, height: 'auto', width: 'auto' };
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'IMAGE',
            'IMMUTABLE',
            entityData,
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity },
        );
        setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
    };

    const handleChange = (image) => {
        insertImage(image);
        // eslint-disable-next-line no-use-before-define
        toggleModal(false);
    };

    const toggleModal = (_expanded) => {
        if (_expanded) {
            modal = Modal.info({
                title: 'Pick a picture',
                closable: true,
                width: '50%',
                okText: 'Cancel',
                okType: 'default',
                maskClosable: true,
                content: <ImagePicker onChange={handleChange} />
            });
        } else {
            modal.destroy();
        }
    };

    const preventBubblingUp = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={theme.buttonWrapper}
            onClick={preventBubblingUp}
        >
            <button
                title="Insert a picture"
                type="button"
                onClick={() => toggleModal(true)}
                className={`rtb-image-picker-button ${theme.button}`}>
                <PictureOutlined style={{ fontSize: "20px" }} />
            </button>
        </div>
    );
};
ImagePickerButton.propTypes = propTypes;

ImagePickerButton.defaultProps = defaultProps;
export default ImagePickerButton;