import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { url } from '../../utils';

const propTypes = {
    to: PropTypes.string,
    addPrefix: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    icon: PropTypes.object,
    style: PropTypes.object,
};

const defaultProps = {
    addPrefix: true,
    to: '#'
};

const HyperLink = (props) => {
    const {
        icon, to, children, addPrefix, ...rest
    } = props;
    const location = useLocation();
    const path = addPrefix ? url.addPathPrefix(to, location.pathname) : to;
    return (
        <HashLink {...rest} to={path}>
            {icon || null}
            {children}
        </HashLink>
    );
};

HyperLink.propTypes = propTypes;

HyperLink.defaultProps = defaultProps;

export default HyperLink;
