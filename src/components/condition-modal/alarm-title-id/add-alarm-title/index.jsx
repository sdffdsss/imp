/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PureComponent, Fragment } from 'react';
import { Modal, Input, Icon, Row, Col, Checkbox, Select, Button, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import useLoginInfoModel from '@Src/hox';
import request from '@Common/api';
import CustomModalFooter from '@Components/custom-modal-footer';
import { getAlarmTitleList, getSiteNoList } from '../api';
import { withModel } from 'hox';
import { _ } from 'oss-web-toolkits';

const { Option } = Select;
//行数据汇总
let rowSummary = [];
class AddAlarmTitle extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            selectedRowKeys: [],
            selectedDatas: [],
            professionalList: [],
            vendorList: [],
            neTypeList: [],
            province: [],
            region: [],
            columns: [],
            provinceName: null,
            dataSource: [],
            title: '',
        };
    }

    componentDidMount() {
        this.initDate();
    }

    initDate = () => {
        const { currentSelectedCondition, curExitDate } = this.props;
        let title = '';
        switch (currentSelectedCondition.enumName) {
            case 'alarm_title':
                this.getAlarmColumnsCond();
                title = '告警标题选择';
                break;
            case 'site_no':
                this.getSiteColumnsCond();
                title = '设备机房选择';
                break;
            default:
                break;
        }
        rowSummary = _.cloneDeep(curExitDate);
        const selectedRowKeys = rowSummary.map((item) => {
            return item.key;
        });
        this.setState({ title, selectedRowKeys });
    };
    getDictEntry(dictName, zoneId) {
        const {
            login: { userId, systemInfo, userInfo },
        } = this.props;
        let zoneObj = {};
        let userInfos = userInfo && JSON.parse(userInfo);
        if (dictName === 'province_id') {
            zoneObj.hasAdditionZone = false;
            if (systemInfo.currentZone?.zoneLevel === '5' && userInfos?.zones[0].zoneLevel === '1') {
                zoneObj.zoneId = systemInfo.currentZone?.zoneId;
            }
        }
        return request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                ...zoneObj,
                zoneId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    if (systemInfo.currentZone?.zoneId && dictName === 'province_id') {
                        const zoneId = systemInfo.currentZone?.zoneId;
                        const zoneLevel = systemInfo.currentZone?.zoneLevel;
                        return res.data.filter((a) => (zoneLevel !== '1' && zoneLevel !== '5' ? a.key === zoneId : a.key !== zoneId));
                    }
                    return res.data;
                }
                return [];
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
        // );
    }
    getAlarmColumnsCond = () => {
        Promise.all([
            this.getDictEntry('professional_type'),
            this.getDictEntry('vendor_id'),
            this.getDictEntry('eqp_object_class'), //province_id  region_id provinceId: -662225376
        ]).then((resolveArrar) => {
            const professionalList = resolveArrar[0];
            const vendorList = resolveArrar[1];
            const neTypeList = resolveArrar[2];
            this.setState({ professionalList, vendorList, neTypeList }, () => {
                this.getAlarmColumns();
            });
        });
    };
    //获取列信息
    getAlarmColumns = () => {
        const { professionalList, vendorList, neTypeList } = this.state;
        const columns = [
            {
                title: '专业',
                align: 'left',
                dataIndex: 'professionalType',
                ellipsis: true,
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select showSearch defaultValue={professionalList[0]?.key} optionFilterProp="children">
                            {professionalList.map((item) => {
                                return (
                                    <Select.Option value={item.key} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '厂家',
                align: 'left',
                dataIndex: 'vendor',
                ellipsis: true,
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select showSearch defaultValue={vendorList[0]?.value} placeholder="请选择" optionFilterProp="children">
                            {vendorList.map((item) => {
                                return (
                                    <Select.Option value={item.key} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            // {
            //     title: '设备类型',
            //     align: 'left',
            //     dataIndex: 'neType',
            //     ellipsis: true,
            //     hideInTable: true,
            //     width: 15,
            //     renderFormItem: () => {
            //         return (
            //             <Select showSearch defaultValue={neTypeList[0]?.value} placeholder="请选择" optionFilterProp="children">
            //                 {neTypeList.map((item) => {
            //                     return (
            //                         <Select.Option value={item.key} key={item.key} label={item.value}>
            //                             {item.value}
            //                         </Select.Option>
            //                     );
            //                 })}
            //             </Select>
            //         );
            //     },
            // },
            {
                title: '告警标题',
                align: 'left',
                dataIndex: 'title',
                width: 50,
            },
            {
                title: '告警标题ID',
                align: 'left',
                dataIndex: 'titleId',
                hideInSearch: true,
                width: 50,
            },

            // {
            //     title: '厂家告警号',
            //     align: 'left',
            //     dataIndex: 'vendorAlarmId',
            //     ellipsis: true,
            //     width: 20,
            // },
        ];
        this.setState({ columns });
    };
    getSiteColumnsCond = () => {
        const provincFun = new Promise((resolve, reject) => {
            this.getDictEntry('province_id')
                .then((res) => {
                    resolve(res);
                })
                .catch((e) => {
                    reject(e);
                });
        });
        provincFun.then((province) => {
            const temp = new Promise((resolve, reject) => {
                this.getDictEntry('region_id', province[0]?.key)
                    .then((region) => {
                        resolve(region);
                        this.setState({ province, region, provinceName: province[0]?.value }, () => {
                            this.getSiteColumns();
                        });
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        });
    };
    //获取列信息
    getSiteColumns = () => {
        const { province, region, provinceName } = this.state;
        const columns = [
            {
                title: '省份',
                align: 'left',
                dataIndex: 'province',
                ellipsis: true,
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            defaultValue={provinceName}
                            onChange={(value, opt) => {
                                this.selectprovince(value, opt);
                            }}
                            optionFilterProp="children"
                        >
                            {province.map((item) => {
                                return (
                                    <Select.Option value={item.value} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '地市',
                align: 'left',
                dataIndex: 'region',
                ellipsis: true,
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select showSearch defaultValue={region[0]?.value} placeholder="请选择" optionFilterProp="children">
                            {region.map((item) => {
                                return (
                                    <Select.Option value={item.value} key={item.key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '机房名称',
                align: 'left',
                dataIndex: 'siteName',
                width: 50,
            },
            {
                title: '机房ID',
                align: 'left',
                dataIndex: 'siteId',
                ellipsis: true,
                width: 30,
            },
        ];
        this.setState({ columns });
    };
    selectprovince = (name, opt) => {
        const temp = new Promise((resolve, reject) => {
            this.getDictEntry('region_id', opt?.key)
                .then((region) => {
                    resolve(region);
                    this.setState({ region, columns: [], provinceName: name }, () => {
                        this.getSiteColumns();
                    });
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };
    /**
     * 复选框change
     */
    onSelectChange = (id, rows) => {
        let selectedRowKeys = [];
        selectedRowKeys = rows.map((row) => {
            return row.groupId;
        });
        this.setState({
            selectedRowKeys,
        });
    };

    /**
     * 复选框selected
     */
    onSelect = (record, selected, selectedRows) => {
        if (selected) {
            rowSummary.unshift(_.last(selectedRows));
        } else {
            _.remove(rowSummary, (o) => o.key === record.key);
        }
        const selectedRowKeys = rowSummary.map((row) => {
            return row.key;
        });
        this.setState({
            selectedDatas: rowSummary,
            selectedRowKeys,
        });
    };

    onSelectAll = (selected, rows) => {
        const { dataSource } = this.state;
        if (selected) {
            rowSummary = _.uniq(
                _.concat(
                    _.filter(rows, (item) => item),
                    rowSummary,
                ),
            );
        } else {
            _.remove(rowSummary, (o) => _.find(dataSource, { key: o.key }));
        }
        let selectedRowKeys = rowSummary.map((row) => {
            return row.key;
        });
        this.setState({
            selectedDatas: rowSummary,
            selectedRowKeys,
        });
    };
    handleOk = () => {
        this.props.handleOk(rowSummary, false);
    };
    handleCancel = () => {
        this.props.handleCancel(false);
    };

    getList = async (params) => {
        const { professionalList, vendorList, neTypeList, region, provinceName } = this.state;
        const { currentSelectedCondition } = this.props;
        const defParms = {};
        let funGetList = getAlarmTitleList;
        switch (currentSelectedCondition.enumName) {
            case 'alarm_title':
                funGetList = getAlarmTitleList;
                if (!_.isEmpty(params.title) && this.getByteLen(params.title) < 8) {
                    message.error('告警标题模糊查询字符长度至少为 8 (中文单字符长度为 2, 英文单字符长度为 1)');
                    return {
                        success: true,
                        total: 0,
                        data: [],
                    };
                }
                if (!params.professionalType) {
                    defParms.professionalType = professionalList[0].key;
                }
                if (!params.vendor) {
                    defParms.vendor = vendorList[0].key;
                }
                // if (!params.neType) {
                //     defParms.neType = neTypeList[0].key;
                // }
                break;
            case 'site_no':
                funGetList = getSiteNoList;
                if (!params.region) {
                    defParms.province = provinceName;
                    defParms.region = region[0].value;
                }
                if (!params.province) {
                    defParms.province = provinceName;
                }
                break;
            default:
                break;
        }
        const res = await funGetList({ ...defParms, ...params });
        if (res && Array.isArray(res.data) && res.data.length > 0) {
            const list = res.data.map((item) => {
                switch (currentSelectedCondition.enumName) {
                    case 'alarm_title':
                        return {
                            ...item,
                            key: item.titleId,
                            value: item.title,
                        };

                    case 'site_no':
                        return {
                            ...item,
                            key: item.siteId,
                            value: item.siteName,
                        };

                    default:
                        return item;
                }
            });
            this.setState({ dataSource: list });
            return {
                success: true,
                total: res.total,
                data: list,
            };
        }
        this.setState({ dataSource: [] });
        return {
            success: true,
            total: 0,
            data: [],
        };
    };
    // 获取字符串长度
    getByteLen = (val) => {
        let len = 0;
        for (let i = 0; i < val.length; i += 1) {
            const a = val.charAt(i);
            if (this.isChinese(a)) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    };

    isChinese = (temp) => {
        const re = /[^\u4E00-\u9FA5]/;
        if (re.test(temp)) return false;
        return true;
    };
    beforeSearchSubmit = (params) => {
        // const { professionalList, vendorList, neTypeList } = this.state;
        // const { currentSelectedCondition } = this.props;
        // switch (currentSelectedCondition.enumName) {
        //     case 'alarm_title':
        //         if (!params.professionalType) {
        //             const defParm = { professionalType: professionalList[0]?.key, vendor: vendorList[0]?.key, neType: neTypeList[0]?.key };
        //             return { ...defParm, ...params };
        //         }
        //         break;
        //     case 'site_no':
        //         break;
        //     default:
        //         break;
        // }
        return params;
    };
    render() {
        const { title, dataSource, pagination, selectedRowKeys, columns } = this.state;
        const { rightValues, visible } = this.props;
        return (
            <Modal
                title={title}
                width={750}
                zIndex={1002}
                centered
                visible={visible}
                onCancel={this.handleCancel}
                footer={<CustomModalFooter onCancel={this.handleCancel} onOk={this.handleOk} />}
            >
                <div style={{ height: '470px' }}>
                    <VirtualTable
                        rowKey="key"
                        global={window}
                        tableAlertRender={false}
                        rowSelection={{
                            type: 'checkbox',
                            columnWidth: '10px',
                            selectedRowKeys,
                            //   onChange: this.onSelectChange,
                            onSelect: this.onSelect,
                            onSelectAll: this.onSelectAll,
                            getCheckboxProps: () => ({}),
                        }}
                        manualRequest={true}
                        search={{
                            optionRender: ({ searchText }, { form }) => {
                                return [
                                    <Button
                                        key="searchText"
                                        type="primary"
                                        onClick={() => {
                                            form?.submit();
                                        }}
                                    >
                                        {searchText}
                                    </Button>,
                                ];
                            },
                            span: 8,

                            collapseRender: false,
                        }}
                        searchCollapsed={false}
                        // beforeSearchSubmit={this.beforeSearchSubmit}
                        request={this.getList}
                        options={false}
                        bordered
                        columns={columns}
                    />
                </div>
            </Modal>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(AddAlarmTitle);
