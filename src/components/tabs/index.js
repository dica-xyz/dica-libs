/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs as AntdTabs } from 'antd';
import array from '../../utils/array';

const propTypes = {
    onChange: PropTypes.func,
    activeKey: PropTypes.string,
    items: PropTypes.array
};
const defaultProps = {};
const Tabs = (props) => {
    const {
        items, activeKey: pActiveKey,
        onChange: pOnChange, ...rest
    } = props;
    const [activeKey, setActiveKey] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    // return keys without #
    const getUrlKeys = () => (location?.hash?.startsWith('#') ? location?.hash?.replace('#', '').split('-') : null);

    const getChildKeys = () => items && items?.map((c) => c?.key);

    const findKey = () => {
        const keys = getUrlKeys();
        if (items
            && location?.hash?.startsWith('#')) {
            return keys.find((key) => items.find((c) => c?.key === `#${key}`));
        }
        return null;
    };

    useEffect(() => {
        setActiveKey(pActiveKey);
    }, [pActiveKey]);

    useEffect(() => {
        const key = findKey();
        if (key) {
            setActiveKey(`#${key}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const onChange = (_activeKey) => {
        if (_activeKey.startsWith('#')) {
            let keys = getUrlKeys() ?? [];
            const childKeys = getChildKeys() ?? [];
            // remove keys of same level
            keys = keys.filter((k) => childKeys.indexOf(`#${k}`) === -1);
            keys.push(_activeKey.replace('#', ''));
            keys = array.RemoveDuplicates(keys);
            navigate(`#${keys.join('-')}`);
        }
        setActiveKey(_activeKey);
        pOnChange && pOnChange(_activeKey);
    };
    const _items = items?.filter((child) => child?.visible !== false) || items;
    return (
        <AntdTabs
            {...rest}
            activeKey={activeKey}
            onChange={onChange}
            items={_items} />
    );
};
Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;