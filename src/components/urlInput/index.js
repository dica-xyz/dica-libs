import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';

const { Option } = Select;
const propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};
const defaultProps = {
    onChange: () => { }
};
const UrlInput = (props) => {
    const { value: pValue, onChange, ...rests } = props;
    const [value, setValue] = useState();
    const [protocol, setProtocol] = useState('http://');

    const parseFullUrl = (fullUrl) => {
        let _protocol;
        if (fullUrl?.indexOf('https://') >= 0) {
            _protocol = 'https://';
        } else {
            _protocol = 'http://';
        }
        const _url = fullUrl?.replace(/http(s)?:\/\//g, '') ?? '';
        setProtocol(_protocol);
        setValue(_url.length ? _url : null);
        if (!_url.length) {
            return null;
        }
        return `${_protocol}${_url}`;
    };

    const _onChange = (_protocol) => {
        if (value?.length) {
            let fullUrl = `${_protocol}${value ?? ''}`;
            fullUrl = parseFullUrl(fullUrl);
            onChange(fullUrl);
        } else {
            setProtocol(_protocol);
            onChange();
        }
    };

    useEffect(() => {
        if (!pValue?.length) { onChange(); }

        const fullUrl = parseFullUrl(pValue);
        onChange(fullUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pValue]);

    const SelectProtocol = (
        <Select
            value={protocol}
            onChange={_onChange}>
            <Option value="http://">http://</Option>
            <Option value="https://">https://</Option>
        </Select>
    );

    return (
        <Input
            addonBefore={SelectProtocol}
            onChange={(e) => {
                if (e.target.value?.length) {
                    let fullUrl = protocol + e.target.value;
                    fullUrl = parseFullUrl(fullUrl);
                    onChange(fullUrl);
                } else {
                    setValue();
                    onChange();
                }
            }}
            value={value}
            {...rests} />
    );
};

UrlInput.propTypes = propTypes;
UrlInput.defaultProps = defaultProps;
export default UrlInput;