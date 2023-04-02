import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import { getTransactionNameByValue } from '../../utils/blockchain/transactionTypes';

const propTypes = {
    type: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    cutoffLength: PropTypes.number
};

const defaultProps = {
    cutoffLength: 40
};

const TransactionType = (props) => {
    const { type, cutoffLength } = props;
    const [transactionName, setTransactionName] = useState();

    useEffect(() => {
        if (Array.isArray(type)) {
            const names = type.reduce((accumulator, currentValue) => {
                const name = getTransactionNameByValue(currentValue);
                accumulator.push(name);
                return accumulator;
            }, []);
            setTransactionName(names && names.filter(Boolean).join(','));
        } else {
            const name = getTransactionNameByValue(type);
            setTransactionName(name);
        }
    }, [type]);

    return !transactionName ? null : transactionName.length > cutoffLength ? (
        <Popover content={transactionName} trigger="hover">
            {`${transactionName.slice(0, cutoffLength)}...`}
        </Popover>
    ) : transactionName;
};
TransactionType.propTypes = propTypes;

TransactionType.defaultProps = defaultProps;

export default TransactionType;
