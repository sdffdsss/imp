import React from 'react';
import { Space, Input, Button, Checkbox, Icon } from 'oss-ui';

export default (props) => {
    const {
        disabled,
        rightValues,
        currentSelectedCondition,
        onCheckedOrNotAll,
        onRightNormalValuesChange,
        onTxtNegativeChange,
    } = props;

    const getList = (currentSelectedCondition, keyword = '') => {
        const valueRegions = [];
        // TODO: 目前数据太多先手动过滤显示前30个，以后需要放开
        let count = 0;
        for (const regionKey in currentSelectedCondition.valueRegion) {
            if (currentSelectedCondition.valueRegion[regionKey].toLowerCase().includes(keyword.toLowerCase())) {
                if (count < 30) {
                    count += 1;
                    valueRegions.push({
                        id: regionKey,
                        name: currentSelectedCondition.valueRegion[regionKey],
                    });
                }
            }
        }
        return valueRegions;
    };

    const [list, setList] = React.useState(() => {
        return getList(currentSelectedCondition);
    });

    React.useEffect(() => {
        setList(getList(currentSelectedCondition));
    }, [currentSelectedCondition]);

    const onKeywordChange = (event) => {
        setList(getList(currentSelectedCondition, event.target.value));
    };

    return (
        <>
            <Space>
                <Input
                    disabled={disabled}
                    onChange={onKeywordChange}
                    suffix={<Icon antdIcon type="SearchOutlined" />}
                    style={{ width: 220 }}
                />
                <Button disabled={disabled} onClick={() => onCheckedOrNotAll('checkd', list)}>
                    全选
                </Button>
                <Button disabled={disabled} onClick={() => onCheckedOrNotAll('clear', list)}>
                    清空
                </Button>
                <Checkbox
                    checked={
                        rightValues[currentSelectedCondition.id] &&
                        rightValues[currentSelectedCondition.id].isNegative
                    }
                    disabled={disabled}
                    onChange={onTxtNegativeChange}
                >
                    取反
                </Checkbox>
            </Space>
            <div className="condition-list">
                {list.map((item) => {
                    let checked = false;

                    if (rightValues[currentSelectedCondition.id]) {
                        const valueStringArr = rightValues[currentSelectedCondition.id].valueString.split(',');
                        if (valueStringArr.includes(`${item.id}`)) {
                            checked = true;
                        }
                    }

                    return (
                        <div className="condition-item">
                            <Checkbox
                                disabled={disabled}
                                value={item}
                                checked={checked}
                                onChange={onRightNormalValuesChange}
                            />
                            <span
                                onClick={
                                    !disabled
                                        ? onRightNormalValuesChange.bind(this, {
                                              target: { value: item, checked: !checked },
                                          })
                                        : null
                                }
                                className={`name${checked ? ' active' : ''}`}
                            >
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
