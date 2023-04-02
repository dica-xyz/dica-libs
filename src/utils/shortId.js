import randomstring from 'randomstring';

const defaultOptions = {
    length: 10,
    readable: true,
    charset: 'alphanumeric'
};

export default (option) => randomstring.generate({ ...defaultOptions, ...option });