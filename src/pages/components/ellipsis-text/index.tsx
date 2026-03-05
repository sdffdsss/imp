import React, { FC, useRef, useEffect, useState } from 'react';
import { Tooltip } from 'oss-ui';

import './style.less';

interface Props {
    text: string;
    maxLength?: number;
    maxWidth?: number;
    emptyText?: string | React.ReactDOM;
}

const EllipsisText: FC<Props> = (props) => {
    const { text, maxLength, maxWidth, emptyText } = props;

    const boxRef = useRef<HTMLInputElement>(null);
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const boxElement = boxRef.current;

        if (boxElement) {
            setVisible(boxElement.scrollWidth > boxElement.clientWidth);
        }
      }, []);

    // 无值时展示
    if (!text) {
        return emptyText ? <>{emptyText}</> : <>-</>;
    }

    // 字数省略
    if (maxLength) {
        const renderText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
        return (
            <div>
                {text.length > maxLength ? (
                    <Tooltip title={text}>
                        <div className="ellipsis-box">{renderText}</div>
                    </Tooltip>
                ) : (
                    text
                )}
            </div>
        );
    }

    // 宽度省略
    if (maxWidth && visible) {
        return (
            <Tooltip title={text}>
                <div className="ellipsis-box-width" style={{maxWidth}} ref={boxRef}>{text}</div>
            </Tooltip>
        );
    }


    return <div className="ellipsis-box-width">{text}</div>
};

export default EllipsisText;
