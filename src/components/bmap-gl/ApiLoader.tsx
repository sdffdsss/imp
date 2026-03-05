///
// 联通百度地图Api加载方案
// 加载api不应该放到index.html中
///
import { useEffect } from 'react';
import { useSetState } from 'ahooks';
import { _ } from 'oss-web-toolkits';
import { UrlConfig } from './config';

const globalConfig = {
    devUrl: `${UrlConfig.SCHEME}://${UrlConfig.DOMAIN_NAME}:${UrlConfig.PORT}`,
};

const setGlobalDevUrl = (url: string) => {
    if (url) {
        globalConfig.devUrl = url;
    }
};

let removeList: any = [];

const RUNTIME_KEY = Date.now();
const createApiLoaderElement = (type: 'script' | 'link') => {
    let el = document.head.querySelector(`[data-baidu-map-${type}="${RUNTIME_KEY}"]`);
    if (!el) {
        el = document.createElement(type);
        el.setAttribute(`data-baidu-map-${type}`, `${RUNTIME_KEY}`);
        document.head.appendChild(el);
        removeList.push(() => el?.remove());
    }
    return el;
};

const loadBMapApiJsFile = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseUrl = isDevelopment ? globalConfig.devUrl : window.location.origin;

    const BMAPGL_URL = `${baseUrl}/dugis-baidu`;
    // @ts-ignore
    window.BMAPGL_URL = BMAPGL_URL;
    // @ts-ignore
    window.TRAFFIC_URL = BMAPGL_URL;
    // @ts-ignore
    window.BMAPGL_OFFLINE_AK = 'baidu-8f34e4fabcf34fbdbdf171868337ae35';
    const script: any = createApiLoaderElement('script');
    script.type = 'text/javascript';
    script.src = `${BMAPGL_URL}/bmapgl/?path=gateway&qt=getscript&libraries=visualization`;
    removeList.push(() => script?.remove());
};

const loadBMapApiCssFile = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const link: any = createApiLoaderElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    // @ts-ignore
    link.href = `${isDevelopment ? globalConfig.devUrl : window.location.origin}/dugis-baidu/gateway/bmapgl/api/bmap.css`;
};

/**
 * 创建一个定时器轮询window.BMapGL是否已经被定义，用来确认bmap相关api已经装载完成
 * - 确定已经在index.html里面加载了bmap相关文件
 * - 可以使用`BMapApiLoader`
 */
const useBMapApiDetector = () => {
    const [state, setState] = useSetState({ loading: true });
    useEffect(() => {
        const timer = setInterval(() => {
            if (window.BMapGL) {
                setState({ loading: false });
                clearInterval(timer);
            }
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, [setState]);

    return state;
};

const BMapApiLoader = (props: any) => {
    const state = useBMapApiDetector();
    useEffect(() => {
        // 当以其他方式加载了地图api的时候，ApiLoader就不进行二次加载
        if (window.BMapGL) return _.noop;
        loadBMapApiJsFile();
        loadBMapApiCssFile();
        return () => {
            // removeList.forEach((fn) => fn());
            removeList = [];
        };
    }, []);

    if (state.loading) return null;
    return props.children;
};

export {
    //
    BMapApiLoader,
    useBMapApiDetector,
    setGlobalDevUrl,
};
