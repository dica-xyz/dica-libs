import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import MenuComponent from './menuStyle';

const propTypes = {
    menuGroup: PropTypes.string,
    site: PropTypes.object,
};

const defaultProps = {
};

const Navigation = (props) => {
    const {
        site, menuGroup: menuGroupId,
    } = props;
    const location = useLocation();
    let menus;
    // useEffect(() => {
    const getMenus = () => {
        if (site.schema.menus && site.schema.menus.length > 0) {
            const menuGroup = site.schema.menus
                .find((_menuGroup) => _menuGroup.id === menuGroupId);
            const items = [...menuGroup.items];
            menus = [...items.sort((a, b) => a.order - b.order)];
        }
    };
    getMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    if (menus.length === 0) return null;

    return (
        <MenuComponent
            {...props}
            menus={menus}
            pathName={location.pathname} />
    );
};

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

export default Navigation;