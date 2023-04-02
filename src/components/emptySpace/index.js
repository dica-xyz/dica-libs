import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    className: PropTypes.string,
};
const defaultProps = {
    className: ''
};
const EmptySpace = (props) => {
    const { className } = props;
    return (
        <div className={`empty-space ${className}`} />
    );
};
EmptySpace.propTypes = propTypes;
EmptySpace.defaultProps = defaultProps;

export default EmptySpace;
