import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'antd';
import EmailSubscribe from '../emailSubscribe';

import './styles.less';

const propTypes = {
    content: PropTypes.string,
    user: PropTypes.object,
};

const defaultProps = {
    content: '',
};

const Footer = (props) => {
    const { content, user } = props;
    const params = useParams();
    const publication = params.publication || '';

    return (
        <footer className="footer">
            <div className="footer_top_part">
                <Row>
                    <Col
                        lg={{ span: 6, offset: 3 }}
                        md={{ span: 8, offset: 2 }} sm={{ span: 24, offset: 0 }}>
                        <div className="widget widget_text">
                            <p>{content}</p>
                        </div>
                    </Col>
                    <Col lg={6} md={4} sm={6}>&nbsp;</Col>
                    <Col lg={6} md={8} sm={24}>
                        <div className="widget widget_newsletter form_section">
                            <h3 className="widget_title">Newsletter Sign Up</h3>
                            <div className="form_text">
                                Stay connected with publication
                                {` ${publication}`}
                                and get notified when latest articles arrive!
                            </div>
                            <EmailSubscribe user={user} />
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="powered-by">
                Powered by
                &nbsp;
                <a href="https://dica.xyz" target="_blank" rel="noopener">dica.xyz</a>
            </div>
        </footer>

    );
};

Footer.propTypes = propTypes;

Footer.defaultProps = defaultProps;

export default Footer;
