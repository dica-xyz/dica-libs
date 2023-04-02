import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const propTypes = {
    onChange: PropTypes.func,
};

const defaultProps = {};

const AddVideoModal = (props) => {
    const { onChange } = props;
    const [url, setUrl] = useState();
    const urlTextbox = useRef();

    useEffect(() => {
        if (urlTextbox.current) {
            urlTextbox.current.focus();
        }
    }, []);

    return (
        <Input
            placeholder="Url of video. Support youtube and vimeo."
            value={url}
            onChange={(e) => { setUrl(e.target.value); onChange(e.target.value); }}
            ref={urlTextbox}
        />

    );
};

AddVideoModal.propTypes = propTypes;

AddVideoModal.defaultProps = defaultProps;
export default AddVideoModal;