import PropTypes from 'prop-types';
import { Modal } from 'antd';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';

const propTypes = {
    afterDownload: PropTypes.func,
    account: PropTypes.object,
    title: PropTypes.string,
    content: PropTypes.string
};
const defaultProps = {
    afterDownload: () => { }
};
const { confirm } = Modal;

const DownloadWallet = (props) => {
    const {
        afterDownload, account, title, content
    } = props;
    return confirm({
        title: title || 'Your account is being created',
        content: content || `Account is associated with a wallet file which contains an account address and a secret.
        The wallet is used to log in to blockchain. Keep it safe. Click OK to download your wallet file.`,
        onOk: () => {
            const blob = new Blob([JSON.stringify(account)], { type: "text/json;charset=utf-8" });
            FileSaver.saveAs(blob, `${account.address}-${account.postKeypairs ? '-keypairs' : ''}${dayjs().format('YYYYMMDDHHmmss')}.dica`);
            afterDownload();
        },
        onCancel: () => { },
    });
};
DownloadWallet.propTypes = propTypes;
DownloadWallet.defaultProps = defaultProps;
export default DownloadWallet;