import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import RawHtml from '../../../rawHtml';

const propTypes = {
    block: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.object,
    style: PropTypes.object,
};

const defaultProps = {};

const Image = React.forwardRef((props, ref) => {
    const {
        block, className, theme = {}, ...otherProps
    } = props;

    // leveraging destructuring to omit certain properties from props
    const {
        blockProps, // eslint-disable-line no-unused-vars
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
        style,
        ...elementProps
    } = otherProps;
    const combinedClassName = clsx(theme.image, className);
    const { src, author, caption } = contentState.getEntity(block.getEntityAt(0)).getData();
    return (
        <div
            ref={ref}
            className={combinedClassName}
            {...elementProps}
            style={{ ...style, width: 'auto', height: 'auto' }}
        >
            <img
                alt=""
                src={src}
                role="presentation"
            />
            {
                author
                    ? (
                        <figcaption className="image-author">
                            Photo by
                            {` ${author.name}`}
                            {` on `}
                            <a href={`${author.link}`}>
                                {`${author.username}`}
                            </a>
                        </figcaption>
                    )
                    : caption
                        ? (
                            <figcaption className="image-author">
                                <RawHtml html={caption} />
                            </figcaption>
                        )
                        : null
            }
        </div>
    );
});

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
