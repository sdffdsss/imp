import React, { useContext, useEffect, useRef, useState } from 'react';
import { usePersistFn, useUpdate } from 'ahooks';
import useLoginInfoModel from '@Src/hox';
import { Timeline, message, Modal, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { TabButtonEnum, IsDelete } from '@Pages/international-resource-monitor/type';
import UnicomEmpty from '@Components/empty';
import { sendLogFn } from '@Pages/components/auth/utils';
import TimelineItem from './timeline-item';
import { DescriptionItemDataType } from './type';
import GlobalStateContext from '../../context';
import { getQueryExplain, addQueryAllExplain, deleteQueryExplain, deleteHistoryQueryExplain, updateQueryExplain } from '../../services/api';
import { newAddId, newPlaceholderData } from './constants';
import './index.less';

function Index(props) {
    const { onSelectDescChange, onSelectRowsChange, handleRelatedAlarmClick, selectedRows, selectedFaultDesc } = props;
    const loginInfo = useLoginInfoModel();

    const { mode } = useContext(GlobalStateContext);
    const historyFlag = mode.startsWith(TabButtonEnum.HISTORY);
    const faultType = mode.replace(`${TabButtonEnum.HISTORY}/`, '');
    const faultTypeValue = faultType === TabButtonEnum.CABLE ? 1 : 2;

    const currentEditingItemRef = useRef<DescriptionItemDataType | undefined>();
    const isMountRef = useRef<boolean>(false);

    const [descriptionList, setDescriptionList] = useState<DescriptionItemDataType[]>([]);
    const [currentSelectedItem, setCurrentSelectedItem] = useState<DescriptionItemDataType>();

    const forceUpdate = useUpdate();

    function judgeIsEditing() {
        return Boolean(currentEditingItemRef.current);
    }

    function executeAdd() {
        const newDescriptionItem = _.clone(newPlaceholderData);

        setCurrentSelectedItem(newDescriptionItem);
        setDescriptionList(
            currentEditingItemRef.current?.id === newAddId
                ? [newDescriptionItem, ...descriptionList.slice(1)]
                : [newDescriptionItem, ...descriptionList],
        );

        currentEditingItemRef.current = _.clone(newPlaceholderData);
        onSelectRowsChange([]);
        handleRelatedAlarmClick(false);
    }

    const getList = usePersistFn(async (needAdd = false) => {
        // 国际网络监控和历史记录共用一个接口，参数不同
        const params = {
            isDelete: historyFlag ? IsDelete.INVALIDDATA : IsDelete.VALALLATA,
            faultType: faultTypeValue,
        };

        // 查询所有的故障数据
        const data = await getQueryExplain(params);

        isMountRef.current = true;
        if (historyFlag) {
            setDescriptionList(data);
        } else if (data.length > 0 && !needAdd) {
            setDescriptionList(data);
        } else {
            executeAdd();
        }

        return data;
    });

    function executeDelete(id) {
        const deleteCallback = () => {
            if (currentEditingItemRef.current?.id === id) {
                currentEditingItemRef.current = undefined;
            }

            if (currentSelectedItem?.id === id) {
                setCurrentSelectedItem(undefined);
            }
            message.success('删除成功');
            setDescriptionList([]);

            getList();
            handleRelatedAlarmClick(false);
        };

        if (id === newAddId) {
            deleteCallback();
            return;
        }

        const requestCallback = (res) => {
            if (+res.code === 200) {
                deleteCallback();
            } else {
                message.error('删除失败');
            }
        };

        // 历史记录删除
        if (historyFlag) {
            deleteHistoryQueryExplain(id).then(requestCallback);
        } else {
            deleteQueryExplain(id).then(requestCallback);
        }
    }

    // 新增
    function addItemClick() {
        sendLogFn({ authKey: 'workbenches:textAlarmAdd' });
        // 是否存在正在编辑的内容
        if (judgeIsEditing()) {
            // 有正在编辑且输入框为空
            if (currentEditingItemRef.current?.faultDescription === '') {
                message.warning('存在未编辑完成的内容，请先保存后再新增！');
                return;
            }

            // 有正在编辑且输入框不为空
            Modal.confirm({
                title: '提示',
                icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
                content: `存在未保存的内容，新增将导致该部分内容丢失，是否继续？`,
                okText: '是',
                cancelText: '否',
                onOk: () => {
                    setDescriptionList([]);
                    getList(true);
                },
            });
        } else {
            executeAdd();
        }
    }

    // 删除点击的TimeLineCard
    function deleteItemClick(data: DescriptionItemDataType) {
        sendLogFn({ authKey: 'workbenches:textDelete' });
        if (descriptionList.length === 1 && descriptionList[0].id === newAddId) {
            message.warning('无数据时无法删除');
            return;
        }
        const { id } = data;
        // 是否存在正在编辑未保存的内容
        if (currentEditingItemRef.current) {
            if (currentEditingItemRef.current.id !== id) {
                message.warning('存在未编辑完成的内容，请先保存');

                return;
            }
        }

        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: `是否确认删除？`,
            okText: '是',
            cancelText: '否',
            onOk: () => {
                executeDelete(id);
            },
        });
    }
    // 保存操作
    function saveItemClick(data) {
        if (currentEditingItemRef.current!.faultDescription.trim().length === 0) {
            message.warning(`编辑未完成，无法保存`);
            return;
        }
        // 校验空值
        const { userId } = loginInfo;

        const newSelectedRows = selectedRows.map((item: any) => {
            return { alarmId: item.standard_alarm_id };
        });
        const requestParams = {
            faultDescription: currentEditingItemRef.current!.faultDescription,
            alarmRelations: newSelectedRows,
        };

        if (data.id === newAddId) {
            Object.assign(requestParams, {
                createId: userId,
                faultType: faultTypeValue,
            });
        } else {
            Object.assign(requestParams, {
                modifyId: userId,
                id: data.id,
            });
        }

        const getDataCallback = (type: 'update' | 'add') => {
            getList().then((res) => {
                setCurrentSelectedItem(type === 'update' ? currentEditingItemRef.current : res[0]);
                currentEditingItemRef.current = undefined;

                if (type === 'update') {
                    forceUpdate();
                }
            });
        };
        if (data.id === newAddId) {
            addQueryAllExplain(requestParams).then((res: any) => {
                if (+res.code !== 200) {
                    message.error('新增失败');
                    return;
                }
                handleRelatedAlarmClick(false);
                message.success('新增成功');
                getDataCallback('add');
            });
        } else {
            updateQueryExplain(requestParams).then((res: any) => {
                if (+res.code !== 200) {
                    message.error('修改失败');
                    return;
                }
                handleRelatedAlarmClick(false);
                message.success('修改成功');
                getDataCallback('update');
            });
        }
    }
    // 修改为正在编辑的状态
    function modifyItemClick(data: DescriptionItemDataType) {
        sendLogFn({ authKey: 'workbenches:textAlarmEdit' });

        // 是否有正在编辑的内容

        if (judgeIsEditing()) {
            message.warning(`存在未编辑完成的内容，请先保存`);
            return;
        }
        // 无正在编辑的内容
        currentEditingItemRef.current = _.clone(data);

        if (currentSelectedItem?.id === data.id) {
            forceUpdate();
        } else {
            setCurrentSelectedItem(data);
        }
    }
    // 选中TimelineCard
    function selectItemClick(data: DescriptionItemDataType) {
        if (judgeIsEditing()) {
            return;
        }

        // 选中与取消选中状态切换
        setCurrentSelectedItem(currentSelectedItem?.id === data.id ? undefined : data);
    }
    // 关联
    function onRelateClick() {
        handleRelatedAlarmClick(true);
    }

    function onTextAreaChange(value) {
        currentEditingItemRef.current!.faultDescription = value;
    }

    useEffect(() => {
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        onSelectDescChange(currentSelectedItem);
    }, [onSelectDescChange, currentSelectedItem]);

    useEffect(() => {
        setCurrentSelectedItem(selectedFaultDesc);
        // 右侧可以控制左侧 当左侧正在编辑框状态时，右侧点击全部告警 左侧恢复为非编辑态
        if (!selectedFaultDesc) {
            currentEditingItemRef.current = currentEditingItemRef.current?.id === newAddId ? currentEditingItemRef.current : undefined;
        }
    }, [selectedFaultDesc]);

    return (
        <>
            <Timeline className="discription-list-my-container">
                {descriptionList.map((item: DescriptionItemDataType, index) => {
                    const isSelected = currentSelectedItem?.id === item.id;
                    const isEditingCurrent = currentEditingItemRef.current?.id === item.id;

                    return (
                        <TimelineItem
                            key={item.id}
                            item={item}
                            index={index + 1}
                            isSelected={isSelected}
                            isEditing={isEditingCurrent}
                            // 保存
                            saveItem={() => saveItemClick(item)}
                            // 删除
                            deleteItem={() => deleteItemClick(item)}
                            // 关联
                            onRelateClick={onRelateClick}
                            // 编辑
                            modifyItem={() => modifyItemClick(item)}
                            // 新增
                            addItem={addItemClick}
                            // 选中
                            selectItem={() => selectItemClick(item)}
                            // 文本域onChange
                            onTextAreaChange={onTextAreaChange}
                        />
                    );
                })}
            </Timeline>
            {isMountRef.current && historyFlag && descriptionList.length === 0 && <UnicomEmpty description="暂无数据" />}
        </>
    );
}
export default Index;
