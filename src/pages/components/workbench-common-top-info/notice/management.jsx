import React, { Component } from 'react';
import { Button, Space, Input, Checkbox } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { componentEmus } from '@Components/workbench-components/component.ts';
import { withModel } from 'hox';
import { SettingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { _ } from 'oss-web-toolkits';
import AuthButton from '@Components/auth-button';
import { logNew } from '@Common/api/service/log';
import { getWorkStationConfiguration, updateWorkStationConfiguration } from '../api';

const elementSource = [
    {
        id: '1',
        direction: 'left',
    },
    {
        id: '5',
        direction: 'right',
    },
    {
        id: '7',
        direction: 'right',
    },
    {
        id: '2',
        direction: 'right',
    },
    {
        id: '8',
        direction: 'right',
    },
    {
        id: '9',
        direction: 'right',
    },
];

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsLeft: [],
            itemsRight: [],
            options: [],
            listData: [],
            toolsVisible: false,
            searchValue: '',
        };
        this.checkBenchType = props?.location?.state?.type;
        this.optionsCache = [];
    }

    handleOptions = (res) => {
        if (res?.data?.upToDateWorkStationConfig) {
            const itemsList = JSON.parse(res.data.upToDateWorkStationConfig) || [];
            const newOptions = itemsList;
            componentEmus.map((item) => {
                if (!itemsList.map((itm) => itm.id).includes(item.id)) {
                    newOptions.push(item);
                }
            });
            const options = newOptions.map((item) => ({
                value: item.id,
                label: item.name || componentEmus.find((it) => it.id === item.id)?.name,
                direction: item?.extra?.direction || item.direction,
                disabled: item.id === '0',
            }));
            this.setState({
                options,
            });
            this.optionsCache = options;
        }
    };

    componentDidMount() {
        // const { benchType = '1' } = this.props;
        // const params = this.checkBenchType
        //     ? {
        //           configType: this.checkBenchType || benchType,
        //       }
        //     : {
        //           userId: this.props.login.userId,
        //       };
        // getWorkStationConfiguration({ ...params, appId: this.props.login.systemInfo.appId || '110002' }).then((res) => {
        //     if (res?.data?.upToDateWorkStationConfig) {
        //         const itemsList = JSON.parse(res.data.upToDateWorkStationConfig) || [];
        //         const newOptions = itemsList;
        //         componentEmus.map((item) => {
        //             if (!itemsList.map((itm) => itm.id).includes(item.id)) {
        //                 newOptions.push(item);
        //             }
        //         });
        //         this.handleOptions(res);
        //         console.log(itemsList, 'itemsList');
        //         this.setState({
        //             itemsLeft: itemsList.filter((item) => item.direction === 'left'),
        //             itemsRight: itemsList.filter((item) => item.direction === 'right'),
        //             listData: itemsList.map((item) => item.id),
        //         });
        //     } else {
        //         this.setState({
        //             itemsLeft: elementSource.filter((item) => item.direction === 'left'),
        //             itemsRight: elementSource.filter((item) => item.direction === 'right'),
        //             options: componentEmus.map((item) => ({
        //                 value: item.id,
        //                 label: item.name,
        //                 direction: item.extra.direction,
        //                 disabled: item.id === '0',
        //             })),
        //         });
        //     }
        // });
    }

    handleToolsVisible = () => {
        const { toolsVisible, itemsLeft, itemsRight } = this.state;
        const { benchType = '1' } = this.props;
        const params = this.checkBenchType
            ? {
                  configType: this.checkBenchType || benchType,
              }
            : {
                  userId: this.props.login.userId,
              };
        getWorkStationConfiguration({ ...params, appId: this.props.login.systemInfo.appId || '110002' }).then((res) => {
            if (res?.data?.upToDateWorkStationConfig) {
                const itemsList = JSON.parse(res.data.upToDateWorkStationConfig) || [];
                this.setState({
                    itemsLeft: itemsList.filter((item) => item.direction === 'left'),
                    itemsRight: itemsList.filter((item) => item.direction === 'right'),
                    listData: itemsList.map((item) => item.id),
                });
                this.handleOptions(res);
            } else {
                this.setState({
                    itemsLeft: elementSource.filter((item) => item.direction === 'left'),
                    itemsRight: elementSource.filter((item) => item.direction === 'right'),
                });
            }
        });
        this.handleSearch('');
        this.setState({
            toolsVisible: !toolsVisible,
            searchValue: '',
            listData: [...itemsLeft, ...itemsRight].map((item) => item.id),
        });
    };

    handleChange = (e) => {
        this.setState({
            listData: e,
        });
    };

    handleSaveChange = () => {
        const { onSave } = this.props;
        const { listData, toolsVisible, itemsLeft, itemsRight } = this.state;
        const emusList = componentEmus.map((item) => ({
            ...item,
            direction: item.extra.direction,
        }));
        const newList = [];
        listData.map((item) => {
            newList.push(emusList.find((itm) => itm.id === item));
        });
        onSave && onSave(newList);
        this.handleSearch('');
        this.setState({
            toolsVisible: !toolsVisible,
            searchValue: '',
        });
        const params = this.checkBenchType
            ? {
                  configType: this.checkBenchType || benchType,
              }
            : {
                  userId: this.props.login.userId,
              };
        updateWorkStationConfiguration({
            ...params,
            appId: this.props.login.systemInfo.appId || '110002',
            workStationConfiguration: JSON.stringify(
                newList.map((item) => ({
                    id: item.id,
                    direction: item.direction,
                    config: [...itemsLeft, ...itemsRight].filter((itm) => itm.id === item.id)[0]?.config,
                })),
            ),
        });
    };

    handleSearchChange = (value) => {
        this.setState({
            searchValue: value,
        });
    };

    handleSearch = (value) => {
        this.setState({
            options: this.optionsCache
                .map((option) => {
                    return { value: option.value, label: option.label };
                })
                .filter((item) => item.label?.includes(value)),
        });
    };

    render() {
        const { options, toolsVisible, listData, searchValue } = this.state;
        return (
            <div className="workbench-tools-config">
                <AuthButton
                    className="workbench-tools-config-button"
                    type="link"
                    authKey="workbenchManage:config"
                    icon={<SettingOutlined style={{ fontSize: '12px' }} />}
                    onClick={() => {
                        logNew('工作台组件', '200002');
                        this.handleToolsVisible();
                    }}
                >
                    管理
                </AuthButton>
                <div className={classNames('workbench-tools-dropdown', { hidden: !toolsVisible })}>
                    <Input.Search
                        value={searchValue}
                        onChange={(e) => {
                            this.handleSearchChange(e.target.value);
                        }}
                        onSearch={(e) => {
                            this.handleSearch(e);
                        }}
                    />
                    <div className="workbench-tools-dropdown-select">
                        <Checkbox.Group
                            options={options}
                            value={listData}
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                        />
                    </div>
                    <div className="workbench-tools-dropdown-footer">
                        <Space>
                            <Button
                                onClick={() => {
                                    this.handleToolsVisible();
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.handleSaveChange();
                                }}
                            >
                                完成
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
