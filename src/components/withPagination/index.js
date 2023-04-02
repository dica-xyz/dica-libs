import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Pagination, Space } from 'antd';

const propTypes = {};
const defaultProps = {};
const WithPagination = (WrappedComponent) => {
    const WrappedClass = (props) => {
        const [pagination, setPagination] = useState({
            current: 1,
            defaultCurrent: 1,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            total: 0,
        });
        const [dataSource, setDataSource] = useState([]);
        const handlePageChange = (current, pageSize) => {
            setPagination({ ...pagination, current, pageSize });
        };
        const getPagedDataSource = () => {
            const ds = dataSource.filter((data, i) => i >= pagination.pageSize * (pagination.current - 1) && i < pagination.pageSize * pagination.current);
            return ds;
        };

        const setPagedDataSource = (ds) => {
            setDataSource(ds);
            setPagination({ ...pagination, total: ds.length });
        };

        return (
            <Space direction="vertical" style={{ width: '100%' }}>
                <WrappedComponent
                    {...props}
                    pagination={pagination}
                    pagedDatasource={getPagedDataSource() || []}
                    setPagedDataSource={setPagedDataSource}
                />
                {
                    pagination.total > 0 && pagination.pageSize < pagination.total
                        ? (
                            <Pagination
                                style={{ marginBottom: '20px' }}
                                {...pagination}
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                            />
                        ) : null
                }
            </Space>
        );
    };
    WrappedClass.propTypes = propTypes;
    WrappedClass.defaultProps = defaultProps;

    return WrappedClass;
};
WithPagination.propTypes = propTypes;
WithPagination.defaultProps = defaultProps;
export default WithPagination;