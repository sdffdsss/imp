import React, { useEffect, useState } from 'react';
import { Radio, Select, Form } from 'oss-ui';
import api from '../api';
import useLoginInfoModel from '@Src/hox';
import { mockData } from '../util';
import '../batch-schedul/index.less';

const { Option } = Select;
let current = 1;
let timer = undefined;
const Index = (props) => {
    const login = useLoginInfoModel();
    const { onSaveData, curSelParmExport = {}, mteamInfo, mteamModel, regionList } = props;
    const [radioValue, handleRadioValue] = useState('day');
    const [combineData, handleCombinData] = useState({});
    const [selectData, handleSelectData] = useState([]);
    const [regionId, handleRegionId] = useState(['-1']);
    const [cityList, handleCityList] = useState([]);
    const [userSource, handleUserSource] = useState([{ zhName: '-', userId: '', mobilephone: '' }]);
    const [oldUserSource, handleOldUserSource] = useState([]);
    const [scopeSource, handleScopeSource] = useState([]);
    const [isAllScope, handleAllScope] = useState(false);
    const [hasNextPage, handleHasNextPage] = useState(true);

    const [roleSource, setRoleSource] = useState([]);

    useEffect(() => {
        const obj = {};
        roleSource.forEach((item) => {
            obj[item.id] = {
                id: item.id,
                name: item.name,
                values: {
                    userType: item.id,
                    oldUserId: null,
                    oldUserName: null,
                    oldMobilePhone: null,
                    scopes: null,
                    newDeptId: null,
                    newDeptName: null,
                    newUserId: null,
                    newUserName: null,
                    newMobilePhone: null,
                },
            };
        });

        handleCombinData(obj);
    }, [roleSource]);

    const getSource = () => {
        const { province, professional, region, team } = curSelParmExport;
        api.getOnDutyUsers({
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionId: region?.regionId || mteamInfo?.regionId,
            professionalType: professional?.key || mteamInfo?.professionalId?.toString(),
            ruleType: team?.name || mteamInfo?.mteamName,
            userType: radioValue || '',
            operator: login.userId,
            mteamModel,
        }).then((res) => {
            handleOldUserSource([...res, { userName: '-', userId: '', mobilePhone: '' }]);
        });
    };

    const getDeptSource = (pageNum, vlaue) => {
        api.queryDeptUserInfo({
            //  provinceId: province?.regionId || mteamInfo?.provinceId,
            // regionId: region?.regionId || mteamInfo?.regionId,
            operator: login.userId,
            mteamModel,
            pageNum,
            key: vlaue,
            pageSize: 20,
        }).then((res) => {
            if (res && Array.isArray(res)) {
                // handleUserSource([...res, { zhName: '-', userId: '', mobilephone: '' }]);
                handleUserSource([...userSource, ...res]);
                console.log([...userSource, ...res]);
                if (res.total < pageNum * 20) {
                    handleHasNextPage(false);
                }
            }
        });
    };

    // 获取交接范围
    const getScopeByUser = (params = {}) => {
        const { province, professional, region, team } = curSelParmExport;
        api.getScopeByUser({
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionId: region?.regionId || mteamInfo?.regionId,
            professionalType: professional?.key || mteamInfo?.professionalId?.toString(),
            ruleType: team?.name || mteamInfo?.mteamName,
            userType: radioValue || null,
            userId: params.id || null,
            userName: params.name || '',
            mobilePhone: params.phone || null,
            operator: login.userId,
            mteamModel,
        }).then((res) => {
            handleScopeSource(res);
        });
    };

    useEffect(() => {
        getSource();
        getDeptSource(1);
    }, [radioValue]);

    // 下拉框切换渲染页面
    useEffect(() => {
        const { province, professional, region, team } = curSelParmExport;
        const arr = [];
        Object.keys(combineData).map((item) => {
            return arr.push(combineData[item]);
        });
        handleSelectData(arr);
        onSaveData({
            updateUsers: combineData,
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionIds: regionId || [mteamInfo?.regionId],
            professionalType: professional?.key || mteamInfo?.professionalId?.toString(),
            ruleType: mteamInfo?.mteamName,
            operator: login.userId,
            mteamModel,
        });
    }, [combineData, curSelParmExport, regionId]);

    // 单选框切换
    const onChange = (e) => {
        handleRadioValue(e.target.value);
    };

    useEffect(() => {
        selectData.map((item) => {
            if (item.id === radioValue && item.values?.oldUserId) {
                getScopeByUser({
                    id: item.values.oldUserId,
                    name: item.values.oldusername,
                    phone: item.values.oldmobilephone,
                });
            } else {
                handleScopeSource([]);
            }
        });
    }, [radioValue]);

    // 下拉框切换
    const onSelectChange = (e, type, opt = {}) => {
        let oldData = {};
        let newData = {};
        let scopeData = {};
        if (type === 'oldUserId') {
            // form.setFieldsValue({
            //   oldUserId: e,
            //   oldUserName: opt.oldusername,
            //   oldMobilePhone: opt.oldmobilephone,
            // });
            getScopeByUser({
                id: e,
                name: opt.oldusername === '-' ? '' : opt.oldusername,
                phone: opt.oldmobilephone,
            });
            oldData = {
                oldMobilePhone: opt.oldmobilephone || null,
                oldUserName: opt.oldusername || null,
            };
            scopeData = {
                scopes: null,
            };
        }
        if (type === 'newUserId') {
            newData = {
                newMobilePhone: opt.newmobilephone || null,
                newDeptId: opt.newdeptid || null,
                newDeptName: opt.newdeptname || null,
                newUserName: opt.newusername || null,
            };
        }
        if (type === 'scopes') {
            if (e === ['全部'] || e.length === 0) {
                handleAllScope(true);
                scopeData = {
                    scopes: ['全部'].toString(),
                };
            } else if (e.includes('全部')) {
                handleAllScope(false);
                e.splice(
                    e.findIndex((item) => item === '全部'),
                    1,
                );
                scopeData = {
                    scopes: e.toString(),
                };
            } else {
                scopeData = {
                    scopes: e.toString(),
                };
            }
        }
        const obj = JSON.parse(JSON.stringify(combineData));
        obj[radioValue].values = {
            ...obj[radioValue].values,
            [type]: e,
            ...oldData,
            ...newData,
            ...scopeData,
        };
        handleCombinData(obj);
    };

    useEffect(() => {
        const { region } = props.curSelParmExport;
        // handleRegionId(region?.regionId);
        const newArr = [
            {
                regionId: '-1',
                regionName: '全部',
            },
        ];
        console.log(props);
        if (Array.isArray(regionList)) {
            regionList.map((item) => {
                newArr.push(item);
            });
        }
        handleCityList(newArr);
    }, [regionList, props.curSelParmExport]);

    const handleRegionIdChange = (e) => {
        if (regionId && regionId.toString() === '-1' && e.toString() !== '-1') {
            handleRegionId(e.filter((item) => item !== '-1'));
            return;
        }
        if (e.find((item) => item === '-1') === '-1') {
            handleRegionId(['-1']);
            return;
        }
        handleRegionId(e);
    };

    const onPopupScroll = (event) => {
        // const { hasNextPage, pagination } = this.state;

        // // 没有下一页不执行
        if (!hasNextPage) {
            return;
        }

        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom) {
            current++;
            getDeptSource(current);
        }
    };

    const onSearch = (value) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            handleUserSource([{ zhName: '-', userId: '', mobilephone: '' }]);
            getDeptSource(1, value);
        }, 1000);
    };

    useEffect(() => {
        api.getRolesDictionary().then((res) => {
            if (res?.data?.length) {
                const newArr = [
                    {
                        id: 'day',
                        name: 'A角（白班）',
                    },
                    {
                        id: 'night',
                        name: 'A角（夜班）',
                    },
                    ...res.data
                        .filter((item) => item.dCode !== 'day')
                        .map((item) => {
                            return {
                                id: item.dCode,
                                name: item.dName,
                            };
                        }),
                ];
                setRoleSource(newArr);
            }
        });
    }, []);

    return (
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label="角色">
                    <Radio.Group onChange={onChange} value={radioValue}>
                        {roleSource.map((item) => {
                            return (
                                <Radio value={item.id} key={item.id}>
                                    {item.name}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </Form.Item>
                <Form.Item className="copy-role" label="归属地市">
                    <Select
                        value={regionId}
                        onChange={(e) => {
                            handleRegionIdChange(e);
                        }}
                        mode="multiple"
                    >
                        {cityList.map((item) => {
                            return (
                                <Select.Option value={item.regionId} key={item.regionId} label={item.regionName}>
                                    {item.regionName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                {selectData.map((itm) => {
                    return (
                        itm.id === radioValue && (
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                <Form.Item hidden name="oldUserId"></Form.Item>
                                <Form.Item hidden name="oldMobilePhone"></Form.Item>
                                <Form.Item hidden name="oldUserName"></Form.Item>
                                <Form.Item label="待修改人员">
                                    <Select
                                        value={itm.values.oldUserId}
                                        onChange={(e, opt) => {
                                            onSelectChange(e, 'oldUserId', opt);
                                        }}
                                        showSearch
                                        filterOption={(input, opt) => {
                                            let flag = false;
                                            if (itm.id === radioValue && opt.children.indexOf(input) !== -1) {
                                                flag = true;
                                            } else {
                                                flag = false;
                                            }
                                            return flag;
                                        }}
                                    >
                                        {oldUserSource.map((item) => {
                                            return (
                                                <Option
                                                    value={item.userId}
                                                    key={item.userId}
                                                    oldmobilephone={item.mobilePhone}
                                                    oldusername={item.userName}
                                                >
                                                    {`${item.userName}  ${item.mobilePhone || '-'}`}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="交接的维护范围">
                                    <Select
                                        value={itm.values?.scopes === null ? ['全部'] : itm.values.scopes.split(',')}
                                        onChange={(e) => {
                                            onSelectChange(e, 'scopes');
                                        }}
                                        mode="multiple"
                                    >
                                        {scopeSource.map((item) => {
                                            return (
                                                <Option
                                                    value={item.scope}
                                                    key={item.scope}
                                                    // disabled={item.scope !== "全部" && isAllScope}
                                                >
                                                    {item.scope}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="修改后人员">
                                    <Select
                                        value={itm.values.newUserId}
                                        onChange={(e, opt) => {
                                            onSelectChange(e, 'newUserId', opt);
                                        }}
                                        onPopupScroll={onPopupScroll}
                                        showSearch
                                        onSearch={onSearch}
                                        filterOption={(input, opt) => {
                                            let flag = false;
                                            if (itm.id === radioValue && opt.children.indexOf(input) !== -1) {
                                                flag = true;
                                            } else {
                                                flag = false;
                                            }
                                            return flag;
                                        }}
                                    >
                                        {userSource.map((item) => {
                                            return (
                                                <Option
                                                    value={item.userId}
                                                    key={item.userId}
                                                    newmobilephone={item.mobilephone}
                                                    newusername={item.zhName}
                                                    newdeptid={item.deptId}
                                                    newdeptname={item.deptName}
                                                >
                                                    {`${item.zhName}  ${item.mobilephone || '-'}`}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Form>
                        )
                    );
                })}
            </Form>
        </div>
    );
};
export default Index;
