import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import NoImage from './noImage';
import './styles.less'

const propTypes = {
    showLoading: PropTypes.bool,
    imageSrc: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    loadingStyle: PropTypes.object,
    loadingText: PropTypes.string,
    onClick: PropTypes.func,
    content: PropTypes.string,
    contentStyle: PropTypes.object,
    noImage: PropTypes.bool,
    imageContainerHeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageContainerWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageHeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
};

const defaultProps = {
    style: {},
    className: '',
    loadingText: 'Loading',
    content: null,
    noImage: false,
    contentStyle: {
    },
};

const Image = (props) => {
    const {
        imageSrc, showLoading, style, className, onClick, noImage,
        loadingText, content, contentStyle, loadingStyle
        , imageContainerWidth, imageContainerHeight, imageWidth, imageHeight
    } = props;
    const loadingContainerStyle = { textAlign: 'center', width: style.width, height: style.height };
    const image = useRef(imageSrc);

    if (imageSrc?.startsWith('https')) {
        const host = imageSrc.substring(0, imageSrc.indexOf('?') + 1);
        const query = imageSrc.substring(imageSrc.indexOf('?') + 1);
        const parsed = new URLSearchParams(query);
        parsed.set('w', imageWidth);
        parsed.set('h', imageHeight);
        parsed.set('max-w', 1920);
        parsed.set('max-h', 1080);
        parsed.set('fit', 'crop');
        parsed.set('crop', 'edges');
        image.current = host + parsed.toString();
    }
    return imageSrc ? (
        <div
            style={{
                width: imageContainerWidth,
                height: imageContainerHeight,
                ...style,
                backgroundImage: `url(${image.current})`
            }}
            className={`dica-image ${className}`}
            onClick={onClick} role="presentation">
            {content ? <div className="image-content" style={contentStyle}>{content}</div> : null}
        </div>
    )
        : showLoading
            ? (
                <div style={loadingContainerStyle}>
                    <LoadingOutlined className="dica-image-loading" style={loadingStyle} />
                    <p style={{ textAlign: 'center' }}>{loadingText}</p>
                </div>
            ) : noImage ? <NoImage /> : null;
};

Image.propTypes = propTypes;

Image.defaultProps = defaultProps;

export default Image;
