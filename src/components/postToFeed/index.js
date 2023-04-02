import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal } from 'antd';
import withApis from '../withApis';
import { MessageBox } from '../messageBox';
import './styles.less';

const propTypes = {
    apis: PropTypes.object,
    user: PropTypes.object,
    post: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string
};
const defaultProps = {
    title: 'Post Published'
};
const PostToFeed = (props) => {
    const {
        user: { secret }, post: { postId, status },
        apis, visible, onClose, title
    } = props;
    const { feedApi, execApi } = apis;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [feedIds, setFeedIds] = useState();

    useEffect(() => {
        /**
         * get feeds if author is a publication too
         *
         */
        if (!visible) { return; }
        execApi(
            (options) => feedApi(options).getFeedsByPostId({ secret, postId }),
            (result) => {
                if (result.data.length) {
                    const _selectedRowKeys = result.data
                        .filter((feed) => feed.selected)
                        .map((feed) => feed.id);
                    setSelectedRowKeys(_selectedRowKeys);
                    setFeedIds(result.data.map(({ id, selected }) => (
                        { id, selected: Boolean(selected) }
                    )));
                    setDataSource(result.data);
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const onSelectChange = (_selectedRowKeys) => {
        setSelectedRowKeys(_selectedRowKeys);
        setFeedIds(dataSource.map(({ id }) => (
            {
                id,
                selected: _selectedRowKeys.indexOf(id) >= 0
            }
        )));
    };

    const columns = [
        {
            title: <strong>Feeds</strong>,
            dataIndex: 'name'
        }
    ];

    const savePostToFeeds = () => {
        if (!feedIds || feedIds.length === 0) {
            onClose(); return;
        }
        execApi(
            (options) => feedApi(options).savePostToFeeds({
                feedIds,
                postId,
                secret,
                status
            }),
            () => {
                onClose(true);
            }
        );
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <Modal
            title={title}
            open={visible}
            onOk={savePostToFeeds}
            onCancel={() => onClose()}
        >
            <p>
                To show this post on your publication, add it to one or more feeds.
            </p>
            <Table
                rowSelection={rowSelection}
                rowKey="id"
                pagination={{ pageSize: 7 }}
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                size="small"
            />
        </Modal>
    );
};
PostToFeed.propTypes = propTypes;
PostToFeed.defaultProps = defaultProps;
export default withApis(PostToFeed);