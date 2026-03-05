import { message } from "oss-ui";

export const apiWrapper = (target) => {
  const origin = target.prototype;
  Object.getOwnPropertyNames(origin).forEach(key => {
    if (key === 'constructor') return
    if (typeof origin[key] === 'function') {
      const oldFunc = origin[key];
      origin[key] = async function (...args) {
        let timer = undefined;
        if (!navigator.onLine) {
          message.error('网络故障，请稍后重试或联系系统管理员')
        } else {
          timer = setTimeout(() => {
            message.info('正在加载中，请稍等片刻');
          }, 3000);
        }
        try {
          const result = await oldFunc.apply(this, args);
          clearTimeout(timer);
          return result;
        } finally {
          clearTimeout(timer);
        }
      }
    }
  })
}