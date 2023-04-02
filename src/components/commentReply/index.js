import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List } from 'antd';
import withApis from '../withApis';
import Comments from '../comments';
import './styles.less';

const propTypes = {
    parent: PropTypes.object.isRequired,
    numberOfReply: PropTypes.number,
    newComment: PropTypes.object,
    apis: PropTypes.object
};
const defaultProps = {};

const { Panel } = Collapse;

const CommentReply = (props) => {
    const {
        parent: { parentId },
        apis, newComment, numberOfReply
    } = props;
    const [datasource, setDatasource] = useState([]);
    const { postApi, commentApi, execApi } = apis;
    const [count, setCount] = useState(0);
    const getReplies = () => {
        if (datasource?.length === 0) {
            execApi(
                (options) => commentApi(options).getByParentId(parentId),
                (result) => {
                    setDatasource(result.data || []);
                }
            );
        }
    };

    useEffect(() => {
        setCount(numberOfReply);
    }, [numberOfReply]);

    useEffect(() => {
        if (newComment) {
            setCount(count + 1);
            setDatasource([newComment, ...datasource]);
        }
    }, [newComment]);

    return count > 0
        ? (
            <Collapse
                ghost
                onChange={getReplies}
            >
                <Panel
                    header={
                        (
                            <span className="comment-reply-count">
                                {count} {count > 1 ? 'replies' : 'reply'}
                            </span>
                        )
                    }
                    key="1">
                    <Comments comments={datasource} />
                </Panel>
            </Collapse>
        ) : null
};

CommentReply.propTypes = propTypes;
CommentReply.defaultProps = defaultProps;
export default withApis(CommentReply);