import { _ } from 'oss-web-toolkits';

const getUrl = (url) => {
    const { search: urlList = '' } = new URL(url); // 拿到域名后面所有的参数

    const splitUrl = _.split(_.drop(_.split(urlList, '?')), '&');

    const newproject = {}; // 存储处理好的对象数据

    splitUrl.map((item, index) => {
        return (newproject[_.split(item, '=')[0]] = _.split(item, '=')[1]);
    });

    return newproject;
};
export default getUrl;
