import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Modal, Input, Dropdown, Space
} from 'antd';
import { MessageBox, NeedLogin } from '../messageBox';
import BlockchainSponsorInfo from '../blockchainSponsorInfo';
import withComponentWrapper from '../withComponentWrapper';
import './styles.less';

const propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    confirmationMessage: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string]),
    buttonText: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string]),
    onValidation: PropTypes.func,
    onBlockchainChange: PropTypes.func,
    onSubmit: PropTypes.func,
    disabled: PropTypes.bool,
    user: PropTypes.object.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    icon: PropTypes.object,
    type: PropTypes.string,
    size: PropTypes.string,
    transactionType: PropTypes.number.isRequired,
    showBlockchainInfo: PropTypes.bool,
    sidechainId: PropTypes.string
};

const defaultProps = {
    title: 'Confirm',
    type: 'primary',
    buttonText: 'Submit',
    placeholder: 'Please enter second secret',
    confirmationMessage: null,
    disabled: false,
    size: 'middle',
    showBlockchainInfo: true,
    onSubmit: () => { },
    onBlockchainChange: () => { }
};
/**
 * A button that submits transactions to blockchain
 *
 * Shows a confirmation modal with optional second secret input
 * @param {*} props
 * @returns
 */
const BlockchainButton = (props) => {
    const {
        placeholder, buttonText, title, onValidation,
        onSubmit, confirmationMessage, style, className,
        icon, type, disabled, user, sidechainId, size,
        showBlockchainInfo, onBlockchainChange, transactionType

    } = props;
    const [showModal, setShowModal] = useState();
    const [secondSecret, setSecondSecret] = useState(user.secondSecret);
    const [sidechain, setSidechain] = useState();

    useEffect(() => {
        if (sidechainId) {
            const _sidechain = { id: sidechainId };
            setSidechain(_sidechain);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sidechainId]);

    const _onSubmit = async () => {
        setTimeout(() => onSubmit({ secondSecret }), 0);
        setShowModal(false);
    };

    const onAfterValidation = () => {
        if (!confirmationMessage && user.secondSignature !== 1) {
            _onSubmit();
            return;
        }

        setShowModal(true);
    };

    const _onValidation = (e) => {
        e.preventDefault();

        if (!user.isLogin) {
            NeedLogin();
            return;
        }

        if (transactionType > 100 && !sidechain) {
            MessageBox({
                title: 'Choose a blockchain please',
                type: 'error'
            });
            return;
        }

        if (!onValidation) {
            onAfterValidation();
            return;
        }

        onValidation((err) => {
            if (err) {
                if (typeof err === 'string') {
                    MessageBox({ title: err, type: 'error' });
                } else {
                    MessageBox(err);
                }

                return;
            }
            onAfterValidation();
        });
    };

    return (
        <Space className="blockchain-button-container">
            <Dropdown.Button
                placement="top"
                arrow="false"
                size={size}
                onClick={_onValidation}
                menu={showBlockchainInfo ? {
                    items: [{
                        key: 'info',
                        label: (
                            <BlockchainSponsorInfo
                                transactionType={transactionType}
                                sidechainId={sidechainId}
                                onChange={(_sidechain) => {
                                    setSidechain(_sidechain);
                                    onBlockchainChange(_sidechain);
                                }}
                            />
                        )
                    }]
                } : null}
                disabled={disabled}
                type={type}
                icon={icon}
                style={style}
                className={className}
            >
                {buttonText}
            </Dropdown.Button>

            <Modal
                title={title}
                open={showModal}
                onOk={_onSubmit}
                onCancel={() => setShowModal(false)}
                destroyOnClose={true}
                className="blockchain-button-modal"
            >
                {
                    confirmationMessage
                        ? (
                            <div style={{ marginTop: '10px', marginBottom: '50px' }}>
                                {confirmationMessage}
                            </div>
                        )
                        : null
                }
                {
                    user.secondSignature === 1
                        ? (
                            <Space direction="vertical" style={{ width: '100%' }}>
                                Second Secret:
                                <Input.Password
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    onChange={(e) => setSecondSecret(e.target.value)}
                                    value={secondSecret} />
                            </Space>
                        )
                        : null
                }
            </Modal>
        </Space>
    );
};

BlockchainButton.propTypes = propTypes;
BlockchainButton.defaultProps = defaultProps;
export default withComponentWrapper(BlockchainButton);