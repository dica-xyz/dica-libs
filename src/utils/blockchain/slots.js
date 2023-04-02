/* eslint-disable no-param-reassign */
/**
 * return epoch time - 2022/02/02 20:20:20:20
 * 
 * @returns {Date}
 */
import constants from './constants';

const beginEpochTime = () => constants.epochTime;

const getEpochTime = (time) => {
    if (time === undefined) {
        time = (new Date()).getTime();
    }

    const d = beginEpochTime();

    const t = d.getTime();

    return Math.floor((time - t) / 1000);
};
/**
 * return epoch time - 2019/10/01 18:00:00
 * 
 * @returns {Date}
 */

const interval = 10;
const delegates = 101;

const getTime = (time) => getEpochTime(time);

const getRealTime = (epochTime) => {
    if (epochTime === undefined) {
        epochTime = getTime();
    }

    const d = beginEpochTime();
    const t = Math.floor(d.getTime() / 1000) * 1000;

    return t + epochTime * 1000;
};

const getSlotNumber = (epochTime) => {
    if (epochTime === undefined) {
        epochTime = getTime();
    }

    return Math.floor(epochTime / interval);
};

const getSlotTime = (slot) => slot * interval;

const getNextSlot = () => {
    const slot = getSlotNumber();
    return slot + 1;
};

const getLastSlot = (nextSlot) => nextSlot + delegates;

export default {

    interval,

    delegates,

    getTime,

    getRealTime,

    getSlotNumber,

    getSlotTime,

    getNextSlot,

    getLastSlot,

};