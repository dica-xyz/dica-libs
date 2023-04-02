/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import utils from './utils';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';

const propTypes = {
    block: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.object,
    style: PropTypes.object,
};

const Video = React.forwardRef((props, ref) => {
    const {
        blockProps, className, style, theme, ...otherProps
    } = props;

    const {
        customStyleMap, // eslint-disable-line no-unused-vars
        customStyleFn, // eslint-disable-line no-unused-vars
        decorator, // eslint-disable-line no-unused-vars
        forceSelection, // eslint-disable-line no-unused-vars
        offsetKey, // eslint-disable-line no-unused-vars
        selection, // eslint-disable-line no-unused-vars
        tree, // eslint-disable-line no-unused-vars
        contentState, // eslint-disable-line no-unused-vars
        blockStyleFn, // eslint-disable-line no-unused-vars
        preventScroll, // eslint-disable-line no-unused-vars
        ...elementProps
    } = otherProps;

    const getSrc = ({ src }) => {
        const {
            isYoutube, getYoutubeSrc, isVimeo, getVimeoSrc,
        } = utils;
        if (isYoutube(src)) {
            const { srcID } = getYoutubeSrc(src);
            return `${YOUTUBE_PREFIX}${srcID}`;
        }
        if (isVimeo(src)) {
            const { srcID } = getVimeoSrc(src);
            return `${VIMEO_PREFIX}${srcID}`;
        }
        return undefined;
    };
    const src = getSrc(blockProps);

    const combinedClassName = clsx(theme.iframeContainer, className);
    if (src) {
        return (
            <div
                ref={ref}
                className={combinedClassName}
                {...elementProps}
            >
                <iframe
                    className={theme.iframe}
                    src={src}
                    height="600"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        );
    }

    return <div className={theme.invalidVideoSrc}>invalid video source</div>;
});

Video.propTypes = propTypes;
export default Video;
