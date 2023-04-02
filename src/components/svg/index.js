import React from 'react';
import PropTypes from 'prop-types';
import RawHtml from '../rawHtml';

const propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
const defaultProps = {};
const SVG = (props) => {
    const {
        src, width, height, ...rest
    } = props;

    const addAttributes = () => {
        let _src = src.replace(/fill="\w+"/gm, '');
        _src = width ? _src.replace(/width="\d+"/gm, '') : _src;
        _src = height ? _src.replace(/height="\d+"/gm, '') : _src;
        return _src.replace('<svg', `<svg fill="currentColor" width="${width}" height="${height}"`);
    };

    return (
        <RawHtml
            {...rest}
            html={`
        <i class="anticon">${addAttributes()}</i>
        `} />
    );
};
SVG.propTypes = propTypes;
SVG.defaultProps = defaultProps;
export default SVG;
