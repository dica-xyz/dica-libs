/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import CookieConsent from "react-cookie-consent";
import RawHtml from '../rawHtml';

const propTypes = {
    history: PropTypes.object,
    barLocation: PropTypes.string,
    buttonText: PropTypes.string,
    declineButtonText: PropTypes.string,
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
};
const defaultProps = {
    barLocation: "bottom",
    buttonText: "I accept",
    style: { background: "#2B373B" },
    buttonStyle: { color: "#4e503b", fontSize: "16px" },
    text: `
        <p>
           We use cookies to enhance the user experience, personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information you've provided to them or they've collected from your use of their services.
            If you continue use this web site or click
            <strong> I accept</strong>
        , it means you agree; otherwise, click
            <strong> I decline</strong>
        .
        </p>
    `,
};
const Consent = (props) => {
    const {
        barLocation, buttonText, text, history,
        style, buttonStyle, declineButtonText,
    } = props;
    return (
        <CookieConsent
            debug={process.env.NODE_ENV !== 'production'}
            location={barLocation}
            declineButtonText={declineButtonText}
            buttonText={buttonText}
            enableDeclineButton={true}
            onDecline={() => history.push('/')}
            style={style}
            containerClasses="container"
            buttonClasses="accept-button"
            declineButtonClasses="decline-button"
            buttonStyle={buttonStyle}
            expires={150}>
            <RawHtml html={text} />
        </CookieConsent>
    );
};
Consent.propTypes = propTypes;
Consent.defaultProps = defaultProps;
export default Consent;