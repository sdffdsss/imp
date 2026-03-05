import React from 'react';
import { Button, Space, message, ColumnsSortDrag } from 'oss-ui';
// import ColumnsSortDrag from '@Components/columns-sort-drag';
import produce from 'immer';

import { getAllAlarmColumns, getUserQueryDefaultColumns, getTemplateColumnsById, setColumnsInfo, setColumnsIndex } from '../common/rest';
import { queryAlarmColumnDefault } from '../common/defaultColumns';
import request from '@Src/common/api';
import './index.less';
import { useEnvironmentModel } from '@Src/hox';

const titleVersion = useEnvironmentModel?.data?.environment?.version === 'unicom' ? '智能监控' : false;
export default class Index extends React.PureComponent {
    static defaultProps = {
        queryAlarmColumeFlag: '.QueryAlarmBandOption',
    };

    constructor(props) {
        super(props);
        this.state = {
            leftData: [],
            rightData: [],
            columns: [
                {
                    key: 'name',
                    title: '名称',
                    allOptionsWidth: '190px',
                    selectOptionsWidth: '130px',
                },
                {
                    key: 'field',
                    title: '字段',
                    allOptionsWidth: '195px',
                    selectOptionsWidth: '100px',
                },
                {
                    key: 'alias',
                    title: '别名',
                    editFlag: true,
                    allOptionsHide: true,
                    selectOptionsWidth: '105px',
                },
                {
                    key: 'width',
                    title: '宽度',
                    editFlag: true,
                    allOptionsHide: true,
                    selectOptionsWidth: '50px',
                },
            ],
        };
        this.rightDataBak = [];
        this.editRightData = [];
    }

    componentDidMount() {
        this.getUserQueryColumns();
    }

    async getUserQueryColumns() {
        const { userName } = this.props;
        const leftData = await getAllAlarmColumns();
        this.setState({ leftData });
        const userDefaultQueryXml = await getUserQueryDefaultColumns(userName);
        const callback = () => {
            if (this.state.rightData.length > 0) {
                this.editRightData = [...this.state.rightData];
                this.rightDataBak = [...this.state.rightData];
            }
        };
        const getOtherDefault = async () => {
            const template0ColumnsXml = await getTemplateColumnsById(0, this.props.userId);
            if (template0ColumnsXml) {
                const columns = setColumnsInfo(template0ColumnsXml, leftData);
                this.setState({ rightData: columns.activeAlarmColumn }, callback);
            } else {
                this.setState({ rightData: setColumnsIndex(queryAlarmColumnDefault, leftData) }, callback);
            }
        };
        if (userDefaultQueryXml) {
            const columns = setColumnsInfo(userDefaultQueryXml, leftData, 'query');
            if (columns && columns.queryAlarmColumnDefault && columns.queryAlarmColumnDefault.length) {
                this.setState({ rightData: columns.queryAlarmColumnDefault }, callback);
            } else {
                getOtherDefault();
            }
        } else {
            getOtherDefault();
        }
    }

    // 还原默认值
    handleGoback = () => {
        this.setState({
            rightData: [...this.rightDataBak],
        });
        this.editRightData = [...this.rightDataBak];
    };

    // 保存
    handleOk = () => {
        const queryAlarmColumn = this.editRightData;
        if (!queryAlarmColumn.length) {
            message.warning('已选择字段为空，请选择后再提交！');
            return;
        }
        if (queryAlarmColumn.length && queryAlarmColumn.length > 40) {
            message.warning('已选择的告警字段不能超过40个，请修改后再提交！');
            return;
        }
        const queryAlarmColumnStr = queryAlarmColumn.map((item) => (item.name === item.alias ? item.field : `${item.field}#${item.alias}`)).join('|');
        const queryAlarmWidthStr = queryAlarmColumn.map((item) => item.width).join('|');
        const optionValue = `<BOCO.IMP.Domain.OptionModels.AlarmBandSetting1 IsVisible="true" Columns="${queryAlarmColumnStr}" ColumnWidths="${queryAlarmWidthStr}" />`;
        this.insertData(optionValue);
    };

    insertData = async (optionValue) => {
        const { userName, queryAlarmColumeFlag } = this.props;
        const optionKey = userName + queryAlarmColumeFlag;

        const queryParam = {
            optionKey,
            optionValue,
        };
        const userDefaultQueryXml = await getUserQueryDefaultColumns(userName);
        request('v1/template/search-alarm-column', {
            type: userDefaultQueryXml ? 'put' : 'post',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            showSuccessMessage: false,
            showErrorMessage: true,
        }).then((res) => {
            if (res && res.code === 0) {
                message.success('保存成功');
                this.rightDataBak = [...this.editRightData];
            }
            // else {
            //     console.error(`保存查询告警列模板失败option_key=${optionKey}，失败原因：`);
            //     console.error(res.errorMsg);
            // }
        });
    };

    onChange = (condtion) => {
        const newCondition = produce(condtion, (draft) => {
            return draft.map((item) => {
                return produce(item, (draftItem) => {
                    if (!draftItem.width) {
                        // eslint-disable-next-line no-param-reassign
                        draftItem.width = 120;
                    }
                    if (!draftItem.alias) {
                        // eslint-disable-next-line no-param-reassign
                        draftItem.alias = item.name;
                    }
                });
            });
        });
        this.editRightData = newCondition;
    };
    getAllData = (params) => {
        return request('v1/alarm/columns', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: { word: params.word },
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.data) {
                return {
                    data: res.data.map((item) => {
                        return {
                            ...item,
                            ...{
                                id: item.fieldId,
                                name: item.displayName,
                                field: item.storeFieldName,
                                width: 120,
                                alias: item.displayName,
                            },
                        };
                    }),
                    total: null,
                };
            }
            return {
                data: [],
                total: null,
            };
        });
    };
    render() {
        const { rightData, columns } = this.state;

        const styleMap = {
            width: '1060px',
            height: 'calc(100% - 124px)',
            margin: '10px auto',
            border: 'none',
            backgroundColor: 'transparent',
        };

        return (
            <>
                <ColumnsSortDrag
                    style={styleMap}
                    columns={columns}
                    // allOptionsList={[]}
                    selectOptionsList={rightData}
                    onChange={this.onChange}
                    request={this.getAllData}
                    searchParams={{
                        searchField: 'word',
                        paging: false,
                    }}
                    maxField={40}
                    dragHolderMessag={titleVersion}
                />
                <div style={{ color: 'red', margin: '0 0 0 calc(50% - 520px)' }}>提示：已选择的告警字段不能超过40个！</div>
                <div className="alarm-col-template-buttongroup">
                    <Space>
                        <Button key="goback" type="primary" onClick={this.handleGoback}>
                            还原默认值
                        </Button>
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            保存
                        </Button>
                    </Space>
                </div>
            </>
        );
    }
}
