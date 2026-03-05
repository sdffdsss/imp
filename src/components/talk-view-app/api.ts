import request from '@Common/api';
/**
 * 创建群聊和再次进入群聊接口
 * @param data 
 * @returns 
 */
export const actionChatGroup = (data)=>{
    return request(`v1/groups`, {
        type: 'post',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data
    });
}
/**
 * 新增群成员接口
 * @param groupId 工单id 
 * @param userIds 新增用户集合
 * @returns 
 */
export const actionAddUser = (groupId:string,userIds:string[])=>{
    return request(`v1/groups/${groupId}/users`, {
        type: 'patch',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            userIds
        }
    });
}
/**
 * 获取历史消息
 * @param groupId 工单id
 * @param pageSize 历史消息每页条数
 * @param pageNum 历史消息页数
 * @returns 
 */
export const historyMessageAction = (groupId:string,pageSize:number,pageNum:number)=>{
    return request(`v1/groups/${groupId}/message`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            pageSize,
            pageNum
        }
    });
}
/**
 * 获取用户列表接口
 * @param data 
 * @returns 
 */
export const getUserList = (data)=>{
    return request(`v1/groups/users`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data
    });
}
/**
 * 获取未读消息列表
 * @param groupId 
 * @param fromId 
 * @param groupMsgNo 
 * @returns 
 */
 export const getUserDeatail = (groupId,fromId,groupMsgNo)=>{
    return request(`v1/groups/unreadMessageDetail`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            groupId,
            fromId,
            groupMsgNo
        }
    });
}
/**
 * 删除群成员
 * @param groupId 
 * @param userIds 
 * @returns 
 */
export const delUserChange = (groupId:string,userIds:string[])=>{
    return request(`v1/groups/${groupId}/users`, {
        type: 'delete',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            userIds
        }
    });
}
/**
 * 获取工单信息
 * @param sheetNo 
 * @returns 
 */
export const sheetNoSend = (sheetNo:string)=>{
    return request(`v1/groups/sheet`, {
        type: 'get',
        baseUrlType: 'chatUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data:{
            sheetNo
        }
    });
}
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