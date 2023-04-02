import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space } from 'antd';
import './styles.less';

const { Title } = Typography;

const propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object]),
    icon: PropTypes.object,
    titleLevel: PropTypes.number,
    subTitleLevel: PropTypes.number,
};
const defaultProps = {
    titleLevel: 3,
    subTitleLevel: 5
};
const PageHeader = (props) => {
    const { title, subTitle, icon, titleLevel, subTitleLevel } = props;
    return (
        <div className="page-header">
            {icon}
            <Space direction="horizontal">
                <Title level={titleLevel}>{title}</Title>
                {subTitle ? <Title level={subTitleLevel}>{subTitle}</Title> : null}
            </Space>
        </div>
    );
};
PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;
export default PageHeader;
