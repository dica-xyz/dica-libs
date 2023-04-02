import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    HeartOutlined, HeartFilled
} from '@ant-design/icons';
import withApis from '../withApis';
import { NeedLogin } from '../messageBox';

const propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    apis: PropTypes.object,
    checked: PropTypes.bool
};
const defaultProps = {};
const FavIcon = (props) => {
    const {
        post: { postId }, apis, user, checked: pChecked
    } = props;
    const { postStatApi, execApi } = apis;
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(pChecked);
    }, [pChecked]);

    const delFav = async () => {
        execApi(
            (options) => postStatApi(options).deleteFavPostById({ postId, secret: user.secret }),
            () => setChecked(false)
        );
    };

    const saveFav = async () => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }

        execApi(
            (options) => postStatApi(options).saveFav({ postId, secret: user.secret }),
            () => setChecked(true)
        );
    };

    return checked ? (
        <HeartFilled
            onClick={() => delFav()}
            className="post-stat-icon post-stat-icon-fav post-stat-icon-checked"
            title="Save"
        />
    )
        : (
            <HeartOutlined
                onClick={() => saveFav()}
                className="post-stat-icon post-stat-icon-fav"
                title="Save"
            />
        );
};
FavIcon.propTypes = propTypes;
FavIcon.defaultProps = defaultProps;
export default withApis(FavIcon);