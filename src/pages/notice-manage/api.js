import request from "@Src/common/api";

// 公告管理-列表查询
export const getNoticeList = (data) => {
    return request('homepage/announcement/v1/notice/page', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};

// 公告管理-新增
export const addNotice = (data,params) => {
    return request('homepage/announcement/v1/notice', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params
        },
    });
};

// 公告管理-删除
export const deleteNotice = (data,params) => {
    return request('homepage/announcement/v1/notice', {
        type: 'delete',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params
        },
    });
};

// 公告管理-更新
export const updateNotice = (data,params) => {
    return request('homepage/announcement/v1/notice/update', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params
        },
    });
};

// 公告管理-发布/取消
export const publishNotice = (data,params) => {
    return request('homepage/announcement/v1/notice/publish', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params
        },
    });
};

// 公告管理-上传文件homepage/announcement/v1/importNotice
export const importNotice = (data,params) => {
    return request('homepage/announcement/v1/importNotice', {
        type: 'post',
        baseUrlType: 'monitorSetUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
        handlers: {
            params
        },
    });
}
