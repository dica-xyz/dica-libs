import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Button, Space, Select,
    Pagination as AntdPagination
} from "antd";
import './styles.less';

const propTypes = {
    mode: PropTypes.string,
    prevText: PropTypes.string,
    nextText: PropTypes.string,
    onChange: PropTypes.func,
    pageSizeOptions: PropTypes.array,
    showSizeChanger: PropTypes.bool,
    pageSize: PropTypes.number,
    defaultCurrent: PropTypes.number,
    current: PropTypes.number,
    total: PropTypes.number,
    onShowSizeChange: PropTypes.func
};
const defaultProps = {
    prevText: 'Prev',
    nextText: 'Next',
    defaultCurrent: 1,
    pageSizeOptions: [10, 20, 50, 100]
};

const { Option } = Select;

const Pagination = (props) => {
    const {
        mode, prevText, nextText, onChange,
        pageSizeOptions, showSizeChanger, pageSize: pPageSize,
        current, defaultCurrent, total, onShowSizeChange
    } = props;
    const [pageIndex, setPageIndex] = useState();
    const [pageSize, setPageSize] = useState(pPageSize);

    useEffect(() => {
        setPageIndex(current || defaultCurrent);
        setPageSize(pPageSize || 10);
    }, [current, defaultCurrent, pPageSize]);

    return mode === 'prevNext'
        ? (
            <Space className="dica-pagination">
                <Button
                    size="small"
                    disabled={pageIndex <= 1}
                    onClick={() => {
                        if (pageIndex - 1 <= 1) {
                            setPageIndex(1);
                            onChange(1, pageSize);
                        } else {
                            setPageIndex(pageIndex - 1);
                            onChange(pageIndex - 1, pageSize);
                        }
                    }}
                >
                    {prevText}
                </Button>
                <a className="page-index">{pageIndex}</a>
                <Button
                    size="small"
                    disabled={total < pageSize}
                    onClick={() => { setPageIndex(pageIndex + 1); onChange(pageIndex + 1, pageSize); }}
                >
                    {nextText}
                </Button>
                {
                    showSizeChanger
                        ? (
                            <Select
                                size="small"
                                defaultValue={pageSize}
                                onChange={(value) => { setPageSize(value); onShowSizeChange(pageIndex, value); }}
                            >
                                {
                                    pageSizeOptions.map((o) => <Option key={o} value={o}>{o}</Option>)
                                }
                            </Select>
                        )
                        : null
                }
            </Space>
        )
        : <AntdPagination {...props} />;
};
Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;