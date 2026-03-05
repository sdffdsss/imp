import React, { FC, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Icon, Modal } from 'oss-ui';
import styles from './style.module.less';
import NavButtonList from './nav-button-list';
import PageModule from './content';
import { TabButtonEnum, ContextValueType, TabList, TabButtonHistoryEnum } from './type';
import GlobalStateContext from './context';

interface Props {}

const ResourceMonitor: FC<Props> = () => {
    const defaultLeftCardWidth = useRef<number>(758);
    const [display, setDisplay] = useState<boolean>(true); // 是否显示左侧内容
    const IsEditingRef = useRef(false); // 内容是否在编辑态
    const [leftCardWidth, setLeftCardWidth] = useState<number | string>(defaultLeftCardWidth.current); // 左侧 card 宽度
    const [globalState, setGlobalState] = useState<ContextValueType>({
        mode: TabList[0].id, // 保存当前点击的按钮状态
    });

    useEffect(() => {
        if (display) {
            setLeftCardWidth(defaultLeftCardWidth.current);
        } else {
            setLeftCardWidth(0);
        }
    }, [display]);

    // 有编辑状态切换时提示
    const editMessage = (name) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: `存在未保存的内容，切换tab将导致该部分内容丢失，是否继续？`,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                setGlobalState({
                    mode: name,
                });
            },
            onCancel() {
                console.log('已取消');
            },
        });
    };

    // 修改tab事件
    const changeTab = (name: TabButtonEnum | TabButtonHistoryEnum) => {
        if (globalState.mode === name) {
            return;
        }
        if (IsEditingRef.current) {
            editMessage(name);
        } else {
            setGlobalState({
                mode: name,
            });
        }
    };

    const changeIsEditingFlag = useCallback((flag) => {
        IsEditingRef.current = flag;
    }, []);

    const contextValue = useMemo(
        () => ({
            ...globalState,
            setGlobalState,
            changeIsEditingFlag,
        }),
        [globalState, changeIsEditingFlag],
    );

    return (
        <GlobalStateContext.Provider value={contextValue}>
            <div className={styles['reesource-monitor-page']}>
                <header>国际网络监控</header>
                <div className={styles['content']}>
                    <nav>
                        <NavButtonList selectedTab={contextValue.mode} changeTab={changeTab} display={display} setDisplay={setDisplay} />
                    </nav>
                    <section>
                        <PageModule leftCardWidth={leftCardWidth} setLeftCardWidth={setLeftCardWidth} key={contextValue.mode} />
                    </section>
                </div>
            </div>
        </GlobalStateContext.Provider>
    );
};

export default ResourceMonitor;
