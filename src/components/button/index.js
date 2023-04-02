import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button as AntdButton } from 'antd';
import { GlobalContext } from '../../context';
import Link from '../link';
import './styles.less';

const propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
    type: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.object,
    to: PropTypes.string,
    site: PropTypes.object,
    onClick: PropTypes.func,
    preventDoubleClick: PropTypes.bool,
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    target: PropTypes.string,
    addPrefix: PropTypes.bool,
    reCAPTCHA: PropTypes.bool,
    reCAPTCHAAction: PropTypes.string
};

const defaultProps = {
    reCAPTCHA: false,
    size: 'default',
    type: 'primary',
    addPrefix: true,
    disabled: false,
    preventDoubleClick: false
};

const Button = (props) => {
    const {
        children, onClick, style, to, type, size, className,
        reCAPTCHA, reCAPTCHAAction, disabled: pDisabled,
        preventDoubleClick, addPrefix, ...rest
    } = props;
    const { site } = useContext(GlobalContext);
    const [disabled, setDisabled] = useState(false);

    const reCAPTCHAEnabled = () => reCAPTCHA && !!site.schema.site.reCAPTCHA;

    useEffect(() => {
        setDisabled(pDisabled);
    }, [pDisabled]);

    useEffect(() => {
        if (reCAPTCHAEnabled()) {
            const id = 'reCAPTCHA-dica';
            const isScriptExist = document.getElementById(id);
            if (!isScriptExist) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = `https://www.google.com/recaptcha/api.js?render=${site.schema.site.reCAPTCHA}`;
                script.id = id;
                document.body.appendChild(script);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (e) => {
        if (preventDoubleClick) {
            setDisabled(true);
        }
        if (reCAPTCHAEnabled()) {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(site.schema.site.reCAPTCHA, { action: reCAPTCHAAction ?? 'dica_submit' })
                    .then((token) => {
                        if (onClick) { onClick(e, token); }
                    });
            });
        } else if (onClick) {
            onClick(e);
        }
    };

    return (
        <AntdButton
            style={{ ...style, cursor: "pointer" }}
            disabled={disabled}
            onClick={handleClick}
            type={type}
            className={`dica-button ${className}`}
            size={size}
            {...rest}
        >
            {
                to
                    ? (
                        <Link
                            to={to}
                            addPrefix={addPrefix}
                            disabled={disabled}
                            className="btn-link"
                        >
                            {children}
                        </Link>
                    )
                    : children
            }
        </AntdButton>
    );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
