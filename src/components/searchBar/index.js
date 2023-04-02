/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { MessageBox } from '../messageBox';

const { Search } = Input;
const propTypes = {
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    size: PropTypes.string,
    value: PropTypes.string,
    allowClear: PropTypes.bool,
    minChar: PropTypes.number,
    maxChar: PropTypes.number
};

const defaultProps = {
    placeholder: 'Enter keywords',
    size: 'large',
    allowClear: true,
    minChar: 3,
    maxChar: 50,
    onSearch: () => { }
};

const SearchBar = (props) => {
    const {
        onSearch, minChar, maxChar,
        value: pValue, ...rest
    } = props;
    const [value, setValue] = useState(pValue);

    const handleSearch = (_value) => {
        if (_value.trim().length < minChar) {
            MessageBox({ title: `To start a search, enter ${minChar} or more characters please`, type: 'warning' });
            return;
        }
        if (_value.trim().length > maxChar) {
            MessageBox({ title: `Too many characters, enter ${maxChar} or less characters please`, type: 'error' });
        }
        onSearch(_value);
    };

    return (
        <Search
            className="search-bar"
            {...rest}
            enterButton
            name="search"
            onChange={(e) => setValue(e.target.value)}
            onSearch={handleSearch}
            style={{ marginTop: '10px' }}
            value={value}
        />
    );
};

SearchBar.propTypes = propTypes;

SearchBar.defaultProps = defaultProps;

export default SearchBar;
