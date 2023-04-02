import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import '../styles.less';

const propTypes = {
    summary: PropTypes.string,
    showTooltip: PropTypes.bool,
    wordsLimit: PropTypes.number
};

const defaultProps = {
    showTooltip: false,
    wordsLimit: 15
};

const PostSummary = (props) => {
    const { summary, showTooltip, wordsLimit } = props;
    if (!summary || summary.trim() === '') return null;
    let _summary = summary;
    if (summary.split(' ').length > wordsLimit) {
        _summary = `${summary.split(' ').slice(0, wordsLimit).join(' ')} ...`;
    }
    return showTooltip
        ? (
            <Tooltip placement="topLeft" title={summary}>
                <div className="post-summary">
                    {_summary}
                </div>
            </Tooltip>
        )
        : (
            <div className="post-summary">
                {_summary}
            </div>
        );
};

PostSummary.propTypes = propTypes;

PostSummary.defaultProps = defaultProps;

export default PostSummary;
