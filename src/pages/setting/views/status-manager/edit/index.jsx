import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, ColumnsSortDrag, Row, Col, Select } from 'oss-ui';
import moment from 'moment';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import { makeCRC32 } from '@Common/utils';
import { _ } from 'oss-web-toolkits';
import convertXml from 'xml-js';
import request from '@Src/common/api';
import { groupApi } from '@Common/api/service/groupApi';
import { useEnvironmentModel } from '@Src/hox';
import SelectCondition from '@Pages/setting/filter/list/comp-select-condition';
/**
 * 状态标识管理编辑弹窗
 */
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
class StatusManager extends PureComponent {
    constructor(props) {
        super(props);
        this.statusManagerEditForm = React.createRef();
        this.state = {
            visible: false,
            loading: false,
            filterInfo: { isCreate: true, templateName: '', description: '' },
            allOptionsList: [],
            columns: [],
            leftColumns: [
                {
                    key: 'name',
                    title: '名称',
                    allOptionsWidth: '100px',
                    selectOptionsWidth: '200px',
                },
                {
                    key: 'field',
                    title: '字段',
                    selectOptionsHide: true,
                    allOptionsWidth: '100px',
                },
            ],
            provinceList: [],
        };
    }

    handleSave = (params) => {
        const { onChange, ownerId } = this.props;
        const { columns, filterInfo } = this.state;
        this.statusManagerEditForm.current.validateFields().then((values) => {
            const regTemplateName = _.trim(values.template_name);
            const regFilterProvince = _.trim(values.filterProvince);
            const regFilterProfessional = _.trim(values.filterProfessional);
            // eslint-disable-next-line no-control-regex
            const descByteLength = values.description.replace(/[^\x00-\xff]/g, 'aa').length;
            // eslint-disable-next-line no-control-regex
            const regTemplateNameByteLength = regTemplateName ? regTemplateName.replace(/[^\x00-\xff]/g, 'aa').length : 0;
            if (!regTemplateName) {
                message.error('请输入模板名称');
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
            if (regTemplateNameByteLength > 64) {
                message.error('状态模板名称长度不超过64位（即汉字不超过32个文字）');
                return;
            }
            if (descByteLength > 255) {
                message.error('状态模板描述长度不超过255位（即汉字不超过128个文字）');
                return;
            }
            if (!columns || !columns.length) {
                message.error('未选择状态模板字段，请选择再提交！');
                return;
            }
            const data = values;
            data.status_value = '';
            data.status_value += '<BOCO.SceneMonitor.Domain.Model.IconOption><IconFields>';
            columns.forEach((item, index) => {
                data.status_value += `<BOCO.SceneMonitor.Domain.Model.IconField Index="${index + 1}" DispName="${item.name}" FieldName="${
                    item.field
                }" IsVisible="true"/>`;
            });
            data.status_value += '</IconFields></BOCO.SceneMonitor.Domain.Model.IconOption>';
            let templateId = null;
            if (filterInfo.templateId || filterInfo.templateId === 0) {
                templateId = filterInfo.templateId;
                data.template_id = templateId;
            } else {
                data.template_id = makeCRC32(values.template_name + ownerId);
                data.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
            }
            data.owner_id = ownerId;
            data.modify_time = moment().format('YYYY-MM-DD HH:mm:ss');
            const url = 'v1/template/status-icon';
            let type = 'post';

            if (filterInfo.templateId || filterInfo.templateId === 0) {
                type = 'put';
            }
            // 参数转成接口对应名称,新增参数
            const queryParam = {
                //templateId: data.template_id,
                templateName: _.trim(data.template_name),
                description: data.description,
                ownerId: data.owner_id,
                createTime: data.create_time,
                modifyTime: data.modify_time,
                statusValue: data.status_value,
                statusProvince: values.filterProvince,
                statusProfessional: values.filterProfessional?.join(','),
            };
            // 编辑参数
            const queryParam1 = {
                templateId,
                templateName: _.trim(data.template_name),
                description: data.description,
                ownerId: data.owner_id,
                modifyTime: data.modify_time,
                statusValue: data.status_value,
                statusProvince: values.filterProvince,
                statusProfessional: values.filterProfessional?.join(','),
            };

            request(url, {
                type,
                baseUrlType: 'monitorSetUrl',
                data: type === 'post' ? queryParam : queryParam1,
                // 是否需要显示成功消息提醒
                showSuccessMessage: false,
                // 是否需要显示失败消息提醒
                showErrorMessage: true,
                handlers: {
                    params,
                },
            }).then((res) => {
                if (res && res.code === 0) {
                    this.statusManagerEditForm.current.resetFields();
                    this.setState({
                        columns: [],
                    });
                    if (filterInfo.templateId) {
                        message.success('更新成功');
                    } else {
                        message.success('保存成功');
                    }
                    onChange(true, false);
                } else {
                    message.error(`保存失败！${res.message}`);
                }
            });
        });
    };

    handleCancel = () => {
        const { onChange } = this.props;
        this.statusManagerEditForm.current.resetFields();
        this.setState({
            columns: [],
        });
        onChange(false, false);
    };
    onChange = (list) => {
        this.setState({
            columns: list,
        });
    };
    // 获取所有字段
    componentDidMount() {
        if (isUnicom) {
            this.getProvinceList();
        }
        if (this.statusManagerEditForm.current && this.props.filterInfo && this.props.visible) {
            this.statusManagerEditForm.current.setFieldsValue({
                template_name: this.props.filterInfo.templateName,
                description: this.props.filterInfo.description,
                filterProvince: this.props.systemInfo?.currentZone?.zoneId
                    ? this.props.systemInfo?.currentZone?.zoneId
                    : this.props.filterInfo.statusProvince?.toString(),
                filterProfessional: this.props.filterInfo.statusProfessional?.split(',').map((item) => {
                    return Number(item);
                }),
            });
        }
        if (this.props.filterInfo) {
            this.setState({ filterInfo: this.props.filterInfo }, this.getfield.bind(this));
        }
    }

    getProvinceList = async () => {
        const { ownerId } = this.props;
        const provinceList = await groupApi.getProvinces(ownerId);
        this.setState({
            provinceList,
        });
    };

    getfield = () => {
        const { filterInfo } = this.state;
        const queryParam = {
            current: 1,
            pageSize: 100000,
        };

        request('v1/alarm/status-icon', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (!_.isEmpty(res.data)) {
                const list = res.data.map((item, index) => {
                    return {
                        id: index + 1,
                        name: item.COL_NAME_ZH || item.col_name_zh,
                        field: item.MSG_FIELD || item.msg_field,
                    };
                });
                if (filterInfo.isCreate) {
                    this.getTemplate0Fields(list);
                } else {
                    this.getTemplateInfo(list);
                }
                this.setState({
                    allOptionsList: list,
                });
            }
        });
    };

    getTemplateInfo = (list) => {
        const options = { ignoreComment: true, nativeTypeAttributes: true };
        const xmlData = convertXml.xml2js(this.props.filterInfo.statusValue, options);
        const columns = _.get(xmlData, `elements[0].elements[0].elements`, [])
            .map((s) => ({
                id: _.find(list, (item) => item.field === s.attributes.FieldName)?.id,
                name: s.attributes.DispName,
                field: s.attributes.FieldName,
            }))
            .filter((item) => item.id !== undefined);
        this.setState({
            columns,
        });
    };

    getTemplate0Fields = (list) => {
        const queryParam = {
            current: 1,
            pageSize: 20,
            showType: '1',
            userName: '',
            templateName: '',
            orderType: 'ASC',
            orderFieldName: 'templateName',
            templateId: 0,
            userId: this.props.ownerId,
        };
        request('v1/template/status-icon', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (!_.isEmpty(res.data)) {
                const options = { ignoreComment: true, nativeTypeAttributes: true };
                const xmlData = convertXml.xml2js(_.get(res, 'data[0].statusValue', ''), options);
                const columns = _.get(xmlData, `elements[0].elements[0].elements`, [])
                    .map((s) => ({
                        id: _.find(list, (item) => item.field === s.attributes.FieldName)?.id,
                        name: s.attributes.DispName,
                        field: s.attributes.FieldName,
                    }))
                    .filter((item) => item.id !== undefined);
                this.setState({
                    columns,
                });
            }
        });
    };

    render() {
        const { filterInfo, columns, allOptionsList, leftColumns, provinceList } = this.state;
        const { visible, container, authKey } = this.props;
        const styleMap = {
            width: '100%',
            height: `${window.innerHeight - 325}px`,
        };
        return (
            <>
                <Modal
                    width={694}
                    title={filterInfo.isCreate ? '状态模板新建' : '状态模板编辑'}
                    visible={visible}
                    centered
                    getContainer={container}
                    onCancel={this.handleCancel}
                    footer={<CustomModalFooter authKey={authKey} onCancel={this.handleCancel} onOk={this.handleSave} />}
                >
                    <Form
                        labelAlign="right"
                        labelCol={{ span: 5 }}
                        ref={this.statusManagerEditForm}
                        initialValues={{
                            template_name: filterInfo.templateName,
                            description: filterInfo.description,
                            filterProvince: filterInfo.statusProvinceLabel,
                            filterProfessional: filterInfo.statusProfessionalLabel,
                        }}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    required
                                    label="模板名称"
                                    name="template_name"
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
                                >
                                    <Input value={filterInfo.templateName} allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="描述"
                                    name="description"
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
                                    <Input value={filterInfo.description} allowClear />
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
                                            form={this.statusManagerEditForm?.current}
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
                    <ColumnsSortDrag
                        style={styleMap}
                        columns={leftColumns}
                        allOptionsList={allOptionsList}
                        selectOptionsList={columns}
                        onChange={this.onChange}
                    />
                </Modal>
            </>
        );
    }
}

export default StatusManager;
