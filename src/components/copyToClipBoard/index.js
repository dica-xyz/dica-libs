import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';

const propTypes = {
    value: PropTypes.string,
    promptMessage: PropTypes.string
};
const defaultProps = {
    promptMessage: 'Copied to clipboard'
};
const CopyToClipBoard = (props) => {
    const { value, promptMessage, ...rests } = props;
    return (
        <CopyOutlined
            {...rests}
            onClick={() => {
                copy(value);
                message.info(promptMessage);
            }} />
    );
};
CopyToClipBoard.propTypes = propTypes;
CopyToClipBoard.defaultProps = defaultProps;
export default CopyToClipBoard;