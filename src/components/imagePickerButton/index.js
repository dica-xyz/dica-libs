import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Avatar } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import withApis from '../withApis';
import ImagePicker from '../imagePicker';
import FeatureImage from '../featureImage';
import Svg from '../svg';
import './styles.less';

const propTypes = {
    onChange: PropTypes.func,
    text: PropTypes.string,
    showAvatar: PropTypes.bool,
    showImage: PropTypes.bool,
    apis: PropTypes.object,
    icon: PropTypes.object,
    maxImageSize: PropTypes.number,
    disableOnlineImage: PropTypes.bool,
    disableLocalImage: PropTypes.bool,
    imageSrc: PropTypes.string,
    path: PropTypes.string,
    size: PropTypes.oneOf(['full', 'raw', 'regular', 'small', 'thumb']),
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
    disableOnlineImage: false,
    disableLocalImage: false,
    text: '',
    path: '',
    icon: <BookOutlined />,
    size: 'regular',
    showAvatar: false,
    showImage: true
};

const ImagePickerButton = (props) => {
    const {
        text, icon, size, imageSrc, showAvatar,
        maxImageSize, path, apis, showImage,
        disableOnlineImage, disableLocalImage, onChange,
        imageContainerHeight, imageContainerWidth, imageHeight, imageWidth
    } = props;

    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState();

    useEffect(() => {
        if (!imageSrc) {
            setImage(null);
        } else if (showAvatar || showImage) {
            setImage(imageSrc);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAvatar, imageSrc]);

    const toggleShowModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (_image) => {
        let _value = null;
        if (_image) {
            if (typeof _image === 'object') {
                _value = _image.urls[size];
            } else {
                _value = _image;
            }
            toggleShowModal();
        }
        setImage(_value);
        onChange(_value);
    };

    return (
        <div className="image-picker">
            <Button icon={icon} onClick={toggleShowModal}>
                {text}
            </Button>
            {
                image && showAvatar
                    ? image.indexOf('<svg') >= 0
                        ? <Svg src={image} style={{ display: "inline-block" }} width={50} height={50} />
                        : <Avatar src={image.startsWith('data:image') ? image : `${path}${image}`} />
                    : null
            }
            {
                image && showImage
                    ? (
                        <div className="featureImage">
                            <FeatureImage
                                imageSrc={image}
                                imageContainerHeight={imageContainerHeight}
                                imageContainerWidth={imageContainerWidth}
                                imageHeight={imageHeight}
                                imageWidth={imageWidth}
                                alt="" />
                        </div>
                    )
                    : null
            }
            <Modal
                title="Choose Image"
                width="50%"
                open={showModal}
                onCancel={toggleShowModal}
                footer={null}
            >
                <ImagePicker
                    disableOnlineImage={disableOnlineImage}
                    disableLocalImage={disableLocalImage}
                    maxImageSize={maxImageSize}
                    size={size}
                    onChange={handleChange}
                    image={image} />
            </Modal>
        </div>
    );
};

ImagePickerButton.propTypes = propTypes;

ImagePickerButton.defaultProps = defaultProps;

export default withApis(ImagePickerButton);
