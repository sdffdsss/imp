import { message } from 'oss-ui';

export const roleSource = [
    {
        id: 'day',
        name: 'A角（白班）',
    },
    {
        id: 'night',
        name: 'A角（夜班）',
    },
    {
        id: 'agent',
        name: 'B角',
    },
    {
        id: 'copy',
        name: '中心主任',
    },
    {
        id: 'child',
        name: '主管领导',
    },
    {
        id: 'daiweiMan',
        name: '代维人员',
    },
    {
        id: 'daiweiSche',
        name: '代维调度中心',
    },
    {
        id: 'sms',
        name: '代维领导',
    },
    {
        id: 'key',
        name: '省分专业牵头人',
    },
    {
        id: 'audit',
        name: '工单审核人',
    },
    {
        id: 'cityDirector',
        name: '区县主管',
    },
    {
        id: 'regionSupport',
        name: '地市-专业支撑',
    },
    {
        id: 'regionManagement',
        name: '地市-专业管理',
    },
    {
        id: 'regionDeptLeader',
        name: '地市-部门领导',
    },
    {
        id: 'regionCompLeader',
        name: '地市-公司领导',
    },
    {
        id: 'provinceSupport',
        name: '省分-专业支撑',
    },
    {
        id: 'provinceManagement',
        name: '省分-专业管理',
    },
    {
        id: 'provinceDeptLeader',
        name: '省分-部门领导',
    },
    {
        id: 'provinceCompLeader',
        name: '省分-公司领导',
    },
    {
        id: 'duty',
        name: '监控值班员',
    },
    {
        id: 'dutyLeader',
        name: '监控值班长',
    },
    {
        id: 'dutySupport',
        name: '监控支撑',
    },
    {
        id: 'dutyManagement',
        name: '监控专业主管',
    },
    {
        id: 'groupLeader',
        name: '集团领导',
    },
];

export const mockData = [
    {
        id: 1,
        oldUserId: 1,
        name: '张三',
        phone: '18855726549',
    },
    {
        id: 2,
        oldUserId: 2,
        name: '李四',
        phone: '18855726549',
    },
    {
        id: 3,
        oldUserId: 3,
        name: '王五',
        phone: '18855726549',
    },
    {
        id: 4,
        oldUserId: 4,
        name: '赵云',
        phone: '18855726549',
    },
    {
        id: 5,
        oldUserId: 5,
        name: '刘华',
        phone: '18855726549',
    },
    {
        id: 6,
        oldUserId: 6,
        name: '沈飞',
        phone: '18855726549',
    },
    {
        id: 7,
        oldUserId: 7,
        name: '张三1',
        phone: '18855726549',
    },
    {
        id: 8,
        oldUserId: 8,
        name: '李四2',
        phone: '18855726549',
    },
    {
        id: 9,
        oldUserId: 9,
        name: '王五3',
        phone: '18855726549',
    },
    {
        id: 10,
        oldUserId: 10,
        name: '赵云4',
        phone: '18855726549',
    },
    {
        id: 11,
        oldUserId: 11,
        name: '刘华5',
        phone: '18855726549',
    },
    {
        id: 12,
        oldUserId: 12,
        name: '沈飞6',
        phone: '18855726549',
    },
];

// const obj = {};

const userTypeRules = {};

roleSource.map((item) => {
    userTypeRules[item.id] = item.name;
    return userTypeRules;
});

const strRules = {
    // oldUserId: "待修改人员id不完善",
    oldUserName: '请选择待修改人员',
    // oldMobilePhone: "待修改人员手机号为完善",
    scopes: '请选择交接的维护范围',
    // newDeptId: "该替换的人员部门id不完善",
    // newDeptName: "该替换的人员部门名称不完善",
    // newUserId: "替换人id不完善",
    newUserName: '请选择替换人',
    // newMobilePhone: "替换人手机号不完善",
};

// roleSource.map((item) => {
//     obj[item.id] = {
//         id: item.id,
//         name: item.name,
//         values: {
//             userType: item.id,
//             oldUserId: null,
//             oldUserName: null,
//             oldMobilePhone: null,
//             scopes: null,
//             newDeptId: null,
//             newDeptName: null,
//             newUserId: null,
//             newUserName: null,
//             newMobilePhone: null,
//         },
//     };
//     return obj;
// });

// export const defaultData = obj;

const checkVlaues = (value = []) => {
    let isOk = true;
    const newValue = [];
    // 去掉未选择的
    value.map((item) => {
        let userType;
        let flag = false;
        Object.keys(item).map((itm) => {
            userType = item.userType;
            const newItem = JSON.parse(JSON.stringify({ ...item, userType: null }));
            if (newItem[itm] !== null) {
                flag = true;
            }
            return flag;
        });
        if (flag) {
            return newValue.push({
                ...item,
                userType,
                scopes: item.scopes === null ? '全部' : item.scopes,
                newUserName: item.newUserName === '-' ? '' : item.newUserName,
                oldUserName: item.oldUserName === '-' ? '' : item.oldUserName,
            });
        }
    });

    console.log(newValue);

    // 判断数据是否完善
    newValue.map((item) => {
        Object.keys(strRules).map((itm) => {
            if (item[itm] === null) {
                isOk = false;
                return message.warn(`${userTypeRules[item.userType]}:${strRules[itm]}`);
            }
        });
    });
    if (newValue.length === 0) {
        message.warn('请完善数据');
        return;
    }
    if (!isOk || newValue.length === 0) {
        return false;
    }
    return newValue;
};

export const defineParams = (params) => {
    const newParams = JSON.parse(JSON.stringify(params));
    const arr = [];
    if (typeof params?.updateUsers === 'object') {
        Object.keys(params.updateUsers).map((key) => {
            return arr.push(params.updateUsers[key].values);
        });
    }
    if (!checkVlaues(arr)) {
        return false;
    }
    newParams.updateUsers = checkVlaues(arr);
    return newParams;
};
