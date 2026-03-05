import React, { FC, useEffect, useRef, useState } from 'react';
import type { DropDownProps } from 'antd/es/dropdown';
import { Dropdown, Icon, Input, Space, Button } from 'oss-ui';
import DndList from '@Pages/components/dnd-list';
import style from './style.module.less';

type DataType = Record<string, any>[] &
    {
        value: boolean;
        label: string;
        disabled?: boolean;
    }[];

interface Props extends DropDownProps {
    data: DataType;
    fixedTop?: number; // 业务中顶部不可以排序移动项目数
    fixedBottom?: number; // 业务底顶部不可以排序移动项目数
    onSave?: (data: DataType) => void;
}

let centerCache = [];

const ModuleManagement: FC<Props> = (props) => {
    const { data, onSave, fixedTop = 0, fixedBottom = 0, ...otherProps } = props;

    const contentRef = useRef<any>();

    const [left, setLeft] = useState<any[]>([]); // 头部展示项目数据不可移动
    const [right, setRight] = useState<any[]>([]); // 底部展示项目数据不可移动
    const [center, setCenter] = useState<any[]>([]); // 中间展示项目数据可移动
    const [rowSelect, setRowSelect] = useState<any[]>([]); // 全量数据
    const [visible, setVisible] = useState<boolean>(false);
    const [operateData, setOperateData] = useState<any[]>([]); // 点击，排序操作的数据记录

    // 初始化整理分割数组
    const initFormat = () => {
        if (fixedTop) {
            const top = data.filter((item, index) => {
                return index + 1 <= fixedTop;
            });
            setLeft(top);
        }
        if (fixedBottom) {
            const bottom = data.filter((item, index) => {
                return index + 1 > data.length - fixedBottom;
            });
            setRight(bottom);
        }
        const centerData = data.filter((item, index) => {
            return index + 1 > fixedTop && index + 1 <= data.length - fixedBottom;
        });
        centerCache = centerData;
        setCenter(centerData);
        setRowSelect(data);
        setOperateData(data);
    };

    // 初始化数据
    useEffect(() => {
        initFormat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, onSave, fixedBottom, fixedTop]);

    // 更新中间数据
    useEffect(() => {
        const centerData = rowSelect.filter((item, index) => {
            return index + 1 > fixedTop && index + 1 <= rowSelect.length - fixedBottom;
        });
        setCenter(centerData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelect]);

    // 数据项搜索
    const handleSearch = (value) => {
        if (!value) {
            // 全量查询
            initFormat();
        } else {
            console.log(left, right, center);
            // 精确查询
            const leftLsit = left.filter((item) => {
                return item.label?.includes(value);
            });
            const rightLsit = right.filter((item) => {
                return item.label?.includes(value);
            });
            const centerLsit = centerCache.filter((item: any) => {
                return item.label?.includes(value);
            });
            setLeft(leftLsit);
            setRight(rightLsit);
            setCenter(centerLsit);
        }
    };

    // 排序后返回的数据
    const dndCallback = (newList) => {
        // 查询出部分数据排序操作

        // 由于dnd只负责排序，并不会对子元素操作状态进行记录，状态都记录在 rowSelect 中所以需要使用 rowSelect 对 dnd 返回的数据进行覆写清洗
        const currentList = newList.map((item) => {
            const value = operateData.find((element) => element.value === item.value);
            return {
                ...item,
                ...value,
            };
        });

        // 在全量数据中匹配到的每项依次替换为排序后的数据
        const formatList = operateData.map((item) => {
            if (newList.some((item2) => item2.value === item.value)) {
                // 理解为一个栈，每次处理完剔除第一项
                const value = currentList[0];
                currentList.shift();
                return value;
            }
            return item;
        });

        setOperateData(formatList);
    };

    const handleSaveChange = () => {
        // 保存时
        setVisible(false);
        // 返回操作数据
        onSave?.(operateData);

        setTimeout(() => {
            // 更新 RowSelect 数据 防止排序后关闭选项跳动问题
            setRowSelect(operateData);
        }, 500);
    };

    const onCancel = () => {
        // 取消时将操作数据置为 rowSelect 数据
        setOperateData(rowSelect);
        setVisible(false);
    };

    const render = (allData) => {
        const { label } = allData;

        return (
            <div className={style.checkbox}>
                <span>{label}</span>
            </div>
        );
    };

    const content = (
        <div className={style.content}>
            <Input.Search onSearch={handleSearch} />
            <div className={style.group}>
                <div className={style.left}>{left.map((item) => render(item))}</div>
                <DndList data={center} render={render} onChange={dndCallback} />
                <div className={style.right}>{right.map((item) => render(item))}</div>
            </div>
            <div className={style.button}>
                <Space>
                    <Button onClick={onCancel}>取消</Button>
                    <Button type="primary" onClick={handleSaveChange}>
                        完成
                    </Button>
                </Space>
            </div>
        </div>
    );

    const onVisibleChange = (open: boolean) => {
        if (!open) {
            // 点击其他地方关闭时将操作数据置为 rowSelect 数据
            setOperateData(rowSelect);
        }
        setVisible(open);
    };

    return (
        <Dropdown
            {...otherProps}
            overlay={content}
            visible={visible}
            trigger={['click']}
            // getPopupContainer={() => contentRef.current}
            onVisibleChange={onVisibleChange}
            destroyPopupOnHide
            className={style.dropDown}
            overlayStyle={{ zIndex: 10001 }}
        >
            <span ref={contentRef}>
                <Button icon={<Icon antdIcon type="SettingOutlined" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} type="link">
                    <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>管理</span>
                </Button>
            </span>
        </Dropdown>
    );
};

export default ModuleManagement;
