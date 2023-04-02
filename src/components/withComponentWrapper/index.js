import React, { useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import less from 'less';
import { injectIntl } from 'react-intl';
import connect from '../../context/connect';
import { theme } from '../../utils';

/**
 * Component wrapper that provides common properties and functionalities
 *
 * @param {*} WrappedComponent
 * @returns Wrapped component
 */
const withComponentWrapper = (WrappedComponent) => {
    if (!WrappedComponent) {
        return (
            <div>{`${WrappedComponent.displayName || ''} component not loaded`}</div>
        );
    }

    const WrappedClass = (props) => {
        const {
            style, className, css, moduleId, ...rest
        } = props;
        const id = useId().replace(/:/g, '-');

        // eslint-disable-next-line consistent-return
        useEffect(() => {
            if (css?.trim().length > 0) {
                const _less = `.dica-${id}{${css}}`;
                less.render(_less, {}, (error, output) => {
                    if (error) { console.error(error); return; }
                    theme.addGlobalStyle(`dica-${id}`, output.css);
                });
            }
            return () => {
                theme.removeElement(`dica-${id}`);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <div style={style} className={`dica-${id} ${className}`}>
                <WrappedComponent
                    moduleId={moduleId}
                    {...rest}
                />
            </div>
        );
    };
    WrappedClass.propTypes = {
        css: PropTypes.string,
        moduleId: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    WrappedClass.defaultProps = {
        className: ''
    };

    return connect(
        injectIntl(WrappedClass)
    );
};

export default withComponentWrapper;