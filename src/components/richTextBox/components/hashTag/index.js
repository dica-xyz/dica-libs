/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    className: PropTypes.string,
    decoratedText: PropTypes.string
};
const defaultProps = {};
const HashTagComponent = (props) => {
    const {
        // eslint-disable-next-line no-unused-vars
        theme = {},
        className,
        decoratedText,
        dir,
        entityKey,
        getEditorState,
        offsetKey,
        setEditorState,
        contentState,
        blockKey,
        start,
        end,
        ...otherProps
    } = props;

    const linkProps = {
        ...otherProps,
        href: `/post/search/${decoratedText?.substr(1)}`,
        target: '_blank',
        className
    };

    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...linkProps} />;
};
HashTagComponent.propTypes = propTypes;
HashTagComponent.defaultProps = defaultProps;
export default HashTagComponent;