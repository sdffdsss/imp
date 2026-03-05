import request from '@Src/common/api';
// import config from '@Src/common/api/config.js';
const DEFAULT_BASE_URL = 'uploadProducitonUrl'; // 生产上传接口
// console.log(config);
/** *
 *自定义文件上传
 */
const uploadScripts = (params, cbSuccess, cbError) => {
    request('filemanage/v1/user/uploads', {
        data: params,
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '音频上传失败',
        baseUrlType: DEFAULT_BASE_URL,
    })
        .then((result) => {
            handleState(
                result,
                (data) => {
                    cbSuccess(data);
                },
                (error) => {
                    cbError(error);
                }
            );
        })
        .catch(function (error) {
            cbError(error);
        });
};

const handleState = (result, cbSuccess, cbError) => {
    if (result) {
        if (cbSuccess) {
            cbSuccess(result);
        }
    } else if (cbError) {
            cbError(result);
        }
};

export default {
    uploadScripts,
};
