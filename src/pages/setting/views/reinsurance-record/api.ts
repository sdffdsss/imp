import request from '@Common/api';
import {
    QueryReinsuranceRecordsRequest,
    QueryReinsuranceRecordsResponse,
    UpdateReinsuranceRecordRequest,
    UpdateReinsuranceRecordResponse,
    BatchGetDictByFieldNameResponse,
    CreateReinsuranceRecordRequest,
    CreateReinsuranceRecordRespnse,
    QueryReinsuranceRecordDetailRequest,
    QueryReinsuranceRecordDetailResponse,
    ExportReinsuranceRecordsRequest,
    ExportReinsuranceRecordsResponse,
} from './api-types';
/**
 * @description: 批量获取字典
 * @param {*}
 * @return {*}
 */
export const BatchGetDictByFieldName = async (data): Promise<BatchGetDictByFieldNameResponse> => {
    const res: BatchGetDictByFieldNameResponse = await request(`dict/getDictByFieldNames`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};

/**
 * @description: 新增重保记录
 * @param {*}
 * @return {*}
 */
export const CreateReinsuranceRecord = async (data: CreateReinsuranceRecordRequest): Promise<CreateReinsuranceRecordRespnse> => {
    // return { "code": 200, "message": "eiu", "data": "aliquip", "total": -3551479 }
    const res: CreateReinsuranceRecordRespnse = await request(`reinsuranceRecord/createReinsuranceRecord`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};

/**
 * @description: 更新重保记录
 * @param {*}
 * @return {*}
 */
export const UpdateReinsuranceRecord = async (data: UpdateReinsuranceRecordRequest): Promise<UpdateReinsuranceRecordResponse> => {
    const res: UpdateReinsuranceRecordResponse = await request(`reinsuranceRecord/updateReinsuranceRecord`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        data,
    });

    return res;
};

/**
 * @description: 查询重保记录列表
 * @param {*}
 * @return {*}
 */
export const QueryReinsuranceRecords = async (data: QueryReinsuranceRecordsRequest): Promise<QueryReinsuranceRecordsResponse> => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res: QueryReinsuranceRecordsResponse = await request(`reinsuranceRecord/queryReinsuranceRecords`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        data,
        showSuccessMessage: false,
    });

    return res;
};

export const QueryReinsuranceRecordDetail = async (data: QueryReinsuranceRecordDetailRequest): Promise<QueryReinsuranceRecordDetailResponse> => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res = await request(`reinsuranceRecord/queryReinsuranceRecordDetail`, {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        data,
        showSuccessMessage: false,
    });

    return res;
};

/**
 * @description: 导出
 * @param {*}
 * @return {*}
 */
export const ExportReinsuranceRecords = async (data: ExportReinsuranceRecordsRequest): Promise<ExportReinsuranceRecordsResponse> => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res = await request(`reinsuranceRecord/exportReinsuranceRecords`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        data,
        showSuccessMessage: false,
        responseType: 'blob',
    });
    return res;
};

/**
 * @description: 删除
 * @param {*}
 * @return {*}
 */
export const DeleteReinsuranceRecordDetail = async (data) => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res = await request(`reinsuranceRecord/deleteReinsuranceRecordDetail`, {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        data,
    });

    return res;
};

export const UploadFile = async (data) => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res = await request(`reinsuranceRecord/uploadFile`, {
        type: 'post',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        defaultErrorMessage: '获取数据失败',
        data,
    });

    return res;
};

export const DownloadFile = async (data) => {
    // return { "code": 200, "message": "voluptate dolor", "data": [{ "applicationNumber": "dolore labore elit proident reprehenderit", "createTime": "2005-06-17 02:36:37", "updateTime": "1991-01-19 06:11:09", "provinceName": "Lorem", "professionTypeName": "est", "topic": "amet proident sint id in", "recorder": "in", "reinsuranceLevelName": "elit cupidatat", "urgencyName": "voluptate ipsum labore cupidatat elit", "reinsuranceStartTime": "2014-06-19 10:37:32", "reinsuranceEndTime": "2013-11-17 14:32:38" }, { "applicationNumber": "Ut", "createTime": "2000-09-08 03:42:58", "updateTime": "2015-03-12 16:57:40", "provinceName": "ullamco occaecat Ut ut", "professionTypeName": "eiusmod labore", "topic": "et", "recorder": "sed sunt ut", "reinsuranceLevelName": "amet eu aliqu", "urgencyName": "veniam cupidatat occaecat", "reinsuranceStartTime": "2015-07-08 22:54:12", "reinsuranceEndTime": "2004-12-05 19:42:12" }, { "applicationNumber": "labore fugiat elit Duis esse", "createTime": "1984-11-05 23:48:42", "updateTime": "2003-11-16 05:05:00", "provinceName": "sunt do magna aliquip", "professionTypeName": "cupidatat quis in est dolore", "topic": "ut amet", "recorder": "incididunt Ut non est", "reinsuranceLevelName": "proident", "urgencyName": "ut proident", "reinsuranceStartTime": "2003-09-14 14:11:50", "reinsuranceEndTime": "1979-08-12 13:12:30" }], "total": -70949597 }
    const res = await request(`reinsuranceRecord/downloadFile`, {
        type: 'get',
        baseUrlType: 'reinsuranceRecordUrl',
        showSuccessMessage: false,
        responseType: 'blob',
        data,
    });

    return res;
};
