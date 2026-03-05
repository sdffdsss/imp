/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import { number, func, string, boolean } from 'prop-types';
import './style.less';

import classnames from 'classnames';

const ResizeableTitle = (props) => {
    const { onResize, width, resizeType, isLastColumn, ...restProps } = props;

    // 添加偏移量
    const [offset, setOffset] = useState(0);

    if (!width) {
        return <th {...restProps} />;
    }

    let handlerEventProps = {};
    // 性能模式先拖拽 鼠标放开则变化
    if (resizeType === 'performance') {
        handlerEventProps = {
            // 宽度重新计算结果，表头应当加上偏移量，这样拖拽结束的时候能够计算结果；
            // 当然在停止事件再计算应当一样，我没试过（笑）
            width: width + offset,
            // 拖拽事件实时更新
            onResize: (e, { size }) => {
                // 这里只更新偏移量，数据列表其实并没有伸缩
                setOffset(size.width - width);
            },
            // 拖拽结束更新
            onResizeStop: (...argu) => {
                // 拖拽结束以后偏移量归零
                setOffset(0);
                // 这里是props传进来的事件，在外部是列数据中的onHeaderCell方法提供的事件，请自行研究官方提供的案例
                onResize && onResize(...argu);
                window.getSelection()?.removeAllRanges();
            },
            handle: (
                <span
                    className={classnames(['react-resizable-handle', offset && 'active'])}
                    style={{ transform: `translateX(${offset}px)` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            ),
        };
    }
    // 效率模式拖拽即变化
    if (resizeType === 'efficiency') {
        handlerEventProps = {
            // 拖拽事件实时更新
            width,
            onResize,
            handle: (
                <span
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            ),
        };
    }

    return isLastColumn ? (
        <th {...restProps} />
    ) : (
        <Resizable height={0} draggableOpts={{ enableUserSelectHack: false }} {...handlerEventProps}>
            <th {...restProps} />
        </Resizable>
    );
};

ResizeableTitle.defaultProps = {
    resizeType: 'performance',
    width: 0,
    isLastColumn: false,
};

ResizeableTitle.propTypes = {
    onResize: func.isRequired,
    width: number,
    resizeType: string,
    isLastColumn: boolean,
};

export { ResizeableTitle };
export default {
    header: {
        cell: ResizeableTitle,
    },
};
