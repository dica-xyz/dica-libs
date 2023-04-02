import dayjs from 'dayjs';
import slots from './blockchain/slots';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

export default (timestamp, showTime, relativeTime, format) => {
    const _showTime = showTime ?? false;
    const _relativeTime = relativeTime ?? false;

    const _format = format ?? `YYYY-MM-DD${_showTime ? ' HH:mm:ss' : ''}`;

    const time = dayjs(slots.getRealTime(timestamp));
    return _relativeTime ? time.fromNow() : time.format(_format);
};