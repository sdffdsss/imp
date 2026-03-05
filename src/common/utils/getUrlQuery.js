export default function getUrlQuery() {
    const result = {};
    const searchStr = window.location.href.split('?')[1];
    if (!searchStr) return {};
    const searchArr = searchStr.split('&');
    searchArr.forEach(item => {
        if (item.includes('=')) {
            const key = item.split('=')[0];
            const value = item.split('=')[1];
            result[key] = value;
        }
    });
    return result;
}
