/* eslint-disable */
const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;
const zh = require('../src/locales/zh.js');
const fr = require('../src/locales/fr.js');
const es = require('../src/locales/es.js');
const ru = require('../src/locales/ru.js');

const filePattern = path.join(__dirname, '../src/locales/messages.json');
const outputLanguageDataDir = path.join(__dirname, '../src/locales/');
// console.log(filePattern);
// console.log(outputLanguageDataDir);
// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(filePattern)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
        descriptors.forEach(({ id, defaultMessage }) => {
            if (!collection.hasOwnProperty(id)) {
                collection[id] = defaultMessage; //ignore duplicate id
            }
            else {
                console.log('Duplicate id:' + id); //output duplicate id for review
            }
        });

        return collection;
    }, {});

mkdirpSync(outputLanguageDataDir);


fs.writeFileSync(outputLanguageDataDir + 'en.js', `export default { "en": ${JSON.stringify(defaultMessages, Object.keys(defaultMessages).sort(), 2)} };`);

zh.zh = { ...defaultMessages, ...zh.zh };
fs.writeFileSync(outputLanguageDataDir + 'zh.js', `export default { "zh": ${JSON.stringify(zh.zh, Object.keys(zh.zh).sort(), 2)} };`);

fr.fr = { ...defaultMessages, ...fr.fr };
fs.writeFileSync(outputLanguageDataDir + 'fr.js', `export default { "fr": ${JSON.stringify(fr.fr, Object.keys(fr.fr).sort(), 2)} };`);

es.es = { ...defaultMessages, ...es.es };
fs.writeFileSync(outputLanguageDataDir + 'es.js', `export default { "es": ${JSON.stringify(es.es, Object.keys(es.es).sort(), 2)} };`);

ru.ru = { ...defaultMessages, ...ru.ru };
fs.writeFileSync(outputLanguageDataDir + 'ru.js', `export default { "ru": ${JSON.stringify(ru.ru, Object.keys(ru.ru).sort(), 2)} };`);