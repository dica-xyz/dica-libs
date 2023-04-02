import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import getTime from '../../utils/time';

import './styles.less';

const propTypes = {
    timestamp: PropTypes.number,
    showTime: PropTypes.bool,
    relativeTime: PropTypes.bool,
    format: PropTypes.string
};

const defaultProps = {
    relativeTime: false,
    showTime: true,
};

const TimeLabel = (props) => {
    const {
        timestamp, showTime, relativeTime, format
    } = props;

    return relativeTime
        ? (
            <Tooltip title={getTime(timestamp, false, false, format)} placement="topLeft">
                <div className="time-label">
                    {getTime(timestamp, showTime, relativeTime, format)}
                </div>
            </Tooltip>
        )
        : (
            <div className="time-label">
                {getTime(timestamp, showTime, relativeTime, format)}
            </div>
        );
};

TimeLabel.propTypes = propTypes;

TimeLabel.defaultProps = defaultProps;

export default TimeLabel;
