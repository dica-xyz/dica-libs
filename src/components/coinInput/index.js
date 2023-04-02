import { InputNumber } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.oneOfType(
        [
            PropTypes.string,
            PropTypes.number,
        ],
    ),
    toolTip: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
};

const defaultProps = {
    value: 0
};

const CoinInput = (props) => {
    const {
        placeholder, onChange
    } = props;

    return (
        <InputNumber
            className="coin-input"
            {...props}
            addonAfter="D"
            placeholder={placeholder || "Input a number"}
            maxLength={16}
            onChange={onChange}
        />
    );
};

CoinInput.propTypes = propTypes;
CoinInput.defaultProps = defaultProps;
export default CoinInput;