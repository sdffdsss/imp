import React, { PureComponent } from 'react';
import { Modal, Button, Form, Tabs, Input, message, ColumnsSortDrag, Row, Col, Select, Switch } from 'oss-ui';
import { makeCRC32 } from '@Common/utils';
import CustomModalFooter from '@Components/custom-modal-footer';
import { _ } from 'oss-web-toolkits';
import produce from 'immer';
import { getAllAlarmColumns, getUserDefaultColumns, getTemplateColumnsById, setColumnsInfo, setColumnsIndex } from '../../common/rest';
import {
    activeAlarmColumn as defaultActiveAlarmColumn,
    confirmAlarmColumn as defaultConfirmAlarmColumn,
    clearAlarmColumn as defaultClearAlarmColumn,
    cleardAckAlarmColumn as defaultCleardAckAlarmColumn,
} from '../../common/defaultColumns';
import request from '@Src/common/api';
import dayjs from 'dayjs';
import { groupApi } from '@Common/api/service/groupApi';

import SelectCondition from '@Pages/setting/filter/list/comp-select-condition';
import { useEnvironmentModel } from '@Src/hox';
import AuthButton from '@Src/components/auth-button';

const titleVersion = useEnvironmentModel?.data?.environment?.version === 'unicom' ? '智能监控' : false;
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
const { TabPane } = Tabs;

class index extends PureComponent {
    alarmColTemplateForm = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 'active-col',
            swithValue: false,
            loading: false,
            fields: [
                { name: 'templateName', value: props.editRow ? props.editRow.templateName : '' },
                { name: 'description', value: props.editRow ? props.editRow.description : '' },
                { name: 'filterProvince', value: props.editRow ? props.editRow.filterProvince : '' },
                { name: 'filterProfessional', value: props.editRow ? props.editRow.filterProfessional : '' },
            ],
            activeAlarmColumn: [],
            confirmAlarmColumn: [],
            clearAlarmColumn: [],
            cleardAckAlarmColumn: [],
            isResetDisabled: true,
            columns: [
                {
                    key: 'name',
                    title: '名称',
                    allOptionsWidth: '145px',
                    selectOptionsWidth: '80px',
                },
                {
                    key: 'field',
                    title: '字段',
                    allOptionsWidth: '145px',
                    selectOptionsWidth: '80px',
                },
                {
                    key: 'alias',
                    title: '别名',
                    editFlag: true,
                    allOptionsHide: true,
                    selectOptionsWidth: '80px',
                },
                {
                    key: 'width',
                    title: '宽度',
                    editFlag: true,
                    allOptionsHide: true,
                    selectOptionsWidth: '50px',
                },
            ],
            provinceList: [],
        };
        this.editActiveRight = [];
        this.editConfirmRight = [];
        this.editClearRight = [];
        this.editCleardAckRight = [];
    }

    componentDidMount() {
        const { editRow, userInFo } = this.props;
        const zoneInfo = userInFo?.zones;
        if (!editRow) {
            this.setState({
                fields: [
                    { name: 'templateName', value: '' },
                    { name: 'description', value: '' },
                    {
                        name: 'filterProvince',
                        value: this.props.systemInfo?.currentZone?.zoneId
                            ? this.props.systemInfo?.currentZone?.zoneId
                            : zoneInfo && zoneInfo[0]?.zoneLevel === '1'
                            ? ''
                            : zoneInfo && zoneInfo[0]?.zoneLevel_2Id,
                    },
                    {
                        name: 'filterProfessional',
                        value: [],
                    },
                ],
                tabValue: 'active-col',
            });

            // 新建：获取默认的列信息；
            this.getUserColumnTemplate();
        } else {
            this.setState({
                fields: [
                    { name: 'templateName', value: editRow ? editRow.templateName : '' },
                    { name: 'description', value: editRow ? editRow.description : '' },
                    { name: 'filterProvince', value: editRow ? editRow.columnProvince?.toString() : '' },
                    {
                        name: 'filterProfessional',
                        value: editRow
                            ? editRow.columnProfessional?.split(',').map((item) => {
                                  return Number(item);
                              })
                            : [],
                    },
                ],
                tabValue: 'active-col',
            });
            // 编辑：获取当前editRow的列信息；
            this.setAlarmColumns();
        }
        this.setState({ isResetDisabled: true });
        if (isUnicom) {
            this.getProvinceList();
        }
    }
    getProvinceList = async () => {
        const { userId } = this.props;
        const provinceList = await groupApi.getProvinces(userId);
        this.setState({
            provinceList,
        });
    };

    getUserColumnTemplate = async () => {
        const { userName } = this.props;
        const leftData = await getAllAlarmColumns();
        this.setState({ leftData });
        const callback = this.setDefaultActiveAlarmColumn;
        const userDefaultTemplateId = await getUserDefaultColumns(userName);
        const getOtherDefault = async () => {
            const template0ColumnsXml = await getTemplateColumnsById(0, this.props.userId);
            if (template0ColumnsXml) {
                this.setState({ ...setColumnsInfo(template0ColumnsXml, leftData) }, callback);
            } else {
                this.setState(
                    {
                        activeAlarmColumn: setColumnsIndex(defaultActiveAlarmColumn, leftData),
                        confirmAlarmColumn: setColumnsIndex(defaultConfirmAlarmColumn, leftData),
                        clearAlarmColumn: setColumnsIndex(defaultClearAlarmColumn, leftData),
                        cleardAckAlarmColumn: setColumnsIndex(defaultCleardAckAlarmColumn, leftData),
                    },
                    callback,
                );
            }
        };
        if (userDefaultTemplateId) {
            const columnsXml = await getTemplateColumnsById(userDefaultTemplateId, this.props.userId);
            if (columnsXml) {
                this.setState({ ...setColumnsInfo(columnsXml, leftData) }, callback);
            } else {
                getOtherDefault();
            }
        } else {
            getOtherDefault();
        }
    };

    // 有面板默认告警列
    setDefaultActiveAlarmColumn = () => {
        const { activeAlarmColumn, confirmAlarmColumn, clearAlarmColumn, cleardAckAlarmColumn } = this.state;
        this.editActiveRight = [...activeAlarmColumn];
        this.editConfirmRight = [...confirmAlarmColumn];
        this.editClearRight = [...clearAlarmColumn];
        this.editCleardAckRight = [...cleardAckAlarmColumn];
    };

    // 修改——回填告警列
    async setAlarmColumns() {
        const { editRow } = this.props;
        const leftData = await getAllAlarmColumns();
        const columns = setColumnsInfo(editRow.columnsValue, leftData);
        this.setState({ ...columns, leftData }, this.setDefaultActiveAlarmColumn);
    }

    handleCancel = () => {
        const { onVisibleChange } = this.props;
        onVisibleChange(false);
    };

    onChange = (type, condtion) => {
        this.setState({ isResetDisabled: false });

        const newCondition = produce(condtion, (draft) => {
            return draft.map((item) => {
                return produce(item, (draftItem) => {
                    if (!draftItem.width) {
                        // eslint-disable-next-line no-param-reassign
                        draftItem.width = 120;
                    }
                    if (!draftItem.alias) {
                        // eslint-disable-next-line no-param-reassign
                        draftItem.alias = item.name;
                    }
                });
            });
        });
        switch (type) {
            case 'active':
                this.editActiveRight = newCondition;
                break;
            case 'confirm':
                this.editConfirmRight = newCondition;
                break;
            case 'clear':
                this.editClearRight = newCondition;
                break;
            case 'cleardAck':
                this.editCleardAckRight = newCondition;
                break;
            default:
                break;
        }
    };

    handleOk = (params) => {
        const { refreshData, editRow, onVisibleChange } = this.props;
        const columnsValue = this.handleAlarmColumns();
        this.alarmColTemplateForm.current.validateFields().then((values) => {
            const currentValues = _.cloneDeep(values);
            const regTemplateName = _.trim(currentValues.templateName);
            const regFilterProvince = _.trim(currentValues.filterProvince);
            const regFilterProfessional = _.trim(currentValues.filterProfessional);
            // eslint-disable-next-line no-control-regex
            const templateNameByteLength = regTemplateName.replace(/[^\x00-\xff]/g, 'aa').length;
            // eslint-disable-next-line no-control-regex
            const descByteLength = currentValues.description ? currentValues.description.replace(/[^\x00-\xff]/g, 'aa').length : 0;
            if (!regTemplateName) {
                message.error('请输入名称后再提交');
                return;
            }
            if (isUnicom && !regFilterProvince) {
                message.error('请选择归属省份再提交');
                return;
            }
            if (isUnicom && !regFilterProfessional.length > 0) {
                message.error('请选择归属专业再提交');
                return;
            }
            if (templateNameByteLength > 64) {
                message.error('列模板名称长度不超过64位（即汉字不超过32个文字）');
                return;
            }
            if (descByteLength > 255) {
                message.error('列模板描述长度不超过255位（即汉字不超过128个文字）');
                return;
            }
            const { swithValue } = this.state;
            const { editActiveRight, editConfirmRight, editClearRight, editCleardAckRight } = this;
            if (editActiveRight.length > 40) {
                message.error('未清除未确认已选字段不能超过40个');
                return;
            }
            if (!editActiveRight.length) {
                message.error('未清除未确认已选字段不能为空');
                return;
            }
            //同步字段时候，只取值 未清除未确认
            if (!swithValue) {
                if (editClearRight.length > 40) {
                    message.error('已清除未确认已选字段不能超过40个');
                    return;
                }
                if (editCleardAckRight.length > 40) {
                    message.error('已清除已确认已选字段不能超过40个');
                    return;
                }
                if (editConfirmRight.length > 40) {
                    message.error('未清除已确认已选字段不能超过40个');
                    return;
                }
                if (!editConfirmRight.length) {
                    message.error('未清除已确认已选字段不能为空');
                    return;
                }
                if (!editClearRight.length) {
                    message.error('已清除未确认已选字段不能为空');
                    return;
                }
                if (!editCleardAckRight.length) {
                    message.error('已清除已确认已选字段不能为空');
                    return;
                }
            }
            currentValues.columnsValue = columnsValue;
            if (!editRow) {
                this.insertAlarmColumnTemplates(
                    currentValues,
                    () => {
                        refreshData();
                        onVisibleChange(false);
                    },
                    params,
                );
            } else {
                this.updateAlarmColumnTemplates(
                    currentValues,
                    () => {
                        refreshData();
                        onVisibleChange(false);
                    },
                    params,
                );
            }
        });
    };

    handleAlarmColumns() {
        const { swithValue } = this.state;
        const { editActiveRight, editConfirmRight, editClearRight, editCleardAckRight } = this;

        const activeWidthStr = editActiveRight.map((item) => item.width).join('|');
        const activeAlarmColumnStr = editActiveRight.map((item) => (item.name === item.alias ? item.field : `${item.field}#${item.alias}`)).join('|');
        if (!swithValue) {
            const confirmWidthStr = editConfirmRight.map((item) => item.width).join('|');
            const confirmAlarmColumnStr = editConfirmRight
                .map((item) => (item.name === item.alias ? item.field : `${item.field}#${item.alias}`))
                .join('|');

            const clearmWidthStr = editClearRight.map((item) => item.width).join('|');
            const clearAlarmColumnStr = editClearRight
                .map((item) => (item.name === item.alias ? item.field : `${item.field}#${item.alias}`))
                .join('|');

            const cleardAckWidthStr = editCleardAckRight.map((item) => item.width).join('|');
            const cleardAckAlarmColumnStr = editCleardAckRight
                .map((item) => (item.name === item.alias ? item.field : `${item.field}#${item.alias}`))
                .join('|');
            const activeAlarmColumnXmlStr = `<ActiveBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${activeAlarmColumnStr}" ColumnWidths="${activeWidthStr}"/></ActiveBandSetting>`;
            const confirmAlarmColumnXmlStr = `<ConfirmBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${confirmAlarmColumnStr}" ColumnWidths="${confirmWidthStr}"/></ConfirmBandSetting>`;
            const clearAlarmColumnXmlStr = `<ClearBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${clearAlarmColumnStr}" ColumnWidths="${clearmWidthStr}" /></ClearBandSetting>`;
            const cleardAckAlarmColumnXmlStr = `<CleardAckBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${cleardAckAlarmColumnStr}" ColumnWidths="${cleardAckWidthStr}" /></CleardAckBandSetting>`;

            const columnsValue = `<BOCO.IMP.Domain.OptionModels.AlarmBandOption>${activeAlarmColumnXmlStr}${confirmAlarmColumnXmlStr}${clearAlarmColumnXmlStr}${cleardAckAlarmColumnXmlStr}</BOCO.IMP.Domain.OptionModels.AlarmBandOption>`;
            return columnsValue;
        }
        const activeAlarmColumnXmlStr = `<ActiveBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${activeAlarmColumnStr}" ColumnWidths="${activeWidthStr}"/></ActiveBandSetting>`;
        const confirmAlarmColumnXmlStr = `<ConfirmBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${activeAlarmColumnStr}" ColumnWidths="${activeWidthStr}"/></ConfirmBandSetting>`;
        const clearAlarmColumnXmlStr = `<ClearBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${activeAlarmColumnStr}" ColumnWidths="${activeWidthStr}" /></ClearBandSetting>`;
        const cleardAckAlarmColumnXmlStr = `<CleardAckBandSetting><BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${activeAlarmColumnStr}" ColumnWidths="${activeWidthStr}" /></CleardAckBandSetting>`;
        const columnsValue = `<BOCO.IMP.Domain.OptionModels.AlarmBandOption>${activeAlarmColumnXmlStr}${confirmAlarmColumnXmlStr}${clearAlarmColumnXmlStr}${cleardAckAlarmColumnXmlStr}</BOCO.IMP.Domain.OptionModels.AlarmBandOption>`;
        return columnsValue;
    }

    // 新增入库
    insertAlarmColumnTemplates = (values, callback, params) => {
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const templateID = makeCRC32(createTime + values.templateName + this.props.userId);
        const queryParam = {
            // templateId: templateID,
            templateName: _.trim(values.templateName),
            description: values.description,
            columnProvince: values.filterProvince,
            columnProfessional: values.filterProfessional?.join(','),
            ownerId: this.props.userId,
            createTime,
            modifyTime: createTime,
            columnsValue: values.columnsValue,
        };
        request('v1/template/alarm-column', {
            type: 'post',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示成功消息提醒
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
            handlers: {
                params,
            },
        }).then((res) => {
            if (res && res.code === 0) {
                message.success('保存成功');
                callback();
            } else {
                message.error(`保存失败！${res.message}`);
            }
        });
    };

    // 修改入库
    updateAlarmColumnTemplates = (values, callback, params) => {
        const modifyTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const templateID = this.props.editRow.templateId;

        const queryParam = {
            templateId: templateID,
            templateName: _.trim(values.templateName),
            description: values.description,
            ownerId: this.props.userId,
            columnProvince: values.filterProvince,
            columnProfessional: values.filterProfessional?.join(','),
            modifyTime,
            columnsValue: values.columnsValue,
        };
        request('v1/template/alarm-column', {
            type: 'put',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示成功消息提醒
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
            handlers: {
                params,
            },
        }).then((res) => {
            if (res && res.code === 0) {
                message.success('保存成功');
                callback();
            } else {
                message.error(`保存失败！${res.message}`);
            }
        });
    };

    handleGoback = () => {
        const { editRow } = this.props;
        if (!editRow) {
            this.getUserColumnTemplate();
        } else {
            this.setAlarmColumns();
        }
        message.success('已还原为默认值！');
        this.setState({ isResetDisabled: true });
    };
    customFooterRender() {
        const { loading } = false;
        const { isResetDisabled } = this.state;
        const { editRow } = this.props;
        return (
            <>
                <Button key="goback" type="primary" disabled={isResetDisabled} onClick={this.handleGoback}>
                    还原默认值
                </Button>
                <AuthButton
                    addLog={true}
                    authKey={!editRow ? 'alarmColumn:add' : 'alarmColumn:edit'}
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={this.handleOk}
                >
                    保存
                </AuthButton>
                <Button key="back" onClick={this.handleCancel}>
                    取消
                </Button>
            </>
        );
    }

    onTabChange(value) {
        this.setState({
            tabValue: value,
        });
    }
    onSwithChange(value) {
        this.setState({
            swithValue: value,
        });
    }

    render() {
        const {
            activeAlarmColumn,
            confirmAlarmColumn,
            clearAlarmColumn,
            cleardAckAlarmColumn,
            fields,
            tabValue,
            columns,
            leftData,
            provinceList,
            swithValue,
        } = this.state;
        const { editRow, visible, container } = this.props;

        const styleMap = {
            width: '100%',
            height: '55vh',
        };
        return (
            <Modal
                width={905}
                title={!editRow ? '新建' : '编辑'}
                visible={visible}
                centered
                maskClosable={false}
                onCancel={this.handleCancel}
                getContainer={container}
                footer={
                    <CustomModalFooter
                        authKey={!editRow ? 'alarmColumn:add' : 'alarmColumn:edit'}
                        onCancel={this.handleCancel}
                        onOk={this.handleOk}
                        render={this.customFooterRender.bind(this)}
                    />
                }
            >
                <Form labelAlign="right" labelCol={{ span: 4 }} ref={this.alarmColTemplateForm} fields={fields}>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    { required: true, message: '模板名称不可为空' },
                                    {
                                        validator: (rule, value, callback) => {
                                            // eslint-disable-next-line no-control-regex
                                            const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                            if (valueLength > 64) {
                                                callback('总长度不能超过64位（1汉字=2位）');
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ]}
                                name="templateName"
                                label="模板名称"
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="描述"
                                rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            // eslint-disable-next-line no-control-regex
                                            const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                            if (valueLength > 255) {
                                                callback('描述总长度不能超过255位（1汉字=2位）');
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                    {isUnicom && (
                        <Row>
                            <Col span={12}>
                                <Form.Item label={'归属省份'} name="filterProvince" rules={[{ required: true, message: '不可为空' }]}>
                                    <Select>
                                        {provinceList
                                            .filter((items) =>
                                                this.props.systemInfo?.currentZone?.zoneId
                                                    ? items.regionId === this.props.systemInfo?.currentZone?.zoneId
                                                    : true,
                                            )
                                            .map((item) => {
                                                return (
                                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                                        {item.regionName}
                                                    </Select.Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'归属专业'} name="filterProfessional" rules={[{ required: true, message: '不可为空' }]}>
                                    <SelectCondition
                                        form={this.alarmColTemplateForm?.current}
                                        mode="multiple"
                                        title={'归属专业'}
                                        id="key"
                                        label="value"
                                        dictName={'professional_type'}
                                        searchName={'professional_type'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                </Form>
                <div className="col-template-edit-tabPane">
                    <div className="synchField">
                        <div className="synchField-lable">{'同步展示字段：'}</div>
                        <Switch className="synchField-swith" onChange={this.onSwithChange.bind(this)} />
                    </div>
                    <Tabs onChange={this.onTabChange.bind(this)} activeKey={tabValue} type="card">
                        <TabPane tab="未清除未确认" key="active-col">
                            <ColumnsSortDrag
                                style={styleMap}
                                columns={columns}
                                allOptionsList={leftData}
                                selectOptionsList={activeAlarmColumn}
                                onChange={_.partial(this.onChange, 'active')}
                                maxField={40}
                                dragHolderMessag={titleVersion}
                            />
                        </TabPane>
                        <TabPane tab="未清除已确认" disabled={swithValue} key="confirm-col">
                            <ColumnsSortDrag
                                style={styleMap}
                                columns={columns}
                                allOptionsList={leftData}
                                selectOptionsList={confirmAlarmColumn}
                                onChange={_.partial(this.onChange, 'confirm')}
                                maxField={40}
                                dragHolderMessag={titleVersion}
                            />
                        </TabPane>
                        <TabPane tab="已清除未确认" disabled={swithValue} key="clear-col">
                            <ColumnsSortDrag
                                style={styleMap}
                                columns={columns}
                                allOptionsList={leftData}
                                selectOptionsList={clearAlarmColumn}
                                onChange={_.partial(this.onChange, 'clear')}
                                maxField={40}
                                dragHolderMessag={titleVersion}
                            />
                        </TabPane>
                        <TabPane tab="已清除已确认" disabled={swithValue} key="complete-col">
                            <ColumnsSortDrag
                                style={styleMap}
                                columns={columns}
                                allOptionsList={leftData}
                                selectOptionsList={cleardAckAlarmColumn}
                                onChange={_.partial(this.onChange, 'cleardAck')}
                                maxField={40}
                                dragHolderMessag={titleVersion}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{ color: 'red', margin: '10px 0 0' }}>提示：已选择的告警字段不能超过40个！</div>
            </Modal>
        );
    }
}
export default React.memo(index);
