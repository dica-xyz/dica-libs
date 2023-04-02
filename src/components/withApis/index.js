/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import apis from '../../apis';
import { MessageErrorBox } from '../messageBox';
import { GlobalContext } from '../../context';
/** 
 * Center place to handle error message from api call
*/
const withApis = (WrappedComponent) => {
    const WrappedClass = (props) => {
        const { httpOptions } = useContext(GlobalContext);
        const execApi = async (func, successCb, failedCb) => {
            try {
                const res = await func(httpOptions);

                if (res?.data?.success) {
                    if (successCb) {
                        return successCb(res?.data);
                    }
                } else {
                    MessageErrorBox(res?.data?.err);
                    if (failedCb) {
                        return failedCb(res?.data);
                    }
                }
                return res?.data;
            } catch (error) {
                if (error) {
                    if (Array.isArray(error)) {
                        MessageErrorBox(error);
                    } else {
                        MessageErrorBox([{ message: error.message || error }]);
                    }
                }
                return null;
            }
        };

        return (
            <WrappedComponent {...props}
                apis={{ ...apis, execApi, options: httpOptions }} />
        );
    };

    return WrappedClass;
};

export default withApis;