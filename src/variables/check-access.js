function checkAccessPage (array, value, key = 'page') {
    return array.some(object => object[key] === value);
}

module.exports = checkAccessPage;