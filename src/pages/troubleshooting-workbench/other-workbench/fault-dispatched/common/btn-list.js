import { windowTypeEnum } from './enums';

const dutyBtnList = [
    {
        value: 'vertical',
        label: '垂直显示',
    },
    {
        value: 'horizontal',
        label: '水平显示',
    },
    {
        value: 'flowlayout',
        label: '平铺显示',
    },
    {
        value: 'fullscreen',
        label: '全屏显示',
    },
];

const customBtnList = [
    {
        value: 'vertical',
        label: '垂直显示',
    },
    {
        value: 'horizontal',
        label: '水平显示',
    },
    {
        value: 'flowlayout',
        label: '平铺显示',
    },
    {
        value: 'fullscreen',
        label: '全屏显示',
    },
    {
        value: 'customView',
        label: '自定义展示视图',
    },
];
const getBtnList = (type) => {
    switch (type) {
        case windowTypeEnum.DUTY:
            return dutyBtnList;
        case windowTypeEnum.CUSTOM:
            return customBtnList;
        default:
            return dutyBtnList;
    }
};

export default getBtnList;
