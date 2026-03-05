/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { _ } from 'oss-web-toolkits';
import { Select, Input, Form } from 'oss-ui';
import { customAlphabet } from 'nanoid';
import { EditableProTable } from '@ant-design/pro-table';
import useLoginInfoModel from '@Src/hox';
import request from '@Common/api';
import BraftMode from './braft-mode';
import api from './api';
import { isType } from './utils';
import './index.less';
import ValueByMapBox from './value-by-map-box';

// const { Option } = Select;
const { TextArea } = Input;

let noMapType = [];
let fieldTypeEnum = {};
// const valueMapData = [
//     {
//         label: 'A角',
//         value: 'A角_role_id',
//         name: 'A角_role_name',
//         deptName: 'A角_role_dept_name',
//         deptId: 'A角_role_dept_id',
//         tel: 'A角_role_tel',
//         deptorman: 'A角_role_deptorman',
//     },
//     {
//         label: 'B角',
//         value: 'B角_role_id',
//         name: 'B角_role_name',
//         deptName: 'B角_role_dept_name',
//         deptId: 'B角_role_dept_id',
//         tel: 'B角_role_tel',
//         deptorman: 'B角_role_deptorman',
//     },
//     {
//         label: '中心主任',
//         value: '中心主任_role_id',
//         name: '中心主任_role_name',
//         deptName: '中心主任_role_dept_name',
//         deptId: '中心主任_role_dept_id',
//         tel: '中心主任_role_tel',
//         deptorman: '中心主任_role_deptorman',
//     },
//     {
//         label: '代维领导',
//         value: '代维领导_role_id',
//         name: '代维领导_role_name',
//         deptName: '代维领导_role_dept_name',
//         deptId: '代维领导_role_dept_id',
//         tel: '代维领导_role_tel',
//         deptorman: '代维领导_role_deptorman',
//     },
//     {
//         label: '主管领导',
//         value: '主管领导_role_id',
//         name: '主管领导_role_name',
//         deptName: '主管领导_role_dept_name',
//         deptId: '主管领导_role_dept_id',
//         tel: '主管领导_role_tel',
//         deptorman: '主管领导_role_deptorman',
//     },
//     {
//         label: '工单审核人',
//         value: '工单审核人_role_id',
//         name: '工单审核人_role_name',
//         deptName: '工单审核人_role_dept_name',
//         deptId: '工单审核人_role_dept_id',
//         tel: '工单审核人_role_tel',
//         deptorman: '工单审核人_role_deptorman',
//     },
//     {
//         label: '代维人员',
//         value: '代维人员_role_id',
//         name: '代维人员_role_name',
//         deptName: '代维人员_role_dept_name',
//         deptId: '代维人员_role_dept_id',
//         tel: '代维人员_role_tel',
//         deptorman: '代维人员_role_deptorman',
//     },
//     {
//         label: '代维调度中心',
//         value: '代维调度中心_role_id',
//         name: '代维调度中心_role_name',
//         deptName: '代维调度中心_role_dept_name',
//         deptId: '代维调度中心_role_dept_id',
//         tel: '代维调度中心_role_tel',
//         deptorman: '代维调度中心_role_deptorman',
//     },
//     {
//         label: '省份专业牵头人',
//         value: '省份专业牵头人_role_id',
//         name: '省份专业牵头人_role_name',
//         deptName: '省份专业牵头人_role_dept_name',
//         deptId: '省份专业牵头人_role_dept_id',
//         tel: '省份专业牵头人_role_tel',
//         deptorman: '省份专业牵头人_role_deptorman',
//     },
// ];

const mapClassData = [
    {
        label: '内容拼接',
        value: 'JoinMap',
    },
    { label: '告警字段选择', value: 'NoMap' },
    // EnumMap: {
    //     text: 'EnumMap',
    //     status: 'EnumMap'
    // },
    {
        label: '受理人选择',
        value: 'ValueByMap',
    },
    {
        label: '字典值',
        value: 'FixMap',
    },
    {
        label: '枚举值',
        value: 'MutiFixMap',
    },
];
const noValue = '无';
const specialData = {
    agentManId: {
        agentMan: { key: 'name', value: '' },
        agentDeptName: { key: 'deptName', value: '' },
        agentDeptCode: { key: 'deptId', value: '' },
        agentDeptOrMan: { key: 'deptorman', value: '' },
    },
    acceptManId: {
        acceptMan: { key: 'name', value: '' },
        acceptDeptName: { key: 'deptName', value: '' },
        acceptDeptCode: { key: 'deptId', value: '' },
    },
    copyManIdChild: {
        copyManChild: { key: 'name', value: '' },
        copyDeptNameChild: { key: 'deptName', value: '' },
        copyDeptCodeChild: { key: 'deptId', value: '' },
    },
    copyManId: {
        copyMan: { key: 'name', value: '' },
        copyDeptName: { key: 'deptName', value: '' },
        copyDeptCode: { key: 'deptId', value: '' },
        copyDeptOrMan: { key: 'deptorman', value: '' },
    },
    smsToUserId: {
        smsToUserName: { key: 'name', value: '' },
        smsToUserPhone: { key: 'tel', value: '' },
        smsDeptOrMan: { key: 'deptorman', value: '' },
        smsToDeptId: { key: 'deptId', value: '' },
        smsToDeptName: { key: 'deptName', value: '' },
    },
};
const specialDataField = [
    'agentMan',
    'agentDeptName',
    'agentDeptCode',
    'acceptMan',
    'acceptDeptName',
    'acceptDeptCode',
    'copyManChild',
    'copyDeptNameChild',
    'copyDeptCodeChild',
    'smsToUserName',
    'smsToUserPhone',
    'agentDeptOrMan',
    'copyDeptOrMan',
    'smsDeptOrMan',
    'copyMan',
    'copyDeptName',
    'copyDeptCode',
    'copyDeptOrMan',
    'smsToDeptId',
    'smsToDeptName',
];
const mapDataChange = (data, field) => {
    const { mapData, mapClass } = data[field.id];
    const isArray = isType('Array');
    const isObject = isType('Object');
    let mapStr = '';

    if (!mapData) {
        return '';
    }
    switch (mapClass) {
        case 'ValueByMap' || 'NoMap':
            if (isArray(mapData)) {
                mapStr = mapData.join(',');
            } else if (isObject(mapData)) {
                mapStr = [mapData?.alarmProfessional, mapData?.rootCauseSpecialty].join('|');
            } else {
                mapStr = mapData;
            }
            // mapStr = Array.isArray(mapData) ? mapData.join(',') : mapData;
            break;
        case 'JoinMap':
            mapStr = _.replace(mapData, '\\r\\n', '\r\n');
            break;
        default:
            mapStr = mapData;
    }
    return mapStr;
};
const mapDataChangeShow = (field) => {
    const { mapData, mapClass } = field;
    let mapStr = '';

    if (!mapData) {
        return [];
    }

    // 加工默认数据
    switch (mapClass) {
        case 'ValueByMap' || 'NoMap':
            if (mapData !== noValue && mapData.split('|').length === 2) {
                mapStr = {
                    alarmProfessional: mapData.split('|')[0].split(',')[0] ? mapData.split('|')[0].split(',') : undefined,
                    rootCauseSpecialty: mapData.split('|')[1].split(',')[0] ? mapData.split('|')[1].split(',') : undefined,
                };
            } else if (mapData !== noValue && mapData.split('|').length === 1) {
                mapStr = mapData.split(',');
            } else {
                mapStr = undefined;
            }
            break;
        case 'JoinMap':
            mapStr = _.replace(mapData, '\r\n', '\\r\\n');
            break;
        case 'MutiFixMap':
            mapStr = mapData.split(',');
            break;
        default:
            mapStr = mapData;
    }
    return mapStr;
};
const FixSelect = ({ value, onChange, fieldName, moduleId }) => {
    const { userProvinceId } = useLoginInfoModel();
    const [fixMapData, setFixMapData] = useState([]);
    const getDictByFieldName = async (value) => {
        const moduleList = [604, 605];
        const res = await request(`alarmmodel/filter/v1/filter/getDictByFieldName`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                fieldName: value,
                provinceId: userProvinceId,
                moduleId: moduleList.includes(moduleId) ? moduleId : 1,
            },
        });
        if (res && res.data) {
            let list = res.data.map((item) => {
                return {
                    label: item.value,
                    value: `${item.key}`,
                    name: item.value,
                    deptName: item.value,
                    deptId: item.value,
                    tel: item.value,
                    deptorman: item.value,
                };
            });
            setFixMapData(list);
        }
    };
    const fixSelectChange = (value) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onChange && onChange(value);
    };
    useEffect(() => {
        getDictByFieldName(fieldName);
    }, []);
    return <Select value={value} onChange={fixSelectChange} howSearch optionFilterProp={'label'} options={fixMapData} />;
};
// const editForm = Form.useForm();
const SingleContent = forwardRef((props, ref) => {
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [editableKeys, setEditableKeys] = useState([]);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [detailsRow, setDetailsRow] = useState({});
    const [braftValue, setBraftValue] = useState(null);
    const [dataAllList, setDataAllList] = useState([]);
    const [MutiFixMap, setMutiFixMap] = useState([]);
    const [threeSpecialized, setThreeSpecialized] = useState(1);
    const [valueMapData, setValueMapData] = useState([]);

    const [editForm] = Form.useForm();
    const { userProvinceId } = useLoginInfoModel();

    // const [noModifyList, setNoModifyList] = useState([]);
    const getThreeSpecialized = (newThreeSpecialized) => {
        const dataMaps = editForm.getFieldsValue();
        const filterDataSource = dataSource.filter((item) => Object.keys(dataMaps).includes(item.id));
        const objectKeys = filterDataSource
            .map((item) => (item.fieldName === 'agentManId' || item.fieldName === 'copyManId' || item.fieldName === 'smsToUserId' ? item.id : ''))
            .filter((item) => item !== '');

        if (newThreeSpecialized === 0) {
            editForm.setFieldsValue({
                [objectKeys[0]]: { ...objectKeys[0], mapData: {} },
                [objectKeys[1]]: { ...objectKeys[1], mapData: {} },
                [objectKeys[2]]: { ...objectKeys[2], mapData: {} },
            });
        } else if (newThreeSpecialized === 1) {
            editForm.setFieldsValue({
                [objectKeys[0]]: { ...objectKeys[0], mapData: [] },
                [objectKeys[1]]: { ...objectKeys[1], mapData: [] },
                [objectKeys[2]]: { ...objectKeys[2], mapData: [] },
            });
        }
        setThreeSpecialized(newThreeSpecialized);
    };
    const field = () => {
        // const { dataAllList, dataSource } = this.state;
        let field = {
            id: `${new Date().getTime()}`,
        };
        const filteredList = dataAllList.filter((item) => !dataSource.some((source) => source.fieldName === item.value));
        if (filteredList.length) {
            field = {
                ...field,
                ...filteredList[0].field,
            };
        } else {
            field = {
                ...field,
                fieldName: '',
                fieldLenth: '',
                fieldType: 'String',
                mapClass: 'JionMap',
                mapField: '',
            };
        }
        editForm.setFieldsValue({
            [field.id]: {
                field,
            },
        });
        return field;
    };
    const onClickMapField = (row) => {
        setDetailsRow({});
        setDetailsVisible(true);
        setBraftValue({ ...row?.record, id: row.recordKey });
    };
    const editSelectField = (entry, value) => {
        console.log(entry);
        // const { dataSource, fieldData } = this.state;
        const obj = dataAllList.find((item) => item.value === value);

        editForm.setFieldsValue({
            [entry.id]: {
                ...obj.field,
                mapData: obj?.field?.mapData === noValue ? undefined : obj?.field?.mapData,
            },
        });
        // getDictByFieldName(value)
    };
    const mapClassChange = (entry, value) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define

        editForm.setFieldsValue({
            [entry.id]: {
                mapData: value === 'JoinMap' ? '' : undefined,
            },
        });
    };

    const getColumns = () => {
        const { moduleId } = props;
        // const { dataAllList } = this.state;
        const columns = [
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: '此项是必填项',
                        },
                    ],
                },
                render: (text, row) => {
                    return row.fieldCnName;
                },
                renderFormItem: ({ entry }) => {
                    // console.log(form.getFieldValue(entry.id));
                    const formFields = editForm.getFieldsValue();
                    const otherSource = dataSource.filter((item) => item.id !== entry.id).map((item) => item.id);
                    const disabledKeys = otherSource.map((item) => formFields[item]?.fieldName);
                    const options = dataAllList.map((item) => {
                        return {
                            ...item,
                            disabled: disabledKeys.includes(item.value),
                        };
                    });
                    return (
                        <Select
                            disabled={entry.editTable}
                            onChange={editSelectField.bind(this, entry)}
                            options={options}
                            showSearch
                            optionFilterProp={'label'}
                        >
                            {/* {options.map((item) => (
                                <Option value={item.value} key={item.value} label={item.label} disabled={}>
                                    {item.label}
                                </Option>
                            ))} */}
                        </Select>
                    );
                },
            },
            {
                title: '字段长度',
                dataIndex: 'fieldLenth',
                valueType: 'second',
                render: (_, record) => {
                    return record.fieldLenth;
                },
            },
            {
                title: '字段类型',
                key: 'fieldType',
                dataIndex: 'fieldType',
                valueType: 'select',
                valueEnum: fieldTypeEnum,
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: '此项是必填项',
                        },
                    ],
                },
            },
            {
                title: '数据类型',
                key: 'mapClass',
                dataIndex: 'mapClass',
                valueType: 'select',

                formItemProps: {
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: '此项是必填项',
                        },
                    ],
                },
                renderFormItem: ({ entry }) => {
                    return <Select showSearch optionFilterProp={'label'} options={mapClassData} onChange={mapClassChange.bind(this, entry)} />;
                },
            },
            {
                title: '数据内容',
                dataIndex: 'mapData',
                width: 480,
                render: (_, row) => {
                    if (Array.isArray(row?.mapData)) {
                        return row.mapData.toString();
                    }
                    return row.mapData;
                },
                renderFormItem: (text, row) => {
                    // 是否为主送人，抄送人，短信发送人
                    const fieldNameCondition =
                        row.record.fieldName === 'agentManId' || row.record.fieldName === 'copyManId' || row.record.fieldName === 'smsToUserId';

                    if (row.record?.mapClass === 'JoinMap') {
                        return <TextArea rows={3} value={row.record.mapField} onClick={onClickMapField.bind(this, row)} allowClear />;
                    }
                    if (row.record?.mapClass === 'ValueByMap' && threeSpecialized === 0 && fieldNameCondition) {
                        return <ValueByMapBox showSearch optionFilterProp="label" mode="multiple" options={valueMapData} />;
                    }
                    if (row.record?.mapClass === 'ValueByMap') {
                        return (
                            <Select defaultValue={row.record.mapField} showSearch optionFilterProp="label" mode="multiple" options={valueMapData} />
                        );
                    }
                    if (row.record?.mapClass === 'FixMap') {
                        return <FixSelect fieldName={row.record.fieldName} moduleId={moduleId} />;
                    }

                    if (row.record?.mapClass === 'MutiFixMap') {
                        return <Select showSearch mode="multiple" options={MutiFixMap} />;
                    }
                    return <Select showSearch optionFilterProp={'label'} mode="multiple" options={noMapType} />;
                },
            },
            {
                title: '操作',
                valueType: 'option',
                width: 120,
                hideInTable: props.disabled,
                render: () => {
                    return null;
                },
            },
        ];
        setColumns(columns);
    };

    /** *
     *获取字段类型
     */
    const getAlarmFieldType = async () => {
        // const { columns } = this.state;
        const res = await request(`alarmmodel/field/v1/baseDataTypes?modelId=2`, {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
        });
        if (res.data) {
            // let fieldTypeEnum = {};
            res.data.forEach((item) => {
                fieldTypeEnum = {
                    ...fieldTypeEnum,
                    [item.dataTypeName]: {
                        text: item.dataTypeName,
                        status: item.dataTypeName,
                    },
                };
            });
        }
    };
    useEffect(() => {
        getAlarmFieldType();
        getColumns();
    }, []);
    useEffect(() => {
        getColumns();
    }, [dataAllList, dataSource, fieldTypeEnum, valueMapData, threeSpecialized]);

    useEffect(() => {
        api.getRolesDictionary().then((res) => {
            if (res && res.data) {
                setValueMapData(
                    res.data.map((item) => ({
                        label: item.dName,
                        value: `${item.dName}_role_id`,
                        name: `${item.dName}_role_name`,
                        deptName: `${item.dName}_role_dept_name`,
                        deptId: `${item.dName}_role_dept_id`,
                        tel: `${item.dName}_role_tel`,
                        deptorman: `${item.dName}_role_deptorman`,
                    })),
                );
            }
        });
    }, []);

    const getEnumOptionsData = async (fieldName) => {
        const params = { fieldName };
        const res = await api.getEnumOptions(params);
        if (res && res.data) {
            const data = res.data.map((item) => ({
                label: item,
                value: item,
            }));

            setMutiFixMap(data);
        }
    };
    useEffect(() => {
        // 暂时，只获取网内网间系统故障
        getEnumOptionsData('wnwjType');
    }, []);
    const getField = async (fieldNames, dataSource) => {
        const moduleIdEnum = [604, 605];

        const { moduleId } = props;

        const data = {
            fieldCnName: '',
            fieldNames,
            modelName: 'newAlarm',
            modelId: moduleIdEnum.includes(moduleId) ? moduleId : 1,
            // modelId: 1,
        };
        if (!fieldNames) {
            return;
        }
        const res = await request(`alarmmodel/filter/v1/filter/popFieldName`, {
            type: 'get',
            baseUrlType: 'singleContentUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data,
        });
        if (res.data) {
            Object.keys(specialData).forEach((item) => {
                if (specialData[item]) {
                    Object.keys(specialData[item]).forEach((items) => {
                        const keysValue = res.data.find((itemss) => itemss.fieldName === items) || {};
                        specialData[item] = {
                            ...specialData[item],
                            [items]: { ...specialData[item][items], value: keysValue },
                        };
                    });
                }
            });
            const list = res.data
                .filter((item) => (item.isModify && item.isModify === 2) || item.fieldName === 'copyManId' || item.fieldName === 'smsToUserId')
                .map((item) => {
                    return {
                        value: item.fieldName,
                        label: item.fieldCnName,
                        field: item,
                    };
                });
            // const noModifyList = res.data;
            const otherlist = dataSource.map((item) => {
                return {
                    label: item.fieldCnName,
                    value: item.fieldName,
                    field: _.omit(item, ['id', 'editTable']),
                };
            });
            setDataAllList([...list, ...otherlist]);
            // setNoModifyList(res.data);
        }
    };
    /** *
     *获取字段类型
     */
    const getNoMapType = async (params) => {
        const res = await request(`/alarmmodel/filter/v1/filter/popAlarmName`, {
            type: 'get',
            baseUrlType: 'singleContentUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            params,
        });
        if (res.data) {
            noMapType = res.data
                .filter((item) => item.msgField)
                .map((item) => {
                    return {
                        value: item.msgField,
                        label: item.colNameZh,
                    };
                });
            // getColumns();
        }
    };
    /** *
     *新增默认数据
     */
    const addWorksheet = async () => {
        const { modelType, singleContentdata, moduleId } = props;
        // const editableKeys = [];
        // const dataSource = [];
        let fieldNames = '';
        const moduleList = [604, 605];
        const nanoid = customAlphabet('1234567890', 15);
        if (modelType === 'new') {
            const params = {
                modelName: 'newAlarm',
                modelId: moduleList.includes(moduleId) ? moduleId : 1,
                conditions: {
                    province_id: userProvinceId,
                },
            };
            const defaultDataSource = await api.addWorksheet(params);
            // fieldNames = defaultDataSource.map((item) => item.fieldName);

            let thisDataSource = defaultDataSource
                .filter((item) => item.isModify && item.isModify === 1)
                .map((item) => {
                    const id = nanoid();
                    return {
                        ...item,
                        id,
                        editTable: true,
                        mapData: mapDataChangeShow(item),
                    };
                });
            if (moduleId !== 604) {
                thisDataSource = thisDataSource.filter((el) => el.mapDataField !== 'pivot_station_name');
            }

            fieldNames = thisDataSource && thisDataSource.length > 0 && thisDataSource.map((item) => item.fieldName).join(',');
            console.log(thisDataSource);
            setDataSource(thisDataSource);
            setEditableKeys(thisDataSource.map((item) => item.id));

            getField(fieldNames, thisDataSource);
        } else if (singleContentdata.length > 0) {
            const dataSource = singleContentdata
                .filter((item) => !specialDataField.includes(item.fieldName))
                .map((item) => {
                    const id = nanoid();
                    return {
                        ...item,
                        id,
                        editTable: true,
                        mapData: mapDataChangeShow(item),
                    };
                });

            fieldNames = dataSource && dataSource.length > 0 && dataSource.map((item) => item.fieldName).join(',');

            setDataSource(dataSource);
            setEditableKeys(dataSource.map((item) => item.id));

            getField(fieldNames, dataSource);
        }

        getNoMapType({ moduleId });
    };
    useEffect(() => {
        addWorksheet();
    }, [props.singleContentdata, props.moduleId]);
    useEffect(() => {
        props.filterTypeFlag && addWorksheet();
    }, [props.filterTypeFlag]);
    const delRow = (row) => {
        // const { dataSource, dataAllList, fieldData } = this.state;
        const delDataSource = dataSource.filter((item) => item.id !== row);

        setDataSource(delDataSource);
    };

    const detailsChange = (flag, field) => {
        if (flag) {
            editForm.setFieldsValue({
                [flag]: {
                    mapData: field,
                },
            });
        }
        setDetailsVisible(false);
        setDetailsRow({});
    };

    const editTableChange = (data) => {
        setDataSource(data);
        setEditableKeys(data.map((item) => item.id));
    };

    // const defineList = (list) => {
    //     if (!Array.isArray(list)) {
    //         return false;
    //     }
    //     const flag = { agentMan: false, copyMan: false };
    //     list.map((item) => {
    //         if (item.fieldName === 'agentManId') {
    //             flag.agentMan = true;
    //         }
    //         if (item.fieldName === 'copyManId') {
    //             flag.copyMan = true;
    //         }
    //         return flag;
    //     });
    //     return flag;
    // };

    const getSingleContentLists = () => {
        const dataMaps = editForm.getFieldsValue();
        const isArray = isType('Array');
        const isObject = isType('Object');
        const filterDataSource = dataSource.filter((item) => Object.keys(dataMaps).includes(item.id));

        let newDataSource = [];
        filterDataSource.forEach((item) => {
            // 告警专业走这里
            if (specialData[item.fieldName] && item.mapClass === 'ValueByMap' && isArray(item.mapData)) {
                const mapDataField = valueMapData.filter((current) => item.mapData && item.mapData.includes(current.value));
                const data = Object.keys(specialData[item.fieldName]).map((items) => {
                    return {
                        ...specialData[item.fieldName][items].value,
                        mapData: mapDataField.map((itemss) => itemss[specialData[item.fieldName][items]?.key]).join(',') || '',
                        fieldLenth: 200,
                    };
                });
                newDataSource = [...newDataSource, item, ...data];
                // 根因专业走这里
            } else if (specialData[item.fieldName] && item.mapClass === 'ValueByMap' && isObject(item.mapData)) {
                const mapDataFieldA = valueMapData.filter((current) => item.mapData && item.mapData.alarmProfessional?.includes(current.value));
                const mapDataFieldR = valueMapData.filter((current) => item.mapData && item.mapData.rootCauseSpecialty?.includes(current.value));
                const data = Object.keys(specialData[item.fieldName]).map((items) => {
                    const TempMapDataA = mapDataFieldA.map((itemss) => itemss[specialData[item.fieldName][items]?.key]) || [];
                    const TempMapDataB = mapDataFieldR.map((itemss) => itemss[specialData[item.fieldName][items]?.key]) || [];
                    const newMapData = [TempMapDataA, TempMapDataB].join('|') || '';
                    return {
                        ...specialData[item.fieldName][items].value,
                        mapData: newMapData,
                        fieldLenth: 200,
                    };
                });
                newDataSource = [...newDataSource, item, ...data];
            } else {
                newDataSource = [...newDataSource, item];
            }
        });
        const list = newDataSource.map((item) => {
            if (dataMaps[item.id]) {
                const field = dataAllList.find((items) => items.value === dataMaps[item.id].fieldName)?.field || {};
                item = {
                    ...field,
                    ...dataMaps[item.id],
                    mapData: mapDataChange(dataMaps, item),
                };
            }
            if (item.mapClass === 'NoMap' || item.mapClass === 'MutiFixMap' || item.mapClass === 'FixMap') {
                item = {
                    ...item,
                    mapData: Array.isArray(item.mapData) ? item.mapData.join(',') : item.mapData,
                };
            }
            return item;
        });
        return list;
    };

    useImperativeHandle(ref, () => ({
        getSingleContentLists,
        getThreeSpecialized,
    }));

    return (
        <>
            <EditableProTable
                className="editable-proTabl-div"
                columns={columns}
                rowKey="id"
                scroll={{ y: 'calc(100% - 65px)' }}
                value={dataSource}
                onChange={editTableChange}
                recordCreatorProps={
                    props.disabled
                        ? false
                        : {
                              newRecordType: 'dataSource',
                              record: () => field(),
                          }
                }
                editable={{
                    type: 'multiple',
                    editableKeys,
                    form: editForm,

                    actionRender: (row, config, defaultDoms) => {
                        if (row.isModify === 1 || row.isModify === '1') {
                            return [];
                        } else {
                            return [defaultDoms.delete];
                        }
                    },
                    onValuesChange: (record, recordList) => {
                        editTableChange(recordList);
                    },
                    onDelete: (row) => {
                        delRow(row);
                    },
                }}
            />
            {/* <p style={{ textAlign: 'center', color: 'red' }}>
                    注：1.JoinMap为字段拼接类型,举例：BOCO_WNMS_~[alarmId];2.NoMap为下拉框枚举值选择类型，举例：A角；3.未配置字段将以默认值送至电子运维系统；
                </p> */}
            <BraftMode fieldDataList={noMapType} editRow={detailsRow} value={braftValue} visible={detailsVisible} onChange={detailsChange} />
        </>
    );
});
export default SingleContent;
