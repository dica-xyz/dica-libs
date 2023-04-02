import React from 'react';
import PropTypes from 'prop-types';
import Link from '../link';
import Image from '../image';

import './styles.less';

const propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    imageSrc: PropTypes.string,
    style: PropTypes.object,
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
    imageContainerWidth: "100%",
    imageContainerHeight: "200px",
    imageWidth: 600,
    imageHeight: "100%",
};

const FeatureImage = (props) => {
    const {
        url, imageSrc, style, imageWidth, title,
        imageHeight, imageContainerHeight, imageContainerWidth,
    } = props;

    const CoverImage = (<Image
        content={title}
        className="feature-image"
        {...{ imageSrc, style, imageContainerWidth, imageContainerHeight, imageWidth, imageHeight }}
    />);

    return url
        ? (
            <Link to={url} className="post-cover">
                {CoverImage}
            </Link>
        )
        : CoverImage;
};

FeatureImage.propTypes = propTypes;

FeatureImage.defaultProps = defaultProps;

export default FeatureImage;
