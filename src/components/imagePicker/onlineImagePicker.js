import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Pagination } from 'antd';
import withApis from '../withApis';
import ImageList from './imageList';
import { MessageBox } from '../messageBox';

const propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    source: PropTypes.string,
    apis: PropTypes.object
};

const defaultProps = {
    source: 'unsplash',
    placeholder: 'search images from unsplash'
};

const OnlineImagePicker = (props) => {
    const {
        onChange, placeholder, apis, source
    } = props;
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState();
    const { onlineImageApi, execApi } = apis;

    const searchTextbox = useRef();
    useEffect(() => {
        searchTextbox.current.focus();
    }, []);

    useEffect(() => {
        const onSearch = async () => {
            // don't perform search for url
            if (!keyword) return;
            if (keyword.startsWith('http')) {
                onChange(keyword);
                return;
            }
            execApi(
                (options) => onlineImageApi(options).search(keyword, current, source),
                (result) => {
                    setImages(result.data.images);
                    setTotal(result.data.total);
                },
                (result) => {
                    MessageBox({
                        title: result.err[0].message,
                        body: 'Please go to admin site and add an access key.',
                        type: 'error'
                    })
                }
            );
        };
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, keyword]);
    const preventBubblingUp = (event) => {
        event.stopPropagation();
        event.target.focus();
    };
    return (
        <div>
            <Input.Search
                placeholder={placeholder}
                onClick={preventBubblingUp}
                onSearch={(value) => { setKeyword(value); setCurrent(0); }}
                style={{ width: '100%' }}
                name="keyword"
                ref={searchTextbox} />
            <br />
            {images.length === 0 ? null
                : (
                    <>
                        <ImageList images={images} onChoose={(image) => onChange(image)} />
                        <Pagination
                            defaultCurrent={1}
                            showSizeChanger={false}
                            pageSize={15}
                            total={total}
                            current={current}
                            onChange={(page) => setCurrent(page)} />
                    </>
                )}
        </div>
    );
};

OnlineImagePicker.propTypes = propTypes;

OnlineImagePicker.defaultProps = defaultProps;

export default withApis(OnlineImagePicker);
