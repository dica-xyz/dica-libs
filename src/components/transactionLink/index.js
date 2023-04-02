/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import Link from '../link';

const propTypes = {
    id: PropTypes.string,
    sidechainId: PropTypes.string
};

const defaultProps = {};

const TransactionLink = (props) => (
    <Link to={`/explorer/transaction${props.sidechainId ? `/${props.sidechainId}` : ''}/${props.id}`}>{props.id}</Link>
);

TransactionLink.propTypes = propTypes;

TransactionLink.defaultProps = defaultProps;

export default TransactionLink;
