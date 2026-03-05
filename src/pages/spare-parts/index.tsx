// import React,{useEffect,useState}from 'react';
import React, { PureComponent } from 'react';
import { Select } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { _ } from 'oss-web-toolkits';
import { Api } from './api';

import { VirtualTable } from 'oss-web-common';
import './style.less';
interface Props {
    login: {
        userId: any;
        systemInfo: any;
    };
}
interface States {
    provinceList: any[];
    provinceId: string;
    regionList: any[];
    modelParts: any[];
    columns: any[];
    loading: boolean;
}
class SpareParts extends PureComponent<Props, States> {
    formRef: any = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            provinceList: [],
            regionList: [],
            modelParts: [],
            columns: [],
            provinceId: '',
        };
    }
    componentDidMount() {
        this.initData();
    }
    initData = () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        Promise.all([Api.getProvinceData(userId), Api.getSparePartsModel(userId)]).then((res) => {
            if (res) {
                let provinceList = res[0] || [];
                provinceList = provinceList.filter((item) =>
                    systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                );
                const provinceId = provinceList[0].regionId;
                const modelParts = res[1]?.rows || [];
                Api.getProvinceRegions(provinceId, userId).then((regionList) => {
                    this.setState({ provinceList, regionList, modelParts, provinceId }, () => {
                        this.getColumns();
                        if (this.formRef && this.formRef.current) {
                            this.formRef.current.submit();
                        }

                        // this.getList({ current: 1, pageSize: 20 }, null);
                    });
                });
            }
        });
    };
    selectprovince = (provinceId) => {
        const {
            login: { userId },
        } = this.props;
        Api.getProvinceRegions(provinceId, userId).then((regionList) => {
            this.setState({ regionList, provinceId }, () => {
                this.getColumns();
            });
        });
    };
    getColumns = () => {
        const { provinceList, provinceId, regionList, modelParts } = this.state;
        const columns = [
            {
                title: '序号',
                align: 'center',
                dataIndex: 'num',
                hideInSearch: true,
                ellipsis: true,
                width: 60,
            },

            {
                title: '省份',
                align: 'left',
                dataIndex: 'provinceId',
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select
                            showSearch
                            onChange={(value) => {
                                this.selectprovince(value);
                            }}
                            defaultValue={provinceId}
                            optionFilterProp="children"
                        >
                            {provinceList.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
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
                dataIndex: 'regionId',
                hideInTable: true,
                width: 10,
                renderFormItem: () => {
                    return (
                        <Select showSearch placeholder="全部" mode="multiple" maxTagCount="responsive" allowClear optionFilterProp="children">
                            {regionList.map((item) => {
                                return (
                                    <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                        {item.regionName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '物资名称',
                align: 'center',
                dataIndex: 'name',
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '省份',
                align: 'center',
                dataIndex: 'provinceName',
                hideInSearch: true,
                width: 60,
                sorter: true,
            },
            {
                title: '地市',
                align: 'center',
                dataIndex: 'regionName',
                hideInSearch: true,
                width: 60,
                sorter: true,
            },
            {
                title: '物资型号',
                align: 'center',
                dataIndex: 'model',
                ellipsis: true,
                width: 300,
                sorter: true,
                renderFormItem: () => {
                    return (
                        <Select showSearch placeholder="全部" mode="multiple" maxTagCount="responsive" allowClear optionFilterProp="children">
                            {modelParts.map((item) => {
                                return (
                                    <Select.Option value={item.model} key={item.model} label={item.model}>
                                        {item.model}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                },
            },
            {
                title: '单位',
                align: 'center',
                dataIndex: 'unit',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '数量',
                align: 'center',
                dataIndex: 'amount',
                hideInSearch: true,
                width: 60,
                sorter: true,
            },
            {
                title: '单据类型',
                align: 'center',
                dataIndex: 'orderType',
                hideInSearch: true,
                width: 90,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '到货时间',
                align: 'center',
                dataIndex: 'arrivalTime',
                hideInSearch: true,
                ellipsis: true,
                width: 150,
                sorter: true,
            },
            {
                title: '供货商',
                align: 'center',
                dataIndex: 'supplier',
                hideInSearch: true,
                width: 190,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '物资大类',
                align: 'center',
                dataIndex: 'bigClass',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '物资小类',
                align: 'center',
                dataIndex: 'smallClass',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '合同号',
                align: 'center',
                dataIndex: 'contractNumber',
                hideInSearch: true,
                width: 250,
                sorter: true,
            },
            {
                title: '核算日期',
                align: 'center',
                dataIndex: 'accountingDate',
                hideInSearch: true,
                width: 150,
                sorter: true,
            },
            {
                title: '操作类型',
                align: 'center',
                dataIndex: 'operationType',
                hideInSearch: true,
                width: 120,
                sorter: true,
            },
            {
                title: '物资编码',
                align: 'center',
                dataIndex: 'code',
                hideInSearch: true,
                width: 240,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '单据编号',
                align: 'center',
                dataIndex: 'orderNumber',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
                sorter: true,
            },
            {
                title: '仓库',
                align: 'center',
                dataIndex: 'storehouse',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
                sorter: true,
            },
            {
                title: '分区',
                align: 'center',
                dataIndex: 'subregion',
                hideInSearch: true,
                width: 120,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '货位',
                align: 'center',
                dataIndex: 'allocation',
                hideInSearch: true,
                width: 60,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '经办人',
                align: 'center',
                dataIndex: 'operator',
                hideInSearch: true,
                width: 90,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '批号',
                align: 'center',
                dataIndex: 'batchNumber',
                hideInSearch: true,
                ellipsis: true,
                width: 90,
                sorter: true,
            },
            {
                title: '库管员',
                align: 'center',
                dataIndex: 'storeKeeper',
                hideInSearch: true,
                ellipsis: true,
                width: 90,
                sorter: true,
            },
            {
                title: '物资保管员',
                align: 'center',
                dataIndex: 'curator',
                hideInSearch: true,
                ellipsis: true,
                width: 120,
                sorter: true,
            },
            {
                title: '备注',
                align: 'center',
                dataIndex: 'remark',
                hideInSearch: true,
                ellipsis: true,
                width: 260,
                sorter: true,
            },
        ];
        this.setState({ columns });
    };
    getList = (params, sorter) => {
        const { provinceId } = this.state;
        const { current, pageSize, regionId, model, name } = params;
        const data = {
            provinceId,
            regionId: null,
            sparePartsModel: null,
            sparePartsName: name,
            pageNum: current,
            pageSize,
            orderType: 'desc',
            orderFieldName: 'arrivalTime',
        };

        if (!_.isEmpty(sorter)) {
            const orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                data.orderType = 'asc';
            } else {
                data.orderType = 'desc';
            }
            data.orderFieldName = Object.keys(sorter).toString();
        }
        if (regionId) {
            data.regionId = regionId.join(',');
        }
        if (model) {
            data.sparePartsModel = model.join(',');
        }
        this.setState({ loading: true });
        return Api.getSparePartsList(data)
            .then((res) => {
                if (res && Array.isArray(res.rows)) {
                    this.setState({ loading: false });
                    return {
                        success: true,
                        total: res.total,
                        data: res.rows,
                    };
                } else {
                    this.setState({ loading: false });
                    return {
                        success: true,
                        total: 0,
                        data: [],
                    };
                }
            })
            .catch(() => {
                this.setState({ loading: false });
                return {
                    success: true,
                    total: 0,
                    data: [],
                };
            });
    };
    render() {
        const { columns, loading } = this.state;
        return (
            <div className="spare-parts-page">
                <VirtualTable
                    rowKey="num"
                    global={window}
                    tableAlertRender={false}
                    manualRequest={true}
                    loading={loading}
                    scroll={{
                        x: 300,
                    }}
                    search={{
                        // optionRender: ({ searchText }, { form }) => {
                        //     return [
                        //         <Button
                        //             key="searchText"
                        //             type="primary"
                        //             onClick={() => {
                        //                 form?.submit();
                        //             }}
                        //         >
                        //             {searchText}
                        //         </Button>,
                        //     ];
                        // },
                        span: 4,
                        labelWidth: 60,
                        collapseRender: false,
                    }}
                    searchCollapsed={false}
                    request={this.getList}
                    // options={false}
                    bordered
                    columns={columns}
                    formRef={this.formRef}
                />
            </div>
        );
    }
}
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(SpareParts);
