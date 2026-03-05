import React, { Fragment } from 'react';
import { withModel } from 'hox';
import { Form, Row, Col, Input, Select, Button, Space } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';
import RuleBaseList from '../rule-base-list';
import './style.less';

class RuleBaselist extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            provinceData: [], //查询省份下拉数据
            regionId: [],
            searchKey: '',
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
            },
            ruleType: '',
        };
    }

    componentDidMount() {
        this.getProvinceData();

        if (this.props.location.state.radioType === 'provinces') {
            if (this.props.location.state?.row) {
                this.setState(
                    {
                        regionId: [this.props.location.state?.row?.provinceId?.toString()],
                    },
                    () => {
                        this.getRuleBase();
                    },
                );
            } else {
                this.getRuleBase();
            }
        } else if (this.props.location.state.radioType === 'type') {
            if (this.props.location.state?.row?.ruleType) {
                this.setState(
                    {
                        ruleType: this.props.location.state?.row?.ruleType,
                    },
                    () => {
                        this.getRuleBase();
                    },
                );
            } else {
                this.getRuleBase();
            }
        }
    }

    // 获取首页数据
    getRuleBase = () => {
        const { searchKey, regionId, pagination, ruleType } = this.state;
        request('rule/base/v1/page', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取列表数据失败',
            data: {
                dimensionType: 3,
                pageNo: pagination.current,
                pageSize: pagination.pageSize,
                provinceId: regionId && regionId[0] ? regionId : [],
                filterName: searchKey,
                ruleType,
            },
        }).then((res) => {
            const list = res.data;
            this.setState({
                dataSource: list,
                pagination: {
                    current: res.current,
                    pageSize: res.pageSize,
                    total: res.total,
                },
            });
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
                //  list.unshift({ regionId: '', regionName: '全部' });
                this.setState({
                    provinceData: list,
                });
            }
        });
    };

    getDataSource = () => {
        this.setState({
            dataSource: [
                {
                    xh: 1,
                    gzmc: '111',
                    sf: '111',
                    cjr: '1111',
                    lx: '111',
                    yycs: 111,
                    cjsj: '11',
                },
            ],
        });
    };

    onSearchClick = () => {
        this.getRuleBase();
    };

    onBackClick = () => {
        this.props?.history.push({ pathname: '../rule-base', state: { radioType: this.props.location.state?.radioType } });
    };

    onInputChange = (e) => {
        this.setState({
            searchKey: e.target.value,
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
        const { regionId, provinceData, searchKey, dataSource, pagination } = this.state;
        const {
            login: { systemInfo },
        } = this.props;
        return (
            <Fragment>
                <div className="rule-base-wrapper">
                    <div style={{ padding: '20px 0  ' }}>
                        <Form name="basic">
                            <Row>
                                <Col span={4}>
                                    <Form.Item label="规则名称" style={{ marginBottom: 0, marginLeft: '20px' }}>
                                        <Input placeholder="请输入规则名称" value={searchKey} onChange={this.onInputChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={1} />
                                <Col span={4}>
                                    <Form.Item label="省份" style={{ marginBottom: 0 }}>
                                        <Select
                                            onChange={this.handleProvinceChange}
                                            style={{ width: '100%' }}
                                            value={regionId}
                                            mode={this.props.location.state.radioType === 'provinces' ? '' : 'multiple'}
                                            maxTagCount={1}
                                            placeholder="全部"
                                            filterOption={(item, itm) => {
                                                return itm.children?.includes(item);
                                            }}
                                        >
                                            {this.props.location.state?.radioType === 'type'
                                                ? provinceData.map((item) => (
                                                      <Select.Option key={item.regionId} value={item.regionId}>
                                                          {item.regionName}
                                                      </Select.Option>
                                                  ))
                                                : provinceData
                                                      .filter((item) => this.props.location.state?.row?.provinceId?.toString() === item.regionId)
                                                      .map((item) => (
                                                          <Select.Option key={item.regionId} value={item.regionId}>
                                                              {item.regionName}
                                                          </Select.Option>
                                                      ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={2}>
                                    <Form.Item name="ownerType" style={{ marginBottom: 0, marginLeft: '20px' }}>
                                        <Space>
                                            <Button type="primary" onClick={this.onSearchClick.bind(this, null)} htmlType="submit">
                                                查询
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col span={11} />
                                <Col span={1}>
                                    <Button onClick={this.onBackClick.bind(this, null)}>返回</Button>
                                </Col>
                                <Col span={1} />
                            </Row>
                        </Form>
                    </div>
                    <div style={{ height: window.innerHeight - 170 }}>
                        <RuleBaseList
                            dataSource={dataSource}
                            pagination={pagination}
                            type={'details'}
                            history={this.props.history}
                            getRuleBase={this.getRuleBase}
                            onPageChange={this.onPageChange}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(RuleBaselist);
