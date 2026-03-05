import request from '@Src/common/api';

const baseUrlType = 'groupUrl';

class GroupApi {
    /**
     * 获取省份列表
     * @param {string} creator
     * @param {string} provinceId
     * @returns
     */
    async getProvinces(creator, provinceId) {
        const result = await request('group/findProvinces', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator,
                provinceId,
            },
        });
        return result || [];
    }

    /**
     * 获取地市列表
     * @param {string} parentRegionId
     * @param {string} creator
     * @returns
     */
    async getRegions(parentRegionId, creator) {
        const result = await request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                creator,
                parentRegionId,
            },
        });
        return result || [];
    }

    /**
     * 获取相关交接班信息
     * @param {Object} data
     * @param {string} data.operateUser 用户id
     * @param {string} data.provinceId 省份id 非必填
     * @returns
     */
    async getShiftingIfDutyUser(data) {
        const result = await request('schedule/findShiftingOfDutyUser', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result || [];
    }

    /**
     *
     * @param {number} pageNum
     * @param {number} groupId
     * @returns
     */
    async getHandoverGroupInfoList(pageNum, groupId) {
        const result = await request('content/findList', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                pageNum,
                groupId,
            },
        });
        return result;
    }

    async updateOrInsertOne(data) {
        const result = await request('content/updateOrInsertOne', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '保存数据成功',
            defaultErrorMessage: '保存数据失败',
            data,
        });
        return result;
    }

    async deleteOne(contentId, groupId) {
        const result = await request('content/deleteOne', {
            type: 'post',
            baseUrlType,
            defaultSuccessMessage: '删除数据成功',
            defaultErrorMessage: '删除数据失败',
            data: {
                contentId,
                groupId,
            },
        });
        return result;
    }

    async getUserRoleDetail(data) {
        const result = await request('alarmResourceByeoms/queryUserRoleDetail', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result?.rows || [];
    }

    async getDeptRoleDetail(deptIds) {
        const result = await request('alarmResourceByeoms/queryDeptRoleDetail', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { deptIds },
        });
        return result?.rows || [];
    }

    async checkUserInDept(deptIds) {
        const result = await request('alarmResourceByeoms/checkUserInDept', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: { deptIds },
        });
        return result.message;
    }

    async getUsersByDept(data) {
        const result = await request('alarmResourceByeoms/queryUsersByDept', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result;
    }

    async getMaintenanceTemplate(data) {
        const result = await request('eomsmaintain/banzuguanli/createImportTemplate', {
            type: 'post',
            baseUrlType,
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        return result.fileurl;
    }

    async getGroupDetail(groupId) {
        const result = await request('group/findGroupDetail', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showErrorMessage: false,
            showSuccessMessage: false,
            data: { groupId },
        });
        return result;
    }
}

export const groupApi = new GroupApi();
