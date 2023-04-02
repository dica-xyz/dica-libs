import React from 'react';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { shortId } from '../../utils';
import Link from '../link';

const propTypes = {};

const defaultProps = {};

const PostNewButton = (props) => {
    const { className } = props;
    const items = [
        {
            label: (
                <Link
                    to={`/short/new`}
                    addPrefix={true}
                    className="btn-link"
                >
                    New Short Story
                </Link>
            ),
            key: '1',
            icon: <EditOutlined />
        }
    ];

    return (
        <Dropdown.Button
            icon={<DownOutlined />}
            menu={{ items }}
            type="primary"
            className={className}
        >
            <EditOutlined />
            <Link
                to={`/post/new`}
                addPrefix={true}
                className="btn-link"
            >
                New Story
            </Link>
        </Dropdown.Button>
    );
};

PostNewButton.propTypes = propTypes;

PostNewButton.defaultProps = defaultProps;

export default PostNewButton;
