import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { urlEncode } from '../../utils/url';
import Link from '../link';

const propTypes = {
    tags: PropTypes.array,
    maxLength: PropTypes.number
};

const defaultProps = {
    tags: [],
    maxLength: 10
};

const TagsList = ({ tags, maxLength }) => tags?.map((tag) => {
    const isLongTag = tag.length > maxLength;

    const tagElem = (
        <Tag key={tag}>
            <Link key={tag} to={`/post/search/${urlEncode(tag)}`}>{isLongTag ? `${tag.slice(0, maxLength)}...` : tag}</Link>
        </Tag>
    );
    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
});

TagsList.propTypes = propTypes;

TagsList.defaultProps = defaultProps;

export default TagsList;
