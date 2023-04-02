import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';

const propTypes = {
    icon: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func
};
const defaultProps = {};
const IconText = (props) => {
    const {
        icon, text, onClick, ...rest
    } = props;
    return (
        <Space>
            {icon}
            <span role="presentation" onClick={onClick} {...rest}>
                {text}
            </span>
        </Space>
    );
};
IconText.propTypes = propTypes;
IconText.defaultProps = defaultProps;
export default IconText;