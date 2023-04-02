/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Modal, Card, Table, Descriptions
} from 'antd';
import { ApartmentOutlined, AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import Button from '../button';
import UserLink from '../userLink';
import withApis from '../withApis';
import { MessageBox } from '../messageBox';
import { getTransactionNameByValue } from '../../utils/blockchain/transactionTypes';
import ManageSidechain from './manageSidechain';
import CopyToClipBoard from '../copyToClipBoard';
import defaultTypes from './defaultTypes';
import './styles.less';

const { Column } = Table;

const propTypes = {
    apis: PropTypes.object,
    id: PropTypes.string,
    sidechain: PropTypes.object,
    editable: PropTypes.bool
};
const defaultProps = {

};
const SidechainForm = (props) => {
    const {
        id, sidechain: pSidechain,
        apis, editable
    } = props;
    const { sidechainApi, execApi } = apis;
    const [sidechain, setSidechain] = useState();
    const [subscribers, setSubscribers] = useState();
    const [isSubscribersModalVisible, setIsSubscribersModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const convertTypesToArray = (types) => Object.entries(defaultTypes).map(([key, value]) => ({
        type: key,
        name: getTransactionNameByValue(key),
        amount: (types[key].amount || value.amount) / 10 ** 8,
        fee: (types[key].fee || value.fee) / 10 ** 8,
        readOnly: defaultTypes[key].readOnly
    }));

    const showTypes = () => {
        Modal.info({
            style: { minWidth: '900px' },
            title: 'Transaction Types',
            content: (
                <>
                    <Table
                        dataSource={sidechain.types.map((t, key) => ({ ...t, key }))}
                        pagination={false}
                    >
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Type" dataIndex="type" key="type" />
                        <Column
                            align="right"
                            title="Amount"
                            dataIndex="amount"
                            key="amount"
                            render={(text) => `${text} D`}
                        />
                        <Column
                            align="right"
                            title="Fee"
                            dataIndex="fee"
                            key="fee"
                            render={(text) => `${text} D`}
                        />
                    </Table>
                    <ul style={{ marginLeft: '10px', listStyle: 'disc' }}>
                        <li>
                            Amount is how many coins the transaction creator will pay to recipient. Recipient of POSTLIKE, POSTDISLIKE and POSTCOMMENT is the post&apos;s author.
                        </li>
                        <li>
                            When there is transaction posted to sidechain, transaction creator will pay this fee, plus main chain transaction fee.
                        </li>
                    </ul>
                </>
            )
        });
    };

    const showSubscribers = () => {
        execApi(
            (options) => sidechainApi(options).getSubscribers(sidechain.id),
            (result) => {
                if (!result.data) {
                    MessageBox({
                        title: 'No subscriber, yet!',
                        type: 'info'
                    });
                } else {
                    setSubscribers(result.data);
                    setIsSubscribersModalVisible(true);
                }
            }
        );
    };

    useEffect(() => {
        if (id) {
            execApi(
                (options) => sidechainApi(options).getSidechainById(id),
                (result) => {
                    const _sidechains = { ...result.data, types: convertTypesToArray(result.data.types) };
                    setSidechain(_sidechains);
                }
            );
        }
    }, [id]);

    useEffect(() => {
        if (pSidechain) {
            const _sidechain = { ...pSidechain, types: convertTypesToArray(pSidechain.types) };
            setSidechain(_sidechain);
        }
    }, [pSidechain]);

    return !sidechain ? null : (
        <>
            <Card
                className="sidechain-form"
                title={(
                    <>
                        <a href={`/explorer/${sidechain.id}`} target="_blank">
                            {`${sidechain.name} (${sidechain.id})`}
                        </a>
                        {' '}
                        <CopyToClipBoard value={sidechain.id} />
                    </>
                )}
                extra={editable ? (
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => setIsEditModalVisible(true)}
                    >
                        Edit
                    </Button>
                )
                    : null}
                actions={[
                    <Button key="types" type="link" icon={<AppstoreOutlined />} onClick={showTypes}>Transaction Types & Fees</Button>,
                    <Button key="subscribers" type="link" icon={<ApartmentOutlined />} onClick={showSubscribers}>Subscribers</Button>
                ]}
            >
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Creator"><UserLink address={sidechain.creator} /></Descriptions.Item>
                    <Descriptions.Item label="Recipient">{sidechain.recipientId ? <UserLink address={sidechain.recipientId} /> : 'Not specified'}</Descriptions.Item>
                    <Descriptions.Item label="Url" span={2}>{sidechain.url}</Descriptions.Item>
                    <Descriptions.Item label="Description" span={2}>{sidechain.description}</Descriptions.Item>
                </Descriptions>
            </Card>
            <ManageSidechain
                sidechain={sidechain}
                visible={isEditModalVisible}
                hideModal={() => setIsEditModalVisible(false)}
            />
            <Modal
                style={{ minWidth: "1000px" }}
                title="Subscribers"
                open={isSubscribersModalVisible}
                footer={
                    (
                        <div style={{ textAlign: "right" }}>
                            <Button
                                type="primary"
                                onClick={() => setIsSubscribersModalVisible(false)}>
                                OK
                            </Button>
                        </div>
                    )
                }
            >
                <Table
                    rowKey="senderId"
                    dataSource={subscribers}
                    pagination={false}
                >
                    <Column
                        title="Name"
                        dataIndex="senderId"
                        key="senderId"
                        render={(address) => (
                            <div onClick={() => setIsSubscribersModalVisible(false)} role="presentation">
                                <UserLink address={address} />
                            </div>
                        )}
                    />
                    <Column
                        title="Url"
                        dataIndex="publicationUrl"
                        key="url"
                        render={(url) => (
                            <a href={url} target="_blank">{url}</a>
                        )}
                    />
                </Table>
            </Modal>
        </>
    );
};
SidechainForm.propTypes = propTypes;
SidechainForm.defaultProps = defaultProps;
export default withApis(SidechainForm);
