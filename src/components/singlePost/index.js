import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import RawHtml from '../rawHtml';
import Rtb from '../richTextBox';
import { MessageErrorBox } from '../messageBox';
import loadFile from '../feed/utils';
import FeatureImage from '../featureImage';
import withApis from '../withApis';
import ssrPostApi from '../../apis/postApi';
import './styles.less';

const propTypes = {
    postStore: PropTypes.object,
    postId: PropTypes.string,
    moduleId: PropTypes.string,
    ssrProps: PropTypes.object,
    savePostToStore: PropTypes.func,
    showFeatureImage: PropTypes.bool,
    showTitle: PropTypes.bool,
    showSummary: PropTypes.bool,
    showBody: PropTypes.bool,
    apis: PropTypes.object
};
const defaultProps = {
    ssrProps: {}
};

const getSeoData = (data) => {
    if (!data) return null;
    return {
        title: data?.title,
        description: data?.summary,
        canonicalUrl: data?.options?.canonicalUrl,
        keywords: data?.tags?.join(','),
        image: data?.featureImage,
        author: `${data?.author?.username ?? ''}, ${data?.author?.address}`,
        type: 'article'
    };
};

const SinglePost = (props) => {
    const params = useParams();
    const {
        savePostToStore, showFeatureImage, showTitle,
        postStore, ssrProps, moduleId, showSummary, showBody, apis
    } = props;
    const [post, setPost] = useState(ssrProps[moduleId]?.data);
    const { postApi, execApi } = apis;
    const ssrLoad = useRef(!!ssrProps[moduleId]);

    useEffect(() => {
        const getPost = async (_postId) => {
            execApi(
                (options) => postApi(options).getById(_postId),
                (result) => {
                    if (!result.success || !result.data) {
                        MessageErrorBox(`Unable to load post ${_postId}`);
                        return null;
                    }
                    const _post = loadFile(result.data);
                    setPost(_post);
                    savePostToStore(_post);
                    return null;
                }
            );
        };
        // for ssr, datasource is loaded at server side,
        // no need to load at client side again
        if (ssrLoad.current && post) { return; }
        // eslint-disable-next-line react/destructuring-assignment
        const postId = props.postId || params.postId;
        if (!post || post.postId !== postId) {
            const _post = postStore.postContents
                ? postStore.postContents.find((p) => p.postId === postId) : null;
            if (!_post) {
                getPost(postId);
            } else {
                setPost(_post);
            }
        }
        ssrLoad.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.postId]);

    return !post ? null : (
        <>
            {
                showFeatureImage && post.featureImage ? (
                    <FeatureImage
                        imageSrc={post.featureImage}
                        imageWidth="100%"
                        imageContainerHeight={600} alt="" />
                ) : null
            }
            <div className="post-section">
                {
                    showTitle ? <h1 className="post-title">{post.title}</h1> : null
                }
                {
                    showSummary && post.summary
                        ? <RawHtml html={post.summary} className="post-summary" />
                        : null
                }
                {
                    showBody
                        ? (
                            <div style={{ display: 'flex' }}>
                                <Rtb
                                    name="body"
                                    className="editor-readonly"
                                    readOnly={true}
                                    value={post.body}
                                    id={post.postId}
                                />
                            </div>
                        ) : null
                }
            </div>
        </>
    );
};

SinglePost.propTypes = propTypes;
SinglePost.defaultProps = defaultProps;

const getById = async (postId, options) => {
    const result = await ssrPostApi(options).getById(postId);

    if (!result?.data?.success || !result?.data?.data) { return null; }
    return loadFile(result.data.data);
};

export const getSsrProps = async (props, options) => {
    const { match, postId } = props;
    const data = await getById(match?.params?.postId || postId, options);

    return {
        data,
        seo: getSeoData(data)
    };
};

export default withApis(SinglePost);
