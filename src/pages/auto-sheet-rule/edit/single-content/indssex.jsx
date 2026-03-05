/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Select, Input, Form } from 'oss-ui';
import { customAlphabet } from 'nanoid';
import { EditableProTable } from '@ant-design/pro-table';
import { FormInstance } from 'oss-ui/es/form';
import request from '@Common/api';
import BraftMode from './braft-mode';
import api from './api';
import { _ } from 'oss-web-toolkits';
import './index.less';

const { Option } = Select;
const { TextArea } = Input;
// const { FormInstance } = Form;

let noMapType = [];
let fieldTypeEnum = {};
const valueMapData = [
    {
        label: 'A角',
        value: 'A角_role_id',
    },
    {
        label: 'B角',
        value: 'B角_role_id',
    },
    {
        label: '中心主任',
        value: '中心主任_role_id',
    },
    {
        label: '代维领导',
        value: '代维领导_role_id',
    },
    {
        label: '主管领导',
        value: '主管领导_role_id',
    },
    {
        label: '工单审核人',
        value: '工单审核人_role_id',
    },
    {
        label: '代维人员',
        value: '代维人员_role_id',
    },
    {
        label: '代维调度中心',
        value: '代维调度中心_role_id',
    },
    {
        label: '省份专业牵头人',
        value: '省份专业牵头人_role_id',
    },
];
const EditTable = (props) => {
    const [form] = Form.useForm();
    return (
        <EditableProTable
            className="editable-proTabl-div"
            columns={props.columns}
            rowKey="id"
            scroll={{ y: 'calc(100% - 65px)' }}
            value={props.dataSource}
            onChange={props.editTableChange}
            recordCreatorProps={
                props.disabled
                    ? false
                    : {
                          newRecordType: 'dataSource',
                          record: () => ({
                              ...props.field,
                              id: `${new Date().getTime()}`,
                          }),
                      }
            }
            editable={
                props.disabled
                    ? false
                    : {
                          type: 'multiple',
                          editableKeys: props.editableKeys,
                          form,
                          //   //   formProps: {
                          //   //       name: 'editForm'
                          //   //   },
                          actionRender: (row, config, defaultDoms) => {
                              return [defaultDoms.delete];
                          },
                          onValuesChange: (record, recordList) => {
                              props.editTableChange(recordList);
                          },
                          onDelete: (row) => {
                              props.delRow(row);
                          },
                      }
            }
        />
    );
};
// const editForm = Form.useForm();
export default class Index extends React.PureComponent {
    editForm = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            dataSource: [],
            editableKeys: [],
            detailsVisible: false,
            detailsRow: {},
            defaultDataSource: [],
            braftValue: null,
            fieldData: [],
            dataOtherList: [],
            dataAllList: [],
        };
    }

    get field() {
        const { dataAllList, dataSource } = this.state;
        const filteredList = dataAllList.filter((item) => !dataSource.some((source) => source.fieldName === item.value));
        return filteredList.length
            ? filteredList[0].field
            : { fieldName: '', fieldLenth: '', fieldType: 'String', mapClass: 'JionMap', mapField: '' };
    }

    getColumns = () => {
        const { dataAllList } = this.state;
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
                    const otherSource = this.state.dataSource.filter((item) => item.id !== entry.id);
                    const disabledKeys = otherSource.map((item) => item.fieldName);
                    const options = dataAllList;
                    return (
                        <Select disabled={entry.editTable} onChange={this.editSelectField.bind(this, entry)} showSearch optionFilterProp={'label'}>
                            {options.map((item) => (
                                <Option value={item.value} key={item.value} label={item.label} disabled={disabledKeys.includes(item.value)}>
                                    {item.label}
                                </Option>
                            ))}
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
                // formItemProps: {
                //     rules: [
                //         {
                //             required: true,
                //             whitespace: true,
                //             message: '此项是必填项'
                //         },
                //         {
                //             max: 3,
                //             whitespace: true,
                //             message: '最长为 3 位'
                //         },
                //         {
                //             min: 2,
                //             whitespace: true,
                //             message: '最小为 2 位'
                //         }
                //         // {
                //         //     type:'number',

                //         // }
                //     ]
                // }
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
                valueEnum: {
                    JoinMap: {
                        text: '内容拼接',
                        status: 'JoinMap',
                    },
                    NoMap: {
                        text: '告警字段选择',
                        status: 'NoMap',
                    },
                    // EnumMap: {
                    //     text: 'EnumMap',
                    //     status: 'EnumMap'
                    // },
                    ValueByMap: {
                        text: '受理人选择',
                        status: 'ValueByMap',
                    },
                },
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
                title: '数据内容',
                dataIndex: 'mapData',
                width: 480,
                renderFormItem: (_, row, form) => {
                    if (row.record?.mapClass === 'JoinMap') {
                        return <TextArea rows={3} value={row.record.mapField} onClick={this.onClickMapField.bind(this, row, form)} allowClear />;
                    }
                    if (row.record?.mapClass === 'ValueByMap') {
                        return (
                            <Select
                                defaultValue={row.record.mapField}
                                howSearch
                                optionFilterProp={'label'}
                                mode="multiple"
                                options={valueMapData}
                            ></Select>
                        );
                    }
                    return (
                        <Select defaultValue={row.record.mapField} showSearch optionFilterProp={'label'} mode="multiple" options={noMapType}></Select>
                    );
                },
            },
            {
                title: '操作',
                valueType: 'option',
                width: 120,
                render: () => {
                    return this.props.disabled ? '删除' : null;
                },
            },
        ];
        this.setState({
            columns,
        });
    };
    componentDidMount() {
        this.getAlarmFieldType();
        this.addWorksheet();
        this.getColumns();
        // this.getField();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.singleContentdata !== this.props.singleContentdata) {
            this.addWorksheet();
        }
    }

    /** *
     *新增默认数据
     */
    async addWorksheet() {
        const { modelType, singleContentdata, moduleId } = this.props;
        // const editableKeys = [];
        // const dataSource = [];
        let fieldNames = '';
        const moduleList = [604, 605];
        const nanoid = customAlphabet('1234567890', 15);
        if (modelType === 'new') {
            const params = {
                modelName: 'newAlarm',
                modelId: moduleList.includes(moduleId) ? moduleId : 1,
            };
            const defaultDataSource = await api.addWorksheet(params);
            // fieldNames = defaultDataSource.map((item) => item.fieldName);
            const dataSource = defaultDataSource
                .filter((item) => item.isModify && item.isModify === 1)
                .map((item) => {
                    const id = nanoid();
                    return {
                        ...item,
                        id,
                        editTable: true,
                        mapData: item.mapClass === 'ValueByMap' || item.mapClass === 'NoMap' ? item.mapData.split(',') : item.mapData,
                    };
                    // }
                });
            fieldNames = dataSource && dataSource.length > 0 && dataSource.map((item) => item.fieldName).join(',');
            const list = dataSource.map((item) => {
                return {
                    label: item.fieldCnName,
                    value: item.fieldName,
                    field: item,
                };
            });
            this.setState({
                dataSource,
                editableKeys: dataSource.map((item) => item.id),
                dataOtherList: list,
                defaultDataSource: dataSource.map((item) => item.id),
            });
            this.getField(fieldNames, dataSource);
        } else if (singleContentdata.length > 0) {
            const dataSource = singleContentdata.map((item) => {
                const id = nanoid();
                return {
                    ...item,
                    id,
                    editTable: true,
                    mapData: item.mapClass === 'ValueByMap' || item.mapClass === 'NoMap' ? item.mapData.split(',') : item.mapData,
                };
            });
            const list = dataSource.map((item) => {
                return {
                    label: item.fieldCnName,
                    value: item.fieldName,
                    field: item,
                };
            });
            fieldNames = dataSource && dataSource.length > 0 && dataSource.map((item) => item.fieldName).join(',');
            this.setState({
                dataSource,
                dataOtherList: list,
                editableKeys: dataSource.map((item) => item.id),
                defaultDataSource: dataSource.map((item) => item.id),
            });
            this.getField(fieldNames, dataSource);
        }
        this.getNoMapType(moduleId);
    }
    getField = async (fieldNames, dataSource) => {
        const { moduleId } = this.props;
        const moduleIdEnum = [604, 605];
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
            const list = res.data
                .filter((item) => item.isModify && item.isModify === 2)
                .map((item) => {
                    return {
                        value: item.fieldName,
                        label: item.fieldCnName,
                        field: item,
                    };
                });
            const otherlist = dataSource.map((item) => {
                return {
                    label: item.fieldCnName,
                    value: item.fieldName,
                    field: _.omit(item, ['id', 'editTable']),
                };
            });
            this.setState(
                {
                    fieldData: list,
                    dataAllList: [...list, ...otherlist],
                },
                () => {
                    this.getColumns();
                },
            );
        }
    };
    /** *
     *获取字段类型
     */
    getNoMapType = async (params) => {
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
            this.getColumns();
        }
    };
    changeField = (dataSource) => {
        const { dataAllList, fieldData } = this.state;
        // const { fieldData } = this.state;
        const fieldNameList = dataSource.map((item) => item.fieldName);
        const list = dataAllList.filter((item) => !fieldNameList.includes(item.value));
        this.setState(
            {
                fieldData: list,
            },
            () => {
                if (fieldData.length !== list.length) {
                    this.getColumns();
                }
            },
        );
    };
    /** *
     *获取字段类型
     */
    getAlarmFieldType = async () => {
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
            this.getColumns();
            // const newColumns = columns.map((item) => {
            //     return {
            //         ...item,
            //         valueEnum: item.key === 'fieldType' ? fieldTypeEnum : item.valueEnum
            //     };
            // });
            // this.setState({
            //     columns: newColumns
            // });
        }
    };
    editSelectField = (entry, value) => {
        const { dataSource, fieldData } = this.state;
        const obj = fieldData.find((item) => item.value === value);
        if (!obj) return;
        const list = dataSource.map((item) => {
            if (entry.id === item.id) {
                return {
                    ...item,
                    ...obj.field,
                };
            }
            return item;
        });
        console.log(list);
        // this.changeField(list);
        this.setState({
            dataSource: list,
        });
    };
    componentWillUnmount() {}
    delRow = (row) => {
        const { dataSource, dataAllList, fieldData } = this.state;
        const delDataSource = dataSource.filter((item) => item.id !== row);
        const fieldNameList = delDataSource.map((item) => item.fieldName);
        const list = dataAllList.filter((item) => !fieldNameList.includes(item.value));
        this.setState(
            {
                dataSource: delDataSource,
                // editableKeys: list.map((item) => item.id),
                fieldData: list,
            },
            () => {
                if (fieldData.length !== list.length) {
                    this.getColumns();
                }
            },
        );
    };

    onClickMapField = (row, form) => {
        this.setState({
            detailsVisible: true,
            detailsRow: {},
            braftValue: { ...row?.record, id: row.recordKey },
        });
    };

    detailsChange = (flag, field) => {
        const { dataSource } = this.state;
        let list = dataSource;
        if (flag)
            list = dataSource.map((item) => {
                if (item.id === flag) {
                    return {
                        ...item,
                        mapData: field,
                    };
                }
                return item;
            });
        this.setState({
            detailsVisible: false,
            detailsRow: {},
            dataSource: list,
        });
    };
    editTableChange = (data) => {
        const { dataSource } = this.state;
        data.forEach((item) => {
            const target = dataSource.find((source) => source.id === item.id);
            if (target && target.mapClass !== item.mapClass) {
                // eslint-disable-next-line no-param-reassign
                item.mapData = item.mapClass === 'JoinMap' ? '' : [];
            }
        });
        this.setState({
            dataSource: data,
            editableKeys: data.map((item) => item.id),
        });
    };

    getSingleContentLists = () => {
        const { dataSource } = this.state;
        return dataSource.map((item) => {
            return {
                ...item,
                mapData:
                    item.mapClass === 'ValueByMap' || item.mapClass === 'NoMap'
                        ? item.mapData && item.mapData.length > 0
                            ? Array.isArray(item.mapData)
                                ? item.mapData.join(',')
                                : item.mapData
                            : ''
                        : item.mapData,
            };
        });
    };

    render() {
        const { columns, dataSource, editableKeys, detailsVisible, detailsRow, braftValue } = this.state;
        const { disabled } = this.props;
        return (
            <Fragment>
                <EditTable
                    columns={columns}
                    disabled={disabled}
                    dataSource={dataSource}
                    editTableChange={this.editTableChange}
                    field={this.field}
                    editableKeys={editableKeys}
                    delRow={this.delRow}
                />
                {/* <p style={{ textAlign: 'center', color: 'red' }}>
                    注：1.JoinMap为字段拼接类型,举例：BOCO_WNMS_~[alarmId];2.NoMap为下拉框枚举值选择类型，举例：A角；3.未配置字段将以默认值送至电子运维系统；
                </p> */}
                <BraftMode fieldDataList={noMapType} editRow={detailsRow} value={braftValue} visible={detailsVisible} onChange={this.detailsChange} />
            </Fragment>
        );
    }
}
