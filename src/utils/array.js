const RemoveDuplicates = (arr, key) => {
    const newArr = key ? arr.map((e) => e[key]) : arr;
    return arr.filter((e, pos) => newArr.indexOf(key ? e[key] : e) === pos);
};

const HasSameElements = (arr1, arr2) => {
    const _arr1 = arr1 || [];
    const _arr2 = arr2 || [];

    if (_arr1.length !== _arr2.length) { return false; }

    if (_arr1.length > _arr2.length) { return _arr1.every((e) => _arr2.includes(e)); }

    return _arr2.every((e) => _arr1.includes(e));
};

export default {
    RemoveDuplicates,
    HasSameElements,
};