import { DictByFieldNameKey } from './types';
// 查询接口
export interface QueryDetailData {
    applicationNumber?: string; //申请编号
    createTime?: string; //创建时间
    updateTime: string; // 修改时间
    provinceName: string; //省份名称
    professionTypeName: string; //专业名称
    topic: string; //主题
    recorder: string; //记录人
    reinsuranceLevelName: string; //重保级别名称
    urgencyName: string; //紧急程度名称
    reinsuranceStartTime: string; //重保开始时间
    reinsuranceEndTime: string; //重保结束时间
    companyName: string; //公司名称
}

export interface QueryReinsuranceRecordsResponse {
    code: number;
    data: Array<QueryDetailData>;
    current: number;
    message: string;
    total: number;
    totalPages: number;
}

export interface QueryReinsuranceRecordsRequest {
    startTime?: string; // 开始时间 YYYY-mm-dd
    endTime?: string; // 结束时间 YYYY-mm-dd
    specialtys?: string[]; // 专业ID列表
    topic?: string; // 主题
    applicationDepartment?: string; // 申请单位
    reinsuranceLevels?: string[]; // 重保级别列表
    urgencies?: string[]; // 紧急程度列表
    pageNum?: number; // 页码 从1开始
    pageSize?: number; // 每页大小
    provinceId?: number;
    companyName?: string;
}

// 批量获取字典
export interface BatchGetDictByFieldNameResponse {
    code?: number;
    data: {
        [key in DictByFieldNameKey]: Array<{
            key: string;
            value: any;
        }>;
    };
    message?: String;
    total?: Number;
}

// 获取详情
export interface QueryReinsuranceRecordDetailRequest {
    applicationNumber: string; //申请编号
}

export interface QueryReinsuranceRecordDetailResponse {
    code?: number;
    message?: string;
    data?: QueryDetail;
    sessionId?: string;
}

// 附件
export interface Attachement {
    applicationNumber?: number;
    annexesPath?: string; // 附件路径
    annexesName?: string; // 附件名称
    annexesId?: string; // 附件标识
}

export interface QueryDetail {
    applicationNumber?: string; //申请编号
    createTime?: string; //创建时间
    updateTime: string; // 修改时间
    provinceName: string; //省份名称
    provinceId: number; // 省份ID
    professionTypeName: string; //专业名称
    professionType: number;
    topic: string; //主题
    recorder: string; //记录人
    circuitNumber: string; // 电路编号
    contactNumber: string; // 联系电话
    companyName: string; //公司名称
    applicationDepartment: string; // 申请部门
    reinsuranceLogoName: string; //重保标识名称
    reinsuranceLogo: number;
    reinsuranceTypeName: string; //	重保类型名称
    reinsuranceType: number;
    reinsuranceLevelName: string; // 重保级别名称
    reinsuranceLevel: number;
    urgencyName: string; //紧急程度名称
    urgency: number;
    reinsuranceStartTime: string; //重保开始时间
    reinsuranceEndTime: string; //重保结束时间
    circuitPath: string; // 电路路径
    annexesList?: Array<Attachement>; //附件
}

export interface QueryReinsuranceRecordDetailRespnse {
    code: number;
    data: QueryDetail;
    message: string;
}

// 新增
export interface CreateReinsuranceRecordRequest {
    provinceName: string; //省份名称
    provinceId: number; // 省份ID
    professionType: number;
    topic: string; //主题
    recorder: string; //记录人
    circuitNumber: string; // 电路编号
    contactNumber: string; // 联系电话
    companyName: string; //公司名称
    applicationDepartment: string; // 申请部门
    reinsuranceLogo: number;
    reinsuranceType: number;
    reinsuranceLevel: number;
    urgency: number;
    reinsuranceStartTime: string; //重保开始时间
    reinsuranceEndTime: string; //重保结束时间
    circuitPath: string; // 电路路径
    annexesIds?: Array<Attachement>; //附件
}

export interface CreateReinsuranceRecordRespnse {
    code?: number;
    message?: string;
    data?: boolean;
    sessionId?: string;
}

// 更新

export interface UpdateReinsuranceRecordRequest {
    applicationNumber?: string; //申请编号
    createTime?: string; //创建时间
    updateTime: string; // 修改时间
    provinceName: string; //省份名称
    provinceId: number; // 省份ID
    professionTypeName: string; //专业名称
    professionType: number;
    topic: string; //主题
    recorder: string; //记录人
    circuitNumber: string; // 电路编号
    contactNumber: string; // 联系电话
    companyName: string; //公司名称
    applicationDepartment: string; // 申请部门
    reinsuranceLogoName: string; //重保标识名称
    reinsuranceLogo: number;
    reinsuranceTypeName: string; //	重保类型名称
    reinsuranceType: number;
    reinsuranceLevelName: string; // 重保级别名称
    reinsuranceLevel: number;
    urgencyName: string; //紧急程度名称
    urgency: number;
    reinsuranceStartTime: string; //重保开始时间
    reinsuranceEndTime: string; //重保结束时间
    circuitPath: string; // 电路路径
    annexesList?: Array<Attachement>; //附件
}

export interface UpdateReinsuranceRecordResponse {
    code?: number;
    message?: string;
    data?: boolean;
    sessionId?: string;
}

// 删除
export interface DeleteReinsuranceRecordDetailRequest {
    applicationNumber: number;
}

export interface DeleteReinsuranceRecordDetailResponse {
    code?: number;
    message?: string;
    data?: boolean;
    sessionId?: string;
}
// 导出

export interface ExportReinsuranceRecordsRequest {
    startTime?: string;
    endTime?: string;
    provinceId?: number;
    professionTypes?: string[];
    topic?: string;
    companyName?: string;
    reinsuranceLevels?: string[];
    urgencies?: string[];
    pageSize?: number;
    current?: number;
}

export interface ExportReinsuranceRecordsResponse {}

// 下载
export interface DownloadFileRequest {
    annexesId: number;
}
