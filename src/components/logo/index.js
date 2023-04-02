import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Svg from '../svg';

const propTypes = {
    imgSrc: PropTypes.string,
    title: PropTypes.string
};
const defaultProps = {};
const Logo = (props) => {
    const { imgSrc, title } = props;
    return (
        imgSrc.indexOf('<svg') >= 0
            ? (
                <a href="/" title={title}>
                    <Svg
                        className="site-logo"
                        width={50}
                        height={50}
                        src={imgSrc}
                    />
                </a>
            )
            : (
                <img
                    className="logo"
                    src={imgSrc}
                    alt={title} />
            )
    );
};
Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;
export default Logo;