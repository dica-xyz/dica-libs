import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RrNavLink, useLocation } from 'react-router-dom';
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
const NavLink = (props) => {
    const {
        icon, to, children, addPrefix, ...rest
    } = props;

    const location = useLocation();
    const path = addPrefix ? url.addPathPrefix(to, location.pathname) : to;
    return (
        <RrNavLink {...rest} to={path}>
            {icon || null}
            {children}
        </RrNavLink>
    );
};
NavLink.propTypes = propTypes;
NavLink.defaultProps = defaultProps;
export default NavLink;