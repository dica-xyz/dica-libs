import React from 'react';
import PropTypes from 'prop-types';
import { Statistic } from 'antd';
import constants from '../../utils/blockchain/constants';

const propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    showUnit: PropTypes.bool
};

const defaultProps = {
    value: 0,
    precision: 8,
    showUnit: true,
};

const CoinNumber = (props) => {
    const {
        value, showUnit, ...rest
    } = props;
    return (
        <Statistic
            {...rest}
            value={(Number(value) / constants.fixedPoint).toFixed(props.precision)}
            suffix={showUnit ? 'D' : null} />
    );
};
CoinNumber.propTypes = propTypes;
CoinNumber.defaultProps = defaultProps;

export default CoinNumber;
