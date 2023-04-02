import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import NavLink from '../navLink';
import './styles.less';

const propTypes = {
    menus: PropTypes.array
};

const defaultProps = {};

const Menus = (props) => {
    const { menus, mode } = props;
    const [selectedKey, setSelectedKey] = useState();

    const getMenus = (_menus) => _menus && _menus.map((menu) => {
        if (menu.children) {
            return {
                key: menu.id,
                label: (
                    <NavLink
                        to={menu.path}>
                        {menu.name.toUpperCase()}
                    </NavLink>
                ),
                children: getMenus(menu.children)
            };
        }
        return {
            key: menu.name,
            label: (
                <NavLink
                    to={menu.path}>
                    {menu.name.toUpperCase()}
                </NavLink>
            )
        };
    });

    return (
        <Menu
            mode={mode}
            className="dica-navigation-menu"
            selectedKeys={selectedKey}
            triggerSubMenuAction="hover"
            onSelect={({ key }) => setSelectedKey([key])}
            items={getMenus(menus)}
        />
    );
};

Menus.propTypes = propTypes;
Menus.defaultProps = defaultProps;

const MenuStyle = (props) => <Menus {...props} />;


MenuStyle.propTypes = propTypes;

MenuStyle.defaultProps = defaultProps;

export default MenuStyle;
