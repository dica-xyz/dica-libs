import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getThemesData } from '../../utils/theme';
import {
    SettingOutlined, StarTwoTone
} from '@ant-design/icons';

import {
    Dropdown
} from 'antd';

const propTypes = {
    site: PropTypes.object,
    changeTheme: PropTypes.func
};
const defaultProps = {};
const ThemePicker = (props) => {
    const { site, changeTheme } = props;
    const items = getThemesData(site.schema.themes, {
        onClick: (theme) => changeTheme(theme.themeName),
        setIcon: (theme) => (
            <StarTwoTone
                twoToneColor={theme.theme.token['colorPrimary']} />
        )
    });

    return (
        <Dropdown menu={{ items }} placement="bottom">
            <a><SettingOutlined /></a>
        </Dropdown>
    );
};
ThemePicker.propTypes = propTypes;
ThemePicker.defaultProps = defaultProps;
export default ThemePicker;