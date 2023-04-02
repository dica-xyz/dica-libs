import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MessageBox, NeedLogin } from '../messageBox';
import BlockchainButton from '../blockchainButton';
import withApis from '../withApis';
import { TransactionTypes } from "../../utils/blockchain";

const propTypes = {
    size: PropTypes.string,
    apis: PropTypes.object,
    user: PropTypes.object,
    intl: PropTypes.object.isRequired,
    author: PropTypes.string,
};
const defaultProps = {
    size: 'middle'
};
const Follow = (props) => {
    const {
        size, user, author, intl, apis
    } = props;
    const { followApi, execApi } = apis;
    const [followed, setFollowed] = useState(false);

    const handleFollow = async () => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        if (followed) return;
        execApi(
            (options) => followApi(options).following({
                secret: user.secret,
                recipientId: author,
            }),
            () => {
                setFollowed(true);
                MessageBox({
                    title: intl.formatMessage({ id: 'user.followingSucceed' }),
                    type: 'success',
                });
            }
        );
    };

    useEffect(() => {
        if (user.isLogin && author) {
            execApi(
                (options) => followApi(options).hasFollowed({
                    address: user.address,
                    author
                }),
                (result) => setFollowed(result.data)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.isLogin]);

    return user.address === author ? null : (
        <BlockchainButton
            size={size}
            buttonText={followed ? 'following' : 'follow'}
            className={`${followed ? 'btn-following' : 'btn-follow'} hidden-xs`}
            transactionType={TransactionTypes.FOLLOWING}
            onSubmit={handleFollow}
            type={followed ? 'primary' : 'default'}
        />
    );
};
Follow.propTypes = propTypes;
Follow.defaultProps = defaultProps;
export default withApis(Follow);