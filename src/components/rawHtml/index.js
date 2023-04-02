import xss from 'xss';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    html: PropTypes.string,
};
const whiteList = ['i', 'svg', 'g', 'path'];

const defaultProps = {};

const onIgnoreTag = (tag, html) => {
    if (whiteList.indexOf(tag) > -1) {
        return html;
    }
    return null;
};

const RawHtml = ({ html, ...rest }) => (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: xss(html, { onIgnoreTag }) }} {...rest} />
);

RawHtml.propTypes = propTypes;

RawHtml.defaultProps = defaultProps;

export default RawHtml;
