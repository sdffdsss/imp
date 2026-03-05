/* eslint-disable no-lonely-if */
import React, { PureComponent, Fragment } from 'react';
import { _ } from 'oss-web-toolkits';
import { Spin } from 'oss-ui';
import request from '@Common/api';
import Y2S from './Y2S';
import H2M from './H2M';
import StringCondition from './reg-exp';
import CommaInteger from './comma-integer';
import NumberCondition from './number-condition';
import WebTuples from './web-tuples';
import AlarmTitleId from './alarm-title-id';
import './index.less';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

class Index extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dictData: [], // 枚举字典数据
            pageInfo: { total: 0, current: 1, pageSize: 50 },
            componentsList: {
                normalCondition: CommaInteger, // 普通多选条件
                stringCondition: StringCondition, // 字符串类型 高级条件
                numberCondition: NumberCondition,
                H2M,
                Y2S,
                webTuples: WebTuples, // 网元组类型 高级条件
                AlarmTitleId, // 告警标题ID
            },
            searchKey: '',
            loading: false,
        };

        this.onSearch = _.debounce(this.onSearch, 500);
    }

    componentDidMount() {
        const { currentSelectedCondition } = this.props;
        if (currentSelectedCondition && currentSelectedCondition.valueSize > 0) {
            this.getDictData();
        }
    }
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
    getDictData = (current, pageSize) => {
        const {
            currentSelectedCondition,
            login: { userId, userInfo, systemInfo },
        } = this.props;

        const provinceId = this.getInitialProvince(systemInfo?.currentZone?.zoneId, userInfo);

        this.setState({
            loading: true,
        });
        // if(currentSelectedCondition.enumName === 'province_id'){
        //     request('group/findProvinces', {
        //         type: 'post',
        //         baseUrlType: 'groupUrl',
        //         showSuccessMessage: false,
        //         defaultErrorMessage: '获取省份数据失败',
        //         data: {
        //             creator: userId,
        //         },
        //     }).then((res) => {
        //         if (res && res.length) {
        //             this.setState({
        //                 dictData: res.map(item=>{
        //                     return {
        //                         key:item.regionId,
        //                         value:item.regionName
        //                     }
        //                 }),
        //                 loading: false,
        //                 pageInfo: {
        //                     total: res.length,
        //                     current: 1,
        //                     pageSize: 50,
        //                 },
        //             });

        //         }  else {
        //             this.setState({
        //                 dictData: [],
        //                 loading: false,
        //                 pageInfo: {
        //                     total: 0,
        //                     current: 1,
        //                     pageSize: 50,
        //                 },
        //             });
        //         }
        //     })
        //     .catch(() => {
        //         this.setState({
        //             dictData: [],
        //             loading: false,
        //             pageInfo: {
        //                 total: 0,
        //                 current: 1,
        //                 pageSize: 50,
        //             },
        //         });

        //     })
        //     return;
        // }
        const params = {
            modelId: 2,
            dictName: currentSelectedCondition.enumName,
            value: this.state.searchKey || '',
            current: current || 1,
            pageSize: pageSize || 50,
            creator: userId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
        };
        if (currentSelectedCondition.enumName === 'region_id' || currentSelectedCondition.enumName === 'city_id') {
            params.provinceId = provinceId;
        }
        if (currentSelectedCondition.enumName === 'province_id') {
            params.hasAdditionZone = false;
        }
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: params,
        })
            .then((res) => {
                if (res && Array.isArray(res.data) && res.data.length > 0) {
                    let dictData = res.data;
                    if (
                        currentSelectedCondition.enumName === 'province_id' &&
                        JSON.parse(userInfo)?.zones[0]?.zoneLevel !== '1' &&
                        !systemInfo?.currentZone?.zoneId
                    ) {
                        dictData = res.data.filter((item) => item.key === JSON.parse(userInfo)?.zones[0]?.zoneLevel_2Id);
                    }
                    this.setState({
                        dictData,
                        loading: false,
                        pageInfo: {
                            total: res.total,
                            current: res.current,
                            pageSize: res.pageSize,
                        },
                    });
                } else {
                    this.setState({
                        dictData: [],
                        loading: false,
                        pageInfo: {
                            total: 0,
                            current: 1,
                            pageSize: 50,
                        },
                    });
                }
            })
            .catch(() => {
                this.setState({
                    dictData: [],
                    loading: false,
                    pageInfo: {
                        total: 0,
                        current: 1,
                        pageSize: 50,
                    },
                });
            });
    };

    componentDidUpdate(prevProps) {
        if (
            JSON.stringify(this.props.currentSelectedCondition) !== JSON.stringify(prevProps.currentSelectedCondition) &&
            this.props.currentSelectedCondition.valueSize
        ) {
            this.getDictData();
        }
    }

    onSearch = ({ value, current, pageSize }) => {
        this.setState({ searchKey: value || '' }, () => {
            this.getDictData(current, pageSize);
        });
    };

    render() {
        const { dictData, componentsList, loading, pageInfo } = this.state;
        const {
            currentSelectedCondition,
            onConditionDataChange,
            rightValues,
            FILTER_EMUN,
            login: { userId, userInfo },
            hasDefaultValue,
            moduleId,
        } = this.props;
        let ConditionComponent;
        // 普通多选条件
        if (currentSelectedCondition.valueSize > 0) {
            //普通条件里面添加告警标题ID特殊处理
            if (currentSelectedCondition.enumName === 'alarm_title' || currentSelectedCondition.enumName === 'site_no') {
                // if (currentSelectedCondition.enumName === 'site_no') {
                ConditionComponent = componentsList.AlarmTitleId;
            } else {
                ConditionComponent = componentsList.normalCondition;
            }
        } else {
            if (currentSelectedCondition.enableSelectGroup === 1) {
                ConditionComponent = componentsList.webTuples;
            } else {
                // 字符串类型 高级条件
                if (currentSelectedCondition.dataType === 'string') {
                    ConditionComponent = componentsList.stringCondition;
                }
                // 数字类型 高级条件
                else if (
                    currentSelectedCondition.dataType === 'integer' ||
                    currentSelectedCondition.dataType === 'long' ||
                    currentSelectedCondition.dataType === 'double'
                ) {
                    ConditionComponent = componentsList.numberCondition;
                }
                // 小时:分钟 高级条件
                else if (currentSelectedCondition.dataType === 'time') {
                    ConditionComponent = componentsList.H2M;
                }
                // 年:月:日 小时:分钟 高级条件
                else if (currentSelectedCondition.dataType === 'date') {
                    ConditionComponent = componentsList.Y2S;
                } else {
                    // ConditionComponent = <Empty></Empty>;
                    ConditionComponent = <span />;
                }
            }
        }

        // 右侧暂时禁用
        const disabled = _.findIndex(rightValues, { fieldName: currentSelectedCondition.fieldName }) === -1;
        return (
            <Fragment>
                <Spin spinning={loading} delay={100} tip="加载中，请稍后...">
                    <ConditionComponent
                        dictData={dictData}
                        pageInfo={pageInfo}
                        onConditionDataChange={onConditionDataChange}
                        onSearch={({ value, current, pageSize }) => this.onSearch({ value, current, pageSize })}
                        rightValues={rightValues}
                        currentSelectedCondition={currentSelectedCondition}
                        disabled={disabled}
                        FILTER_EMUN={FILTER_EMUN}
                        userId={userId}
                        userInfo={JSON.parse(userInfo)}
                        hasDefaultValue={hasDefaultValue}
                        moduleId={moduleId}
                    />
                </Spin>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
