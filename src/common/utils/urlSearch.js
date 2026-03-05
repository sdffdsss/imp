import { _ } from 'oss-web-toolkits';

function urlSearch(search) {
    if (!search) return {};
    const searchUrl = new URL(search);
    const searchList = _.trimStart(searchUrl.search, '?').split('&');
    const urlObj = {};
    if (Array.isArray(searchList)) {
        searchList.forEach((item) => {
            const list = item.split('=');
            // eslint-disable-next-line prefer-destructuring
            urlObj[list[0]] = list[1];
        });
    }

    return urlObj;
}

export default urlSearch;
