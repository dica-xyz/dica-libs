/**
 * Utility function to execute callback for eack key->value pair.
 */
export function forEach(obj, callback) {
    if (obj) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                callback(key, obj[key]);
            }
        }
    }
}

/**
 * Utility function to merge 2 objects.
 */
export function size(object) {
    if (object) {
        let count = 0;
        forEach(object, () => {
            count += 1;
        });
        return count;
    }
    return undefined;
}
