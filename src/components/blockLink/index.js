import React from 'react';
import PropTypes from 'prop-types';
import Link from '../link';

const propTypes = {
    id: PropTypes.string,
    sidechainId: PropTypes.string,
    height: PropTypes.number
};

const defaultProps = {};

const BlockLink = (props) => {
    const { id, height, sidechainId } = props;
    return (
        <Link to={`/explorer/block${sidechainId ? `/${sidechainId}` : ''}/${id}`}>{height || id}</Link>
    );
};

BlockLink.propTypes = propTypes;

BlockLink.defaultProps = defaultProps;

export default BlockLink;
