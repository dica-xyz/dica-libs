import React from 'react';
// import PropTypes from 'prop-types';
import { Divider as AntdDivider } from 'antd';

const propTypes = {};
const defaultProps = {};
const Divider = (props) => {
    const { children, className, dashed, orientation, orientationMargin, plain, style, type } = props;
    return (
        <AntdDivider
            {...{ children, className, dashed, orientation, orientationMargin, plain, style, type }}
        />
    );
};
Divider.propTypes = propTypes;
Divider.defaultProps = defaultProps;
export default Divider;