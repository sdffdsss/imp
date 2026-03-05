import request from '@Common/api';
/**
 * 获取工单列表
 */
export const getfailueList = (userId:string,pageNum:number)=>{
    return request(`v1/groups/messageStat`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            userId,
            pageSize:20,
            pageNum
        }
    });
}
/**
 * 
 * @param data 
 * @returns 
 */
 export const getUneradMessage = (data) => {
    return request(`v1/groups/unreadMessage`, {
        type: 'post',
        baseUrlType: 'chatUrl',
        showSuccessMessage: false,
        defaultErrorMessage: false,
        data,
    });
};
/**
 * 获取工单信息
 * @param sheetNo 
 * @returns 
 */
 export const getParams = (encryptStr:string)=>{
    return request(`v1/groups/decrypt`, {
        type: 'post',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            encryptStr
        }
    });
}