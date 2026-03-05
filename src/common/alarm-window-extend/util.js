export const provinceEnum = [
    {
        name: '北京市',
        value: 'BJ',
    },
    {
        name: '天津市',
        value: 'TJ',
    },
    {
        name: '河北省',
        value: 'HE',
    },
    {
        name: '山西省',
        value: 'SX',
    },
    {
        name: '内蒙古自治区',
        value: 'NMG',
    },
    {
        name: '辽宁省',
        value: 'LN',
    },
    {
        name: '吉林省',
        value: 'JL',
    },
    {
        name: '黑龙江省',
        value: 'HL',
    },
    {
        name: '上海市',
        value: 'SH',
    },
    {
        name: '江苏省',
        value: 'JS',
    },
    {
        name: '浙江省',
        value: 'ZJ',
    },
    {
        name: '安徽省',
        value: 'AH',
    },
    {
        name: '福建省',
        value: 'FJ',
    },
    {
        name: '江西省',
        value: 'JX',
    },
    {
        name: '山东省',
        value: 'SD',
    },
    {
        name: '河南省',
        value: 'HA',
    },
    {
        name: '湖北省',
        value: 'HB',
    },
    {
        name: '湖南省',
        value: 'HN',
    },
    {
        name: '广东省',
        value: 'GD',
    },
    {
        name: '广西壮族自治区',
        value: 'GX',
    },
    {
        name: '海南省',
        value: 'HI',
    },
    {
        name: '重庆市',
        value: 'CQ',
    },
    {
        name: '四川省',
        value: 'SC',
    },
    {
        name: '贵州省',
        value: 'GZ',
    },
    {
        name: '云南省',
        value: 'YN',
    },
    {
        name: '西藏自治区',
        value: 'HB',
    },
    {
        name: '陕西省',
        value: 'SN',
    },
    {
        name: '甘肃省',
        value: 'GS',
    },
    {
        name: '青海省',
        value: 'QH',
    },
    {
        name: '宁夏回族自治区',
        value: 'NX',
    },
    {
        name: '新疆维吾尔自治区',
        value: 'XJ',
    },
    {
        name: '台湾省',
        value: 'TW',
    },
];
export const getAbbrProv = (val) => {
    const sel = provinceEnum.find((e) => e.name === val);
    return sel?.value;
};
