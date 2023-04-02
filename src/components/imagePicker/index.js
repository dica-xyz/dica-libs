import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Upload, message, Card, Tabs
} from 'antd';
import OnlineImagePicker from './onlineImagePicker';

const propTypes = {
    onChange: PropTypes.func,
    image: PropTypes.string,
    name: PropTypes.string,
    disableLocalImage: PropTypes.bool,
    disableOnlineImage: PropTypes.bool,
    maxImageSize: PropTypes.number,
    size: PropTypes.oneOf(['full', 'raw', 'regular', 'small', 'thumb']),
};

const defaultProps = {
    image: '',
    disableLocalImage: false,
    disableOnlineImage: false,
    maxImageSize: 2,
    size: 'regular',
};

const ImagePicker = (props) => {
    // eslint-disable-next-line react/destructuring-assignment
    const [image, setImage] = useState(props.image);
    const {
        maxImageSize, disableLocalImage, name,
        onChange, disableOnlineImage, size
    } = props;

    const getBase64 = (_image, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        if (_image.type === "image/svg+xml") {
            reader.readAsText(_image);
        } else {
            reader.readAsDataURL(_image);
        }
    };

    const _onChange = (_image) => {
        setImage(_image);
        onChange(_image);
    };

    const handleChange = (_image) => {
        setImage(typeof _image === 'object' ? _image.urls[size] : _image);
        onChange(_image);
    };
    const readFile = (file) => {
        getBase64(file, (_image) => {
            _onChange(_image);
        });
    };

    const beforeUpload = (file) => {
        // console.log(file);
        const isIMG = file.type.startsWith('image/');
        if (!isIMG) {
            message.error('You can only upload image file!');
            return false;
        }
        const isLtMaxSize = file.size / 1024 / 1024 < maxImageSize;
        if (!isLtMaxSize) {
            message.error(`Image must smaller than ${maxImageSize}MB!`);
            return false;
        }
        readFile(file);
        return false;
    };

    const getItems = () => {
        const items = [];
        if (!disableOnlineImage) {
            items.push({
                label: 'Unsplash Image',
                key: 'unsplash',
                children: (
                    <>
                        <OnlineImagePicker
                            source="unsplash"
                            size={size}
                            placeholder="Keyword or URL of image"
                            onChange={handleChange}
                            value={image?.startsWith('http') ? image : null} />
                        <small>Search pictures from Unsplash web site.</small>
                    </>
                )
            });

            items.push({
                label: 'Pexels Image',
                key: 'pexels',
                children: (
                    <>
                        <OnlineImagePicker
                            source="pexels"
                            size={size}
                            placeholder="Keyword or URL of image"
                            onChange={handleChange}
                            value={image?.startsWith('http') ? image : null} />
                        <small>Search pictures from Pexels web site.</small>
                    </>
                )
            });
        }

        if (!disableLocalImage) {
            if (image?.startsWith('data:')) {
                items.push({
                    label: 'Local Image',
                    key: 'local',
                    children: (
                        <Card
                            style={{ width: 300 }}
                            cover={<img src={image} style={{ width: 300 }} alt="" />}
                            actions={[
                                <DeleteOutlined
                                    key={1}
                                    onClick={() => _onChange(null)} />
                            ]} />
                    )
                });
            } else {
                items.push({
                    label: 'Local Image',
                    key: 'local',
                    children: (
                        <Upload
                            name={name}
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => beforeUpload(file)}
                        >
                            <div>
                                <PlusOutlined />
                                <div className="dica-upload-text">Upload</div>
                            </div>
                        </Upload>
                    )
                });
            }
        }

        return items;
    };

    return (
        <Tabs
            defaultActiveKey="unsplash"
            items={getItems()}
        />
    );
};

ImagePicker.propTypes = propTypes;

ImagePicker.defaultProps = defaultProps;

export default ImagePicker;
