import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import { shortId } from '../../utils';

const propTypes = {
    images: PropTypes.array,
    onChoose: PropTypes.func,
};

const defaultProps = {
    onChoose: () => { },
};

const ImageList = (props) => {
    const { images, onChoose } = props;
    const childElements = images.map((image) => (
        <li className="online-image" key={shortId()}>
            <img
                src={image.urls.thumb} style={{ cursor: 'pointer', margin: '5px' }}
                onClick={() => onChoose(image)} alt="" role="presentation" />
        </li>
    ));
    return images && images.length > 0 ? (
        <Masonry
            className="online-gallery"
            elementType="ul" // default 'div'
            options={{ transitionDuration: 0 }} // default {}
        >
            {childElements}
        </Masonry>
    ) : null;
};

ImageList.propTypes = propTypes;

ImageList.defaultProps = defaultProps;

export default ImageList;
