import moment from 'moment';
import { FormatValueEnumFn, FormatOptionFn, ConvertParamsFileDataFn, ConvertFileDataFn, DisabledDateFn, DisabledTimeFn } from './type';
/**
 * 枚举格式化为 proTable 所需的 valueEnum 形式
 * @param enumData 枚举原始数据 {array}
 * @parma field 需要过滤保留的字段key值 {number[]}
 */

export const formatValueEnum: FormatValueEnumFn = (enumData, field) => {
    const obj = {};
    enumData?.forEach((item) => {
        const key = Number(item.key) || Number(item.value) || 0;
        // 只输出指定字段
        if (field) {
            if (field.some((value) => value === key)) {
                obj[key] = {
                    text: item?.label || item.value,
                };
            }
        } else {
            // 输出全部字段
            obj[key] = {
                text: item?.label || item.value,
            };
            obj[String(key)] = {
                text: item?.label || item.value,
            };
        }
    });
    return obj;
};

/**
 * 枚举格式化为 select 所需的 option 形式
 * @param enumData 枚举原始数据 {array}
 * @parma field 需要过滤保留的字段key值 {number[]}
 */
export const formatOption: FormatOptionFn = (enumData, field) => {
    const options: any = [];
    enumData?.forEach((item) => {
        if (typeof item === 'object') {
            const key = Number(item.key) || Number(item.value) || 0;
            // 只输出指定字段
            if (field) {
                if (field.some((value) => value === key)) {
                    options.push({
                        label: item.label || item.value,
                        value: key,
                    });
                }
            } else {
                // 输出全部字段
                options.push({
                    label: item.label || item.value,
                    value: key,
                });
            }
        } else {
            options.push({
                label: item,
                value: item,
            });
        }
    });
    return options;
};

// 框架省份切换
export const getInitialProvince = (province, userInfo) => {
    const info = userInfo && JSON.parse(userInfo);
    let initialProvince = info.zones[0]?.zoneId;
    if (province) {
        initialProvince = province;
        return initialProvince;
    }
    if (info.zones[0]?.zoneLevel === '3') {
        initialProvince = info.zones[0]?.parentZoneId;
    }
    return initialProvince;
};

// 上传时参数转换
export const convertParamsFileData: ConvertParamsFileDataFn = (fileList) => {
    // 先过滤上传完成的文件列表
    const successFileList = fileList.filter((file) => file.status === 'done');
    const data = successFileList.map((item) => {
        return item.response || item.id;
    });
    return data.toString();
};

// 反显时文件参数转换
export const convertFileData: ConvertFileDataFn = (list) => {
    return (
        list?.map((item) => {
            return {
                url: item.annexPath,
                name: item.annexName,
                id: item.id,
                status: 'done', // 必须要加不然不会显示下载按钮
            };
        }) || []
    );
};

// 时间区间限制日期
export const disabledDate: DisabledDateFn = (current, start?, end?) => {
    if (start) {
        // 开始时间
        return current && current < moment(start).startOf('day');
    }
    if (end) {
        // 结束时间
        return current && current > moment(end).endOf('day');
    }
    return false;
};

const range = (start: number, end: number) => {
    const result: number[] = [];
    for (let i = start; i < end; i += 1) {
        result.push(i);
    }
    return result;
};
export const fomartDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};
//  时间区间限制时间
export const disabledTime: DisabledTimeFn = (current, start?, end?) => {
    const currentDay = moment(current).format('YYYY-MM-DD');
    const startDay = start ? moment(start).format('YYYY-MM-DD') : null;
    const endDay = end ? moment(end).format('YYYY-MM-DD') : null;
    const currentHour = moment(current).hours();
    const currentMinute = moment(current).minutes();
    const currentSecond = moment(current).seconds();
    if (start && currentDay === startDay) {
        const hours = moment(start).hours();
        const seconds = moment(start).seconds();
        const minutes = moment(start).minutes();
        return {
            disabledHours: () => range(0, hours),
            disabledMinutes: () => (currentHour > hours ? [] : range(0, minutes)),
            disabledSeconds: () => (currentMinute > minutes || currentHour > hours ? [] : range(0, seconds)),
        };
    }
    if (end && currentDay === endDay) {
        const hours = moment(end).hours();
        const seconds = moment(end).seconds();
        const minutes = moment(end).minutes();

        return {
            disabledHours: () => range(hours + 1, 24),
            disabledMinutes: () => (currentHour < hours ? [] : range(minutes + 1, 60)),
            disabledSeconds: () => (currentMinute < minutes || currentHour < hours ? [] : range(seconds + 1, 60)),
        };
    }

    return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
    };
};
