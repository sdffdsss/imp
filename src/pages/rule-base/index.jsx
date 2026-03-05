import React, { Fragment } from 'react';
import { withModel } from 'hox';
import { Button, Row, Col, Radio, Form, Select, Input, Space, Card, Modal, Tooltip } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';
import './style.less';
import constants from '@Common/constants';
import RuleBaseList from './rule-base-list';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import { logNew } from '@Common/api/service/log';

class RuleBase extends React.PureComponent {
    constructor(props) {
        super(props);
        this.actionRef = React.createRef();
        this.state = {
            radioType: 'type',
            provinceData: [], //查询省份下拉数据
            regionId: [],
            ruleList: [], //查询规则下来数据
            ruleId: '',
            searchKey: '',
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
            },
            typeList: [], //类型列表数据
            provinceList: [], //省份列表数据
            usedCount: 0, //常用计数
        };
    }

    componentDidMount() {
        if (this.props.location?.state?.radioType === 'provinces') {
            this.setState(
                {
                    radioType: 'provinces',
                },
                () => {
                    this.getProvinceData();
                    this.getRuleData();
                    this.getRuleBase();
                },
            );
        } else if (this.props.location?.state?.radioType === 'type') {
            this.setState(
                {
                    radioType: 'type',
                },
                () => {
                    this.getProvinceData();
                    this.getRuleData();
                    this.getRuleBase();
                },
            );
        } else {
            this.getProvinceData();
            this.getRuleData();
            this.getRuleBase();
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.location?.state?.radioType === 'provinces') {
    //         this.setState({
    //             radioType: 'provinces',
    //         });
    //     } else if (this.props.location?.state?.radioType === 'type') {
    //         this.setState({
    //             radioType: 'type',
    //         });
    //     }
    // }

    // 获取首页数据
    getRuleBase = () => {
        const { searchKey, regionId, radioType, pagination, ruleId } = this.state;
        const { login } = this.props;
        let provinceId = [];
        if (radioType === 'type') {
            provinceId = [this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo).toString()];
        } else {
            provinceId = regionId && regionId[0] ? regionId : [];
        }
        request('rule/base/v1/page', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取列表数据失败',
            data: {
                dimensionType: radioType === 'type' ? 1 : radioType === 'provinces' ? 2 : 3,
                pageNo: radioType === 'type' || radioType === 'provinces' ? 1 : pagination.current,
                pageSize: radioType === 'type' || radioType === 'provinces' ? 100 : pagination.pageSize,
                provinceId,
                filterName: searchKey,
                ruleType: ruleId,
            },
        }).then((res) => {
            const list = res.data;
            if (list && radioType === 'type') {
                let usedCount = 0;
                list.forEach((item) => {
                    if (item.isCommonUse === 1) {
                        usedCount = usedCount + 1;
                    }
                });
                this.setState({
                    typeList: list,
                    usedCount,
                });
            }
            if (list && radioType === 'provinces') {
                this.setState({
                    provinceList: list,
                });
            }
            if (list && radioType === 'rules') {
                this.setState({
                    dataSource: list,
                    pagination: {
                        current: res.current,
                        pageSize: res.pageSize,
                        total: res.total,
                    },
                });
            } else {
                this.setState({
                    dataSource: [],
                    pagination: {
                        current: 1,
                        pageSize: 20,
                        total: 0,
                    },
                });
            }
        });
    };

    // 获取规则类型
    getRuleData = () => {
        request('rule/base/v1/getRuleTypes', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取规则类型失败',
            data: {
                provinceId: 0,
            },
        }).then((res) => {
            if (res && res.code === 200) {
                const list = res.data;
                list.unshift({ id: '', desc: '全部' });
                this.setState({
                    ruleList: list,
                });
            }
        });
    };

    // 获取归属省份
    getProvinceData = () => {
        const {
            login: { userId },
        } = this.props;
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: 0,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const list = res;
                // list.unshift({ regionId: '', regionName: '全部' });
                this.setState({
                    provinceData: list,
                });
            }
        });
    };

    handleProvinceChange = (e) => {
        // const { regionId } = this.state;
        // if (regionId?.toString() === '' && e.toString() !== '') {
        //     this.setState({
        //         regionId: e.filter((item) => item !== ''),
        //     });
        //     return;
        // }
        // if (e.find((item) => item === '') === '') {
        //     this.setState({
        //         regionId: [''],
        //     });
        //     return;
        // }
        this.setState({
            regionId: e,
        });
    };

    handleRuleChange = (e) => {
        this.setState({
            ruleId: e,
        });
    };

    onChangeRadio = (e) => {
        const field = {
            type: '500172',
            provinces: '500173',
            rules: '500174',
        };
        const fieldName = {
            type: '规则库类型查询',
            provinces: '规则库省份查询',
            rules: '规则库规则查询',
        };

        console.log(e);
        logNew(fieldName[e.target.value], field[e.target.value]);
        this.setState(
            {
                radioType: e.target.value,
            },
            () => {
                this.getRuleBase();
            },
        );
    };

    onInputChange = (e) => {
        this.setState({
            searchKey: e.target.value,
        });
    };

    onSearchClick = () => {
        this.getRuleBase();
    };

    showRuleDetails = (row) => {
        this.props?.history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/rule-base/rule-base-details`,
            state: { row: row, radioType: this.state.radioType },
        });
    };

    /**
     * @description: 设置常用
     * @param {*}
     * @return {*}
     */

    setCommonUseGroup = (val, provinceId, ruleType) => {
        const { usedCount } = this.state;

        if (val === 1) {
            sendLogFn({ authKey: 'MonitoringScheduling-Rule-SetUse' });
            logNew(`设置常用`, '500170');
            if (usedCount > 4) {
                Modal.warning({
                    title: '最多设置五种常用类型',
                });
            } else {
                Modal.confirm({
                    title: '提示',
                    content: '是否确认更改常用？',
                    onOk: () => {
                        this.setCommonUse(val, provinceId, ruleType);
                    },
                    onCancel() {},
                });
            }
        } else {
            sendLogFn({ authKey: 'MonitoringScheduling-Rule-Unuse' });
            logNew(`取消常用`, '500171');
            Modal.confirm({
                title: '提示',
                content: '是否确认更改常用？',
                onOk: () => {
                    this.setCommonUse(val, provinceId, ruleType);
                },
                onCancel() {},
            });
        }
    };

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    setCommonUse = (val, provinceId, ruleType) => {
        const { login } = this.props;
        request('/rule/base/v1/updateRuleBase/used', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '操作失败',
            data: {
                isCommonUse: val,
                provinceId: Number.parseInt(this.getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo)),
                ruleType,
            },
        }).then((res) => {
            if (res) {
                this.getRuleBase();
            }
        });
    };

    onPageChange = (page) => {
        this.setState(
            {
                pagination: {
                    current: page.current,
                    pageSize: page.pageSize,
                    total: page.total,
                },
            },
            () => {
                this.getRuleBase();
            },
        );
    };

    render() {
        const { radioType, regionId, provinceData, searchKey, dataSource, pagination, typeList, provinceList, ruleList, ruleId } = this.state;

        return (
            <Fragment>
                <div className="rule-base-wrapper">
                    <div style={{ padding: '20px 24px  ' }} className="rule-select-wrapper">
                        <Form name="basic">
                            <Row>
                                {radioType === 'type' && (
                                    <Fragment>
                                        <Col span={4}>
                                            <Form.Item label={radioType === 'type' ? '类型名称' : '规则名称'} style={{ marginBottom: 0 }}>
                                                <Select onChange={this.handleRuleChange} style={{ width: '100%' }} value={ruleId}>
                                                    {ruleList.map((item) => (
                                                        <Select.Option key={item.id} value={item.id}>
                                                            {item.desc}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Fragment>
                                )}
                                {radioType === 'rules' && (
                                    <Col span={4}>
                                        <Form.Item label={radioType === 'type' ? '类型名称' : '规则名称'} style={{ marginBottom: 0 }}>
                                            <Input
                                                placeholder={radioType === 'type' ? '请输入类型名称' : '请输入规则名称'}
                                                value={searchKey}
                                                onChange={this.onInputChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                )}
                                {radioType === 'rules' && <Col span={1} />}
                                {(radioType === 'provinces' || radioType === 'rules') && (
                                    <Col span={4}>
                                        <Form.Item label="省份" style={{ marginBottom: 0 }}>
                                            <Select
                                                onChange={this.handleProvinceChange}
                                                style={{ width: '100%' }}
                                                value={regionId}
                                                mode="multiple"
                                                maxTagCount={1}
                                                placeholder="全部"
                                                filterOption={(item, itm) => {
                                                    return itm.children?.includes(item);
                                                }}
                                            >
                                                {provinceData.map((item) => (
                                                    <Select.Option key={item.regionId} value={item.regionId}>
                                                        {item.regionName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}
                                <Col span={2}>
                                    <Form.Item name="ownerType" style={{ marginBottom: 0, marginLeft: '20px' }}>
                                        <Space>
                                            <Button type="primary" onClick={this.onSearchClick.bind(this, null)} htmlType="submit">
                                                查询
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>

                                {radioType === 'provinces' && <Col span={13} />}
                                {radioType === 'type' && <Col span={13} />}
                                {radioType === 'rules' && <Col span={8} />}
                                <Col span={5} style={{ textAlign: 'end' }}>
                                    <Radio.Group value={radioType} onChange={this.onChangeRadio} buttonStyle="solid">
                                        <Radio.Button value="type" className="radio-check">
                                            类型
                                        </Radio.Button>
                                        <Radio.Button value="provinces" className="radio-check">
                                            省份
                                        </Radio.Button>
                                        <Radio.Button value="rules" className="radio-check">
                                            规则
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="rule-card-wrapper">
                        {radioType === 'type' && (
                            <Row className="rule-card-type" gutter={[16, 16]}>
                                {typeList.map((item) => {
                                    return (
                                        <Col span={4}>
                                            <Card
                                                headStyle={{ borderBottom: '0' }}
                                                bordered={true}
                                                style={{
                                                    height: 170,
                                                    borderRadius: '10px',
                                                    border: '1px solid #A0CDF2',
                                                    boxShadow: '2px 2px 10px rgb(117,139,155,0.2)',
                                                }}
                                                cover={
                                                    <Fragment>
                                                        <div>
                                                            <span className="rule-card-wrapper-title">{item.ruleTypeDesc}</span>
                                                            {item.isCommonUse === 1 && (
                                                                <Button
                                                                    type="primary"
                                                                    tmlType="submit"
                                                                    style={{ width: '60px', float: 'right', borderRadius: '0 6px', height: '30px' }}
                                                                >
                                                                    常用
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </Fragment>
                                                }
                                            >
                                                <div className="rule-card-wrappe-content" onClick={this.showRuleDetails.bind(this, item)}>
                                                    <Tooltip title={item.ruleTypeText}>{item.ruleTypeText}</Tooltip>
                                                </div>
                                                <div className="rule-card-wrappe-foot">
                                                    <Row style={{ height: '100%' }}>
                                                        <Col span={9} onClick={this.showRuleDetails.bind(this, item)}>
                                                            <Row style={{ height: '70%' }}>
                                                                <Col span={24}>
                                                                    <span className="rule-card-wrappe-num">{item.citations}</span>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ height: '30%' }}>
                                                                <Col span={24}>
                                                                    <span className="rule-card-wrappe-name">引用次数</span>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={9} onClick={this.showRuleDetails.bind(this, item)}>
                                                            <Row style={{ height: '70%' }}>
                                                                <Col span={24}>
                                                                    <span className="rule-card-wrappe-num">{item.ruleCount}</span>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ height: '30%' }}>
                                                                <Col span={24}>
                                                                    <span className="rule-card-wrappe-name">规则个数</span>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6} style={{ margin: 'auto' }}>
                                                            {item.isCommonUse === 1 && (
                                                                <Button
                                                                    style={{
                                                                        color: '#4990e2',
                                                                        border: '1px solid #4990e2',
                                                                        borderRadius: ' 4px',
                                                                        position: 'absolute',
                                                                        top: '2px',
                                                                        right: '2px',
                                                                    }}
                                                                    onClick={this.setCommonUseGroup.bind(this, 2, item.provinceId, item.ruleType)}
                                                                >
                                                                    取消常用
                                                                </Button>
                                                            )}
                                                            {item.isCommonUse === 2 && (
                                                                <Button
                                                                    style={{
                                                                        color: '#4990e2',
                                                                        border: '1px solid #4990e2',
                                                                        borderRadius: ' 4px',
                                                                        position: 'absolute',
                                                                        top: '2px',
                                                                        right: '2px',
                                                                    }}
                                                                    onClick={this.setCommonUseGroup.bind(this, 1, item.provinceId, item.ruleType)}
                                                                >
                                                                    设置常用
                                                                </Button>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                        {radioType === 'provinces' && (
                            <div className="rule-card-provinces">
                                <Row gutter={[16, 16]}>
                                    {provinceList.map((item) => {
                                        return (
                                            <Col span={4}>
                                                <Card
                                                    onClick={this.showRuleDetails.bind(this, item)}
                                                    headStyle={{ borderBottom: '0' }}
                                                    bordered={true}
                                                    style={{
                                                        height: 140,
                                                        borderRadius: '10px',
                                                        border: '1px solid #A0CDF2',
                                                        boxShadow: '2px 2px 10px rgb(117,139,155,0.2)',
                                                    }}
                                                >
                                                    <div className="rule-card-provinces-name">
                                                        <span>{item.provinceName}</span>
                                                    </div>
                                                    <div className="rule-card-provinces-foot">
                                                        <Row style={{ height: '60%' }}>
                                                            <Col span={3} />
                                                            <Col span={11} style={{ margin: 'auto' }}>
                                                                <span className="rule-card-wrappe-num">{item.citations}</span>
                                                            </Col>
                                                            <Col span={10} style={{ margin: 'auto' }}>
                                                                <span className="rule-card-wrappe-num">{item.ruleCount}</span>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ height: '40%' }}>
                                                            <Col span={3} />
                                                            <Col span={11}>
                                                                <span className="rule-card-wrappe-name">引用次数</span>
                                                            </Col>
                                                            <Col span={10}>
                                                                <span className="rule-card-wrappe-name">规则个数</span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        )}
                        {radioType === 'rules' && (
                            <div style={{ height: window.innerHeight - 170 }}>
                                <RuleBaseList
                                    type={'home'}
                                    dataSource={dataSource}
                                    pagination={pagination}
                                    history={this.props.history}
                                    onPageChange={this.onPageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(RuleBase);
