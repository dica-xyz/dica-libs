import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Table, Tooltip, Card, Empty, Radio
} from 'antd';
import withComponentWrapper from '../withComponentWrapper';
import withApis from '../withApis';
import { getTransactionNameByValue } from '../../utils/blockchain/transactionTypes';
import constants from '../../utils/blockchain/constants';

import './styles.less';

const { Column } = Table;

const propTypes = {
    // if specified, data source will only show info of specified sidechain
    // ignored if transactionType <= 100
    sidechainId: PropTypes.string,
    onChange: PropTypes.func,
    transactionType: PropTypes.number.isRequired,
    user: PropTypes.object,
    apis: PropTypes.object
};
const defaultProps = {
    onChange: () => { }
};
/**
 * Show list of subscribed sidechains info, as well as sponsorship with specified transaction type and address
 * 
 * @param {*} props
 * @returns
 */
const BlockchainSponsorInfo = (props) => {
    const {
        onChange, user, apis,
        transactionType, sidechainId: pSidechainId
    } = props;
    const { siteApi, execApi } = apis;
    const [dataSource, setDataSource] = useState();
    const [sidechainId, setSidechainId] = useState();
    useEffect(() => {
        setSidechainId(pSidechainId)
    }, [pSidechainId]);

    useEffect(() => {
        if (!user || !user.isLogin) { return; }
        execApi(
            (options) => siteApi(options).getSponsorshipInfoByAddress({
                address: user.address,
                sidechainId,
                type: transactionType
            }),
            (result) => {
                setDataSource(result.data);
                if (sidechainId) {
                    onChange({ name: result.data.name, id: result.data.id });
                }
            }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onClick = ({ name, id }) => {
        setSidechainId(id)
        onChange({ name, id });
    };

    return (!dataSource || dataSource.length === 0)
        ? (
            <Empty
                className="sidechain-sponsor-info empty"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    user.isLogin
                        ? `There is no blockchain or transaction type ${getTransactionNameByValue(transactionType)} ${sidechainId ? `of sidechain(${sidechainId})` : ''} is not sponsored`
                        : (
                            <p>
                                To see blockchain & sponsor info, please
                                {' '}
                                <strong>sign in</strong>
                                .
                            </p>
                        )
                } />
        )
        : (
            <Card
                size="small"
                className="sidechain-sponsor-info"
                title="Blockchain & Sponsorship"
                extra={`Type: ${getTransactionNameByValue(transactionType)}`}
            >
                <Table
                    size="small"
                    rowKey="id"
                    dataSource={dataSource}
                    pagination={false}>
                    {
                        transactionType > 100
                            ? (
                                <Column
                                    title="Blockchain Name"
                                    dataIndex="name"
                                    key="name"
                                    render={(text, record) => (
                                        <Tooltip title={record.description}>
                                            <Radio
                                                name="sidechain-sponsor-selector"
                                                onClick={() => onClick({ name: text, id: record.id })}
                                                checked={sidechainId === record.id}
                                            >
                                                <a role="presentation">{text}</a>
                                            </Radio>
                                        </Tooltip>
                                    )}
                                />
                            )
                            : null
                    }
                    <Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                        align="right"
                        render={(text) => `${(Number(text) / constants.fixedPoint).toFixed(2)} D`}
                    />
                    <Column
                        title="Fees"
                        dataIndex="fee"
                        key="fee"
                        align="right"
                        render={(text, record) => `${(Number(text) / constants.fixedPoint).toFixed(2)} D ${record.id === 'mainchain' ? '' : ` + ${record.sidechainFee / 10 ** 8 || 0} D`}`}
                    />
                    <Column
                        title="Used / Limit"
                        dataIndex="usedCount"
                        key="usedCount"
                        align="right"
                        render={(text, record) => (Number(text) / 10 ** 8 >= Number(record.numberLimit)
                            ? (
                                <span style={{ color: 'red' }}>
                                    {`${text} / ${record.numberLimit} times`}
                                </span>
                            )
                            : `${text} / ${record.numberLimit} times`)}
                    />
                    <Column
                        title="Used / Total Amount"
                        dataIndex="usedTotalAmount"
                        key="usedTotalAmount"
                        align="right"
                        render={(text, record) => (Number(text) / 10 ** 8 >= Number(record.totalAmount)
                            ? (
                                <span style={{ color: 'red' }}>
                                    {`${Number(text) / 10 ** 8} D / ${record.totalAmount} D`}
                                </span>
                            )
                            : `${Number(text) / 10 ** 8} D / ${record.totalAmount} D`)}
                    />
                </Table>
                <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
                    <li>Amount is how many coins you will pay to recipient.</li>
                    <li>Fees are of mainchain and sidechain fees.</li>
                    <li>Limit and total amount are reset every day.</li>
                    <li>Total amount is the quota that sponsor will spend per day for the whole publication.</li>
                </ul>
            </Card>
        );
};
BlockchainSponsorInfo.propTypes = propTypes;
BlockchainSponsorInfo.defaultProps = defaultProps;
export default withComponentWrapper(withApis(BlockchainSponsorInfo));