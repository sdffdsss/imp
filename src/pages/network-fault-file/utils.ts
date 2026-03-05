import moment from 'moment';

// 格式化故障记录数据
export const formatFaultRecordData = (data: any) => {
    if (!data) return {};

    const formatDateTime = (dateTime: any) => {
        if (!dateTime) return undefined;
        return moment(dateTime).isValid() ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : undefined;
    };

    const formatDate = (date: any) => {
        if (!date) return undefined;
        return moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : undefined;
    };

    const formatDuration = (startTime: any, endTime: any) => {
        if (!startTime || !endTime) return undefined;
        const start = moment(startTime);
        const end = moment(endTime);
        if (!start.isValid() || !end.isValid()) return undefined;
        return Math.max(0, end.diff(start, 'minutes'));
    };

    return {
        ...data,
        eventTime: formatDateTime(data.eventTime),
        clearTime: formatDateTime(data.clearTime),
        businessEffectedStartTime: formatDateTime(data.businessEffectedStartTime),
        businessRecoveryTime: formatDateTime(data.businessRecoveryTime),
        eventDate: formatDate(data.eventDate),
        
        // 计算故障持续时间（分钟）
        faultDurationMinutes: data.faultDurationMinutes || formatDuration(data.eventTime, data.clearTime),
        
        // 计算业务影响持续时间（分钟）
        businessEffectedDurationMinutes: data.businessEffectedDurationMinutes || formatDuration(data.businessEffectedStartTime, data.businessRecoveryTime),
        
        // 确保数值类型字段正确
        provinceId: data.provinceId ? Number(data.provinceId) : undefined,
        regionId: data.regionId ? Number(data.regionId) : undefined,
        faultLevel: data.faultLevel ? String(data.faultLevel) : undefined,
        networkLayer: data.networkLayer ? String(data.networkLayer) : undefined,
        rootCauseProfession: data.rootCauseProfession ? String(data.rootCauseProfession) : undefined,
        faultCauseType1: data.faultCauseType1 ? String(data.faultCauseType1) : undefined,
        faultCauseType2: data.faultCauseType2 ? String(data.faultCauseType2) : undefined,
        effectProfession: data.effectProfession ? String(data.effectProfession) : undefined,
        
        // 布尔值字段处理（使用硬编码数字，保持数字类型）
        haveMalfunction: data.haveMalfunction !== undefined ? Number(data.haveMalfunction) : undefined,
        hasRestored: data.hasRestored !== undefined ? Number(data.hasRestored) : undefined,
        isEffectBusiness: data.isEffectBusiness !== undefined ? Number(data.isEffectBusiness) : undefined,
        havePublicSentiment: data.havePublicSentiment !== undefined ? Number(data.havePublicSentiment) : undefined,
        causedByHidden: data.causedByHidden !== undefined ? Number(data.causedByHidden) : undefined,
    };
};


// 智能字段映射 - 直接使用相同字段名
export const smartMapFields = (sourceData: any) => {
    if (!sourceData) return {};
    
    const mapped: any = {};
    
    // 需要转换为moment对象的日期字段
    const dateFields = [
        'eventTime', 
        'clearTime', 
        'businessEffectedStartTime', 
        'businessRecoveryTime', 
        'eventDate',
        'sheetCreateTime',
        'createTime',
        'updateTime'
    ];
    
    // 直接映射所有字段，保持字段名一致
    Object.keys(sourceData).forEach(key => {
        if (sourceData[key] !== undefined) {
            // 如果是日期字段，转换为moment对象
            if (dateFields.includes(key) && sourceData[key]) {
                const dateObj = moment(sourceData[key]);
                mapped[key] = dateObj.isValid() ? dateObj : undefined;
            } else if (key === 'networkLayer' || key === 'faultLevel' || 
                       key === 'faultCauseType1' || key === 'faultCauseType2' || key === 'effectProfession') {
                // 这些字段使用 item.key，转为字符串类型
                mapped[key] = String(sourceData[key]);
            } else if (key === 'rootCauseProfession') {
                // rootCauseProfession 转为字符串类型（与 formatFaultRecordData 一致）
                mapped[key] = String(sourceData[key]);
            } else if (key === 'cloudPoolType' || key === 'cloudType' || key === 'dhDeviceType') {
                // 这些字段使用 +item.key，明确需要数字类型
                mapped[key] = Number(sourceData[key]);
            } else if (key === 'haveMalfunction' || key === 'hasRestored' || 
                       key === 'isEffectBusiness' || key === 'havePublicSentiment' || 
                       key === 'causedByHidden') {
                // 这些字段使用硬编码数字，需要数字类型
                mapped[key] = Number(sourceData[key]);
            } else if (key === 'provinceId' || key === 'regionId') {
                // 省份地市ID转为数字类型（表单使用 +city.zoneId，期望数字）
                mapped[key] = Number(sourceData[key]);
            } else {
                mapped[key] = sourceData[key];
            }
        }
    });
    
    // 工单编号映射：sheetNo -> associatedSheetNo
    if (sourceData.sheetNo) {
        mapped.associatedSheetNo = sourceData.sheetNo;
    }
    
    // 云池类型映射：cloudType -> cloudPoolType
    if (sourceData.cloudType !== undefined) {
        mapped.cloudPoolType = sourceData.cloudType;
    }
    
    // 专业类型名称映射：professionalTypeName -> effectProfession
    if (sourceData.professionalTypeName) {
        mapped.effectProfession = sourceData.professionalTypeName;
    }
    
    // 故障发生日期自动填充：从故障发生时间中提取日期部分
    if (sourceData.eventTime && !mapped.eventDate) {
        const eventTimeMoment = moment(sourceData.eventTime);
        if (eventTimeMoment.isValid()) {
            mapped.eventDate = eventTimeMoment.clone().startOf('day');
        }
    }
    
    return mapped;
};

// 格式化编辑页面数据（适配响应体数据）
export const formatEditData = (data: any) => {
    if (!data) return {};
    
    // 使用智能映射函数，自动处理日期字段转换
    return smartMapFields(data);
};

// 过滤掉值为 undefined 的字段
export const filterUndefinedValues = (obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const filtered: any = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            filtered[key] = obj[key];
        }
    });
    
    return filtered;
};

// 格式化表单数据用于提交
export const formatSubmitData = (formData: any) => {
    const formatted = formatFaultRecordData(formData);
    return filterUndefinedValues(formatted);
};
