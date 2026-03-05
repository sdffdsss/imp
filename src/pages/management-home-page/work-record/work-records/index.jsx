import React from 'react';
import { Modal, Input, Tooltip, Icon, Timeline, message } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';

import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { customAlphabet } from 'nanoid';
import { ReactComponent as WindowSvg1 } from '../../img/u243.svg';

const { TextArea } = Input;

class baseInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originData: [],
            editingKey: '',
            editingObj: {},
            contentVal: '',
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        let el = document.getElementById('managementText');
        el?.focus();
        const { originData } = this.props;
        this.setState({
            originData,
        });
    }

    componentDidUpdate(prevProps) {
        let el = document.getElementById('managementText');
        el?.focus();
        if (this.props.originData !== prevProps.originData) {
            const { originData } = this.props;
            this.setState({
                originData,
            });
        }
    }
    clearEditingKey = () => {
        this.setState({
            editingKey: '',
        });
    };

    addData = () => {
        const {
            login: { userName, userId },
        } = this.props;
        let { originData, editingKey } = this.state;
        if (editingKey) {
            message.warning('请先保存工作记录再新增!');
        } else {
            const nanoid = customAlphabet('1234567890', 10);
            let key = nanoid();
            let editingObj = {
                key: key,
                operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                userName: userName,
                userId: userId,
                content: '',
                recordId: '',
            };
            let newOriginData = originData ? [editingObj].concat(originData) : [editingObj];

            this.props.changeOriginData(newOriginData, false);
            this.setState({
                originData: newOriginData,
                editingKey: key,
                editingObj: editingObj,
                contentVal: '',
            });
        }
    };

    save = (record) => {
        const { contentVal, originData } = this.state;
        const valueLength = contentVal ? contentVal.replace(/[^\x00-\xff]/g, 'aa').length : 0;
        if (valueLength > 0) {
            const index = originData.findIndex((item) => record.key === item.key);

            if (index > -1) {
                let item = originData[index];
                // originData.splice(index, 1, {
                //     ...item,
                //     content: contentVal,
                // });

                this.changeData([{ ...item, content: contentVal }]);
            } else {
                this.changeData(originData);
            }
        } else {
            message.warning('工作记录不能为空!');
        }
    };

    changeData = (val) => {
        this.props.changeOriginData(val, true);
        this.setState({
            originData: val,
            editingKey: '',
        });
    };

    onChangeText = (e) => {
        this.setState({
            contentVal: e.target.value,
        });
    };

    delData = (record) => {
        const { originData, editingKey } = this.state;
        if (editingKey) {
            message.warning('请先保存工作记录再删除!');
        } else {
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
                content: '确认删除该工作记录吗？',
                okText: '确认',
                okButtonProps: { prefixCls: 'oss-ui-btn' },
                cancelButtonProps: { prefixCls: 'oss-ui-btn' },
                okType: 'danger',
                cancelText: '取消',
                prefixCls: 'oss-ui-modal',
                onOk: () => {
                    // const newData = _.remove(originData, (o) => {
                    //     return o.key !== record.key;
                    // });
                    // this.changeData(newData);
                    this.props.delData(record.recordId);
                },
                onCancel() {},
            });
        }
    };

    changeCursor = () => {
        let el = document.getElementById('managementText');
        el.setSelectionRange(el.value.length, el.value.length);
    };

    render() {
        const { editingKey, contentVal } = this.state;
        const { originData } = this.props;

        return (
            <div className="managament-work-records-continer">
                <Timeline mode={'left'}>
                    {originData &&
                        originData.map((item, index) => {
                            const editable = item.key === editingKey;
                            return (
                                <Timeline.Item label={item.userName}>
                                    <div>
                                        <div>
                                            <span className="record-time">{item.operationTime}</span>

                                            {editable ? (
                                                <span>
                                                    <Tooltip title="保存">
                                                        <WindowSvg1
                                                            key="2"
                                                            onClick={() => this.save(item)}
                                                            disabled={editingKey !== ''}
                                                            className="record-svg-save"
                                                        />
                                                    </Tooltip>
                                                    {/* <Tooltip title="删除">
                                                        <Icon
                                                            key="3"
                                                            antdIcon={true}
                                                            type="iconshanchu"
                                                            className="record-svg"
                                                            onClick={() => this.delData(item)}
                                                            disabled={editingKey !== ''}
                                                        />
                                                    </Tooltip> */}
                                                </span>
                                            ) : (
                                                <span>
                                                    <Tooltip title="修改">
                                                        <Icon
                                                            key="4"
                                                            antdIcon={true}
                                                            type="iconbianji"
                                                            onClick={() => {
                                                                if (editingKey) {
                                                                    message.warning('请先保存工作记录再编辑');
                                                                } else {
                                                                    this.setState(
                                                                        {
                                                                            editingKey: item.key,
                                                                            contentVal: item.content,
                                                                        },
                                                                        () => {
                                                                            let el = document.getElementById('managementText');
                                                                            el?.focus();
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            style={{
                                                                marginRight: 8,
                                                                marginLeft: 10,
                                                            }}
                                                            className="record-svg"
                                                            disabled={editingKey !== ''}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="删除">
                                                        <Icon
                                                            key="3"
                                                            antdIcon={true}
                                                            type="iconshanchu"
                                                            onClick={() => this.delData(item)}
                                                            disabled={editingKey !== ''}
                                                            className="record-svg"
                                                        />
                                                    </Tooltip>
                                                </span>
                                            )}
                                        </div>
                                        <div className="record-content">
                                            {editable ? (
                                                <TextArea
                                                    rows={4}
                                                    className="records-text"
                                                    value={contentVal}
                                                    maxLength={2000}
                                                    onChange={this.onChangeText}
                                                    onPressEnter={this.onChangeText}
                                                    onFocus={this.changeCursor}
                                                    id="managementText"
                                                />
                                            ) : (
                                                item.content
                                            )}
                                        </div>
                                    </div>
                                </Timeline.Item>
                            );
                        })}
                </Timeline>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(baseInfo);
