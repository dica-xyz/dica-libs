import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    style: PropTypes.object,
    icon: PropTypes.object
};

const defaultProps = {
    icon: <QuestionCircleOutlined />,
    style: { fontSize: '1.4em', marginLeft: '10px', maxWidth: '200px' },
};

const HelpIcon = (props) => {
    const { content, style, icon } = props;
    return (
        <Tooltip title={content}>
            <a style={style}>{icon}</a>
        </Tooltip>
    );
};

HelpIcon.propTypes = propTypes;

HelpIcon.defaultProps = defaultProps;

export default HelpIcon;
