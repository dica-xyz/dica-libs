/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Space, Divider, Empty
} from 'antd';
import withPagination from '../withPagination';
import { SidechainForm } from '../sidechain';

const propTypes = {
    datasource: PropTypes.array,
    pagedDatasource: PropTypes.array,
    setPagedDataSource: PropTypes.func
};
const defaultProps = {};

const SidechainList = (props) => {
    const {
        datasource, pagedDatasource,
        setPagedDataSource, ...rest
    } = props;

    useEffect(() => {
        setPagedDataSource(datasource);
    }, [datasource]);

    return pagedDatasource && pagedDatasource.length
        ? (
            <Space direction="vertical" split={<Divider />}>
                {
                    pagedDatasource.map((sc) => (
                        typeof sc === 'string' // sc is id only
                            ? <SidechainForm id={sc} key={sc} {...rest} />
                            // sc is sidechain object
                            : <SidechainForm sidechain={sc} key={sc.id} {...rest} />
                    ))
                }
            </Space>
        ) : <Empty description="No sidechains found" />;
};
SidechainList.propTypes = propTypes;
SidechainList.defaultProps = defaultProps;
export default withPagination(SidechainList);