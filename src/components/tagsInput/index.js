/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';
import { Tag, Input, Tooltip } from 'antd';
import { array } from '../../utils';

const propTypes = {
    tags: PropTypes.array,
    onChange: PropTypes.func,
    maxLength: PropTypes.number,
    closable: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.object
};

const defaultProps = {
    className: '',
    tags: [],
    maxLength: 20,
    onChange: () => { },
    icon: <TagOutlined />
};

const TagsInput = (props) => {
    const {
        tags: pTags, maxLength, className,
        onChange, closable, icon
    } = props;
    let input;
    const [tags, setTags] = useState([]);

    const [inputVisible, setInputVisible] = useState(false);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        const formatTags = (_tags) => _tags.map((t) => {
            let _closable = closable;
            let tag;
            if (typeof t === 'string') {
                tag = t;
            } else {
                tag = t.value;
                _closable = t.closable;
            }
            tag = tag.startsWith('#') ? tag.slice(1) : tag;

            return { value: tag, closable: _closable };
        });

        let _tags = pTags || [];
        if (_tags?.length > 0) {
            _tags = formatTags(_tags);
            // remove duplicates
            _tags = array.RemoveDuplicates(_tags, 'value');
        }

        setTags(_tags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pTags]);

    useEffect(() => {
        if (inputVisible) {
            input.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputVisible]);

    const handleClose = (removedTag) => onChange(tags.filter((t) => t.value !== removedTag));

    const saveInputRef = (_input) => input = _input;

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        let tag = e.target.value;
        if (tag && tag.length > 0) {
            tag = tag.startsWith('#') ? tag.slice(1) : tag;
            tag = tag.slice(0, maxLength);
            setNewTag(tag);
        } else {
            setNewTag('');
        }
    };

    const handleInputConfirm = () => {
        let newTags;

        if (newTag?.trim() !== '' && !tags.find((t) => t.tag === newTag)) {
            newTags = [
                ...tags,
                {
                    value: newTag, closable: true
                }
            ];
        }

        setInputVisible(false);
        setNewTag('');
        onChange(newTags);
    };

    return (
        <div className={className}>
            {
                tags.length > 0 && tags.map(({ value, closable: _closable }) => {
                    const isLongTag = value.length > maxLength;
                    const tagElem = (
                        <Tag
                            icon={icon}
                            key={value}
                            closable={_closable}
                            onClose={() => handleClose(value)}>
                            {isLongTag ? `${value.slice(0, maxLength)}...` : value}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={value} key={value}>{tagElem}</Tooltip> : tagElem;
                })
            }
            {inputVisible && (
                <Input
                    ref={saveInputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={newTag}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {
                !inputVisible && (
                    <Tag
                        onClick={showInput}
                        style={{ borderStyle: 'dashed' }}>
                        <PlusOutlined />
                        {' '}
                        New Tag
                    </Tag>
                )
            }
        </div>
    );
};

TagsInput.propTypes = propTypes;

TagsInput.defaultProps = defaultProps;

export default TagsInput;
