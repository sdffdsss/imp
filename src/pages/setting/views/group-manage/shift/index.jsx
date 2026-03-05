import React from 'react';
import { Modal, Row, Col, DatePicker, Select, Button, message, Spin, Icon } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import { getGroupList, getRuleByDate, findUserByRule, changeShift } from './api';
import { _ } from 'oss-web-toolkits';

class Shift extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            shiftDay: '',
            shiftTeam: null,
            shiftClasses: null,
            shiftStaff: [],

            shiftTeamList: [],
            shiftClassesList: [],
            shiftStaffList: [],

            beShiftDay: '',
            beShiftTeam: null,
            beShiftClasses: null,
            beShiftStaff: [],

            shiftBeTeamList: [],
            shiftBeClassesList: [],
            shiftBeStaffList: [],
            spinning: false,
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    getGroupList = async () => {
        const { fieldsValue } = this.props;
        if (fieldsValue.provinceId) {
            const data = {
                provinceId: fieldsValue.provinceId,
            };
            const res = await getGroupList(data);
            if (res.code === 200) {
                this.setState({
                    shiftTeamList: res.rows,
                });
            }
        }
    };

    getBeGroupList = async () => {
        const { fieldsValue } = this.props;
        if (fieldsValue.provinceId) {
            const data = {
                provinceId: fieldsValue.provinceId,
            };
            const res = await getGroupList(data);
            if (res.code === 200) {
                this.setState({
                    shiftBeTeamList: res.rows,
                });
            }
        }
    };

    handleshiftOk = () => {};

    disabledDate = (current) => {
        return current && current < moment().subtract(1, 'day').endOf('day');
    };

    onShiftDayChange = (date, dateString) => {
        this.setState(
            {
                shiftDay: dateString,
                shiftTeam: null,
                shiftClasses: null,
                shiftStaff: [],
                shiftTeamList: [],
                shiftClassesList: [],
                shiftStaffList: [],
            },
            () => {
                this.getGroupList();
            },
        );
    };

    onBeShiftDayChange = (date, dateString) => {
        this.setState(
            {
                beShiftDay: dateString,
                beShiftTeam: null,
                beShiftClasses: null,
                beShiftStaff: [],

                shiftBeTeamList: [],
                shiftBeClassesList: [],
                shiftBeStaffList: [],
            },
            () => {
                this.getBeGroupList();
            },
        );
    };

    onShiftTeamChange = async (value) => {
        const { shiftDay } = this.state;

        const data = {
            groupId: value,
            scheduleDate: shiftDay,
        };
        const res = await getRuleByDate(data);
        if (res) {
            this.setState({
                shiftTeam: value,
                shiftClasses: null,
                shiftStaff: [],
                shiftClassesList: res,
            });
        }
    };

    onBeShiftTeamChange = async (value) => {
        const { beShiftDay } = this.state;
        const data = {
            groupId: value,
            scheduleDate: beShiftDay,
        };
        const res = await getRuleByDate(data);
        if (res) {
            this.setState({
                beShiftTeam: value,
                beShiftClasses: null,
                beShiftStaff: [],
                shiftBeClassesList: res,
            });
        }
    };

    onShiftClassesChange = async (value) => {
        const { shiftDay, shiftTeam } = this.state;
        const data = {
            groupId: shiftTeam,
            workShiftId: value,
            eqDayTime: shiftDay,
        };
        const res = await findUserByRule(data);
        if (res) {
            this.setState({
                shiftClasses: value,
                shiftStaff: [],
                shiftStaffList: res.rows,
            });
        }
    };

    onBeShiftClassesChange = async (value) => {
        const { beShiftDay, beShiftTeam } = this.state;
        const data = {
            groupId: beShiftTeam,
            workShiftId: value,
            eqDayTime: beShiftDay,
        };
        const res = await findUserByRule(data);
        if (res) {
            this.setState({
                beShiftClasses: value,
                beShiftStaff: [],
                shiftBeStaffList: res.rows,
            });
        }
    };

    onShiftStaffChange = (value) => {
        this.setState({
            shiftStaff: value,
        });
    };

    onBeShiftStaffChange = (value) => {
        this.setState({
            beShiftStaff: value,
        });
    };

    changeShift = async () => {
        const {
            shiftDay,
            shiftTeam,
            shiftClasses,
            shiftStaff,
            beShiftDay,
            beShiftTeam,
            beShiftClasses,
            beShiftStaff,
            shiftTeamList,
            shiftClassesList,
            shiftStaffList,
            shiftBeTeamList,
            shiftBeClassesList,
            shiftBeStaffList,
        } = this.state;

        if (
            shiftDay &&
            shiftTeam &&
            shiftClasses &&
            shiftStaff.length > 0 &&
            beShiftDay &&
            beShiftTeam &&
            beShiftClasses &&
            beShiftStaff.length > 0
        ) {
            const staffObj = shiftStaffList.filter((item) => _.find(shiftStaff, (col) => col === item.mainId));
            const beStaffObj = shiftBeStaffList.filter((item) => _.find(beShiftStaff, (col) => col === item.mainId));

            let isExist = false;
            let isBeExist = false;

            try {
                staffObj &&
                    staffObj.forEach((item) => {
                        if (_.find(item.groups, (col) => col.groupId.toString() === beShiftTeam.toString())) {
                            isExist = true;
                            throw '';
                        }
                    });
            } catch (e) {}

            try {
                beStaffObj &&
                    beStaffObj.forEach((item) => {
                        console.log(_.find(item.groups, (col) => col.groupId.toString() === beShiftTeam.toString()));
                        if (_.find(item.groups, (col) => col.groupId.toString() === shiftTeam.toString())) {
                            isBeExist = true;
                            throw '';
                        }
                    });
            } catch (e) {}

            if (!isExist || !isBeExist) {
                Modal.confirm({
                    title: '提示',
                    icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                    content:
                        isExist && !isBeExist
                            ? '替班人不在还班人班组中，换班后将自动加入换班班组，是否继续?'
                            : !isExist && isBeExist
                            ? '还班人不在替班人班组中，换班后将自动加入换班班组，是否继续?'
                            : '还班人不在替班人班组中，且替班人不在还班人班组中，换班后将自动加入换班班组，是否继续?',
                    okText: '确认',
                    okType: 'danger',
                    prefixCls: 'oss-ui-modal',
                    okButtonProps: { prefixCls: 'oss-ui-btn' },
                    cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                    cancelText: '取消',
                    width: '350px',
                    onOk: () => {
                        if (shiftStaff.length === beShiftStaff.length) {
                            this.setState(
                                {
                                    spinning: true,
                                },
                                () => {
                                    this.saveChangeShift();
                                },
                            );
                        } else {
                            Modal.confirm({
                                title: '提示',
                                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                                content: '换班人数和被换班人数不相同，是否确认换班?',
                                okText: '确认',
                                okType: 'danger',
                                prefixCls: 'oss-ui-modal',
                                okButtonProps: { prefixCls: 'oss-ui-btn' },
                                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                                cancelText: '取消',
                                width: '350px',
                                onOk: () => {
                                    this.setState(
                                        {
                                            spinning: true,
                                        },
                                        () => {
                                            this.saveChangeShift();
                                        },
                                    );
                                },
                            });
                        }
                    },
                });
            } else {
                if (shiftStaff.length === beShiftStaff.length) {
                    this.setState(
                        {
                            spinning: true,
                        },
                        () => {
                            this.saveChangeShift();
                        },
                    );
                } else {
                    Modal.confirm({
                        title: '提示',
                        icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                        content: '换班人数和被换班人数不相同，是否确认换班?',
                        okText: '确认',
                        okType: 'danger',
                        prefixCls: 'oss-ui-modal',
                        okButtonProps: { prefixCls: 'oss-ui-btn' },
                        cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                        cancelText: '取消',
                        width: '350px',
                        onOk: () => {
                            this.setState(
                                {
                                    spinning: true,
                                },
                                () => {
                                    this.saveChangeShift();
                                },
                            );
                        },
                    });
                }
            }
        } else {
            message.warning('请填写完整信息！');
        }
    };

    saveChangeShift = async () => {
        const {
            shiftDay,
            shiftTeam,
            shiftClasses,
            shiftStaff,
            beShiftDay,
            beShiftTeam,
            beShiftClasses,
            beShiftStaff,
            shiftTeamList,
            shiftClassesList,
            shiftStaffList,
            shiftBeTeamList,
            shiftBeClassesList,
            shiftBeStaffList,
        } = this.state;
        const { provinceList, fieldsValue, login } = this.props;

        const { userId } = login;
        const provinceObj = provinceList.filter((items) => String(items.regionId) === String(fieldsValue.provinceId));
        const teamObj = shiftTeamList.filter((items) => String(items.groupId) === String(shiftTeam));
        const beTeamObj = shiftBeTeamList.filter((items) => String(items.groupId) === String(beShiftTeam));
        const classesObj = shiftClassesList.filter((items) => String(items.id) === String(shiftClasses));
        const beClassesObj = shiftBeClassesList.filter((items) => String(items.id) === String(beShiftClasses));
        const staffObj = shiftStaffList.filter((item) => _.find(shiftStaff, (col) => col === item.mainId));
        const beStaffObj = shiftBeStaffList.filter((item) => _.find(beShiftStaff, (col) => col === item.mainId));
        let data = {
            provinceId: provinceObj && provinceObj[0]?.regionId, //省份id
            provinceName: provinceObj && provinceObj[0]?.regionName, //省份名称
            changeDateTime: shiftDay, //换班日期
            changeGroupId: teamObj && teamObj[0]?.groupId, //换班班组id
            changeGroupName: teamObj && teamObj[0]?.groupName, //换班班组名称
            changeWorkShiftId: classesObj && classesObj[0]?.id, //换班班次id
            changeWorkShiftName: classesObj && classesObj[0]?.workShiftName, //换班班次名称
            changeUsers: staffObj,
            beChangedDateTime: beShiftDay, //被换班日期
            beChangedGroupId: beTeamObj && beTeamObj[0]?.groupId, //被换班班组id
            beChangedGroupName: beTeamObj && beTeamObj[0]?.groupName, //被换班班组名称
            beChangedWorkShiftId: beClassesObj && beClassesObj[0]?.id, //被换班班次id
            beChangedWorkShiftName: beClassesObj && beClassesObj[0]?.workShiftName, //被换班班次名称
            beChangedUsers: beStaffObj,
            operateUser: userId, //操作人员
        };
        const res = await changeShift(data);
        if (res.code === 200) {
            message.success('换班成功！');
            this.setState(
                {
                    shiftDay: '',
                    shiftTeam: null,
                    shiftClasses: null,
                    shiftStaff: [],
                    shiftTeamList: [],
                    shiftClassesList: [],
                    shiftStaffList: [],
                    beShiftDay: '',
                    beShiftTeam: null,
                    beShiftClasses: null,
                    beShiftStaff: [],
                    shiftBeTeamList: [],
                    shiftBeClassesList: [],
                    shiftBeStaffList: [],
                    spinning: false,
                },
                () => {
                    this.props.handleshiftClose();
                },
            );
        } else {
            message.error(res.message);
            this.setState({
                spinning: false,
            });
        }
    };

    render() {
        const {
            //  shiftDay,
            shiftTeam,
            shiftClasses,
            shiftStaff,
            //  beShiftDay,
            beShiftTeam,
            beShiftClasses,
            beShiftStaff,
            shiftTeamList,
            shiftClassesList,
            shiftStaffList,
            shiftBeTeamList,
            shiftBeClassesList,
            shiftBeStaffList,
            spinning,
        } = this.state;
        const { shiftVisible } = this.props;
        return (
            <Modal
                width={1000}
                destroyOnClose
                title="换班"
                visible={shiftVisible}
                onCancel={() => {
                    this.props.handleshiftClose();
                }}
                onOk={() => {
                    this.handleshiftOk();
                }}
                footer={null}
            >
                <Spin spinning={spinning}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Row gutter={[16, 24]}>
                            <Col span={2}>还班人员:</Col>
                            <Col span={5}>
                                <DatePicker
                                    placeholder="请选择还班日期"
                                    style={{ width: '100%' }}
                                    disabledDate={this.disabledDate}
                                    onChange={this.onShiftDayChange}
                                />
                            </Col>
                            <Col span={5}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="请选择还班班组"
                                    value={shiftTeam}
                                    style={{ width: '100%' }}
                                    onChange={this.onShiftTeamChange}
                                >
                                    {shiftTeamList && shiftTeamList.map((item) => <Option key={item.groupId}>{item.groupName}</Option>)}
                                </Select>
                            </Col>
                            <Col span={5}>
                                <Select
                                    placeholder="请选择还班班次"
                                    value={shiftClasses}
                                    style={{ width: '100%' }}
                                    onChange={this.onShiftClassesChange}
                                >
                                    {shiftClassesList && shiftClassesList.map((item) => <Option key={item.id}>{item.workShiftName}</Option>)}
                                </Select>
                            </Col>
                            <Col span={5}>
                                <Select
                                    mode="multiple"
                                    value={shiftStaff}
                                    style={{ width: '100%' }}
                                    placeholder="请选择还班人员"
                                    onChange={this.onShiftStaffChange}
                                    maxTagTextLength={2}
                                    maxTagCount={2}
                                >
                                    {shiftStaffList && shiftStaffList.map((item) => <Option key={item.mainId}>{item.mainName}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <Row gutter={[16, 24]} style={{ marginTop: '30px' }}>
                            <Col span={2}>替班人员:</Col>
                            <Col span={5}>
                                <DatePicker
                                    placeholder="请选择替班日期"
                                    style={{ width: '100%' }}
                                    disabledDate={this.disabledDate}
                                    onChange={this.onBeShiftDayChange}
                                />
                            </Col>
                            <Col span={5}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="请选择替班班组"
                                    value={beShiftTeam}
                                    style={{ width: '100%' }}
                                    onChange={this.onBeShiftTeamChange}
                                >
                                    {shiftBeTeamList && shiftBeTeamList.map((item) => <Option key={item.groupId}>{item.groupName}</Option>)}
                                </Select>
                            </Col>
                            <Col span={5}>
                                <Select
                                    placeholder="请选择替班班次"
                                    value={beShiftClasses}
                                    style={{ width: '100%' }}
                                    onChange={this.onBeShiftClassesChange}
                                >
                                    {shiftBeClassesList && shiftBeClassesList.map((item) => <Option key={item.id}>{item.workShiftName}</Option>)}
                                </Select>
                            </Col>
                            <Col span={5}>
                                <Select
                                    mode="multiple"
                                    value={beShiftStaff}
                                    style={{ width: '100%' }}
                                    placeholder="请选择替班人员"
                                    onChange={this.onBeShiftStaffChange}
                                    maxTagTextLength={2}
                                >
                                    {shiftBeStaffList && shiftBeStaffList.map((item) => <Option key={item.mainId}>{item.mainName}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <div style={{ width: '100%', marginTop: '50px', textAlign: 'center' }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.changeShift();
                                }}
                            >
                                换班
                            </Button>
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={() => {
                                    this.setState(
                                        {
                                            shiftDay: '',
                                            shiftTeam: null,
                                            shiftClasses: null,
                                            shiftStaff: [],
                                            shiftTeamList: [],
                                            shiftClassesList: [],
                                            shiftStaffList: [],
                                            beShiftDay: '',
                                            beShiftTeam: null,
                                            beShiftClasses: null,
                                            beShiftStaff: [],
                                            shiftBeTeamList: [],
                                            shiftBeClassesList: [],
                                            shiftBeStaffList: [],
                                        },
                                        () => {
                                            this.props.handleshiftClose();
                                        },
                                    );
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Shift);
