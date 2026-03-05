import React from 'react';
import { Icon, Button } from 'oss-ui';

export default class Default extends React.PureComponent {
    render() {
        const { onConditionValueClear, onConditionDelete, index } = this.props;

        return (
            <div className="condition-action">
                {/* 清除值操作 */}
                <Button style={{ marginLeft: 5, padding: 0 }} type="link" onClick={() => onConditionValueClear(index)}>
                    <Icon type="ClearOutlined" antdIcon />
                </Button>
                {/* 删除条件操作 */}
                <Button style={{ marginLeft: 5, padding: 0 }} type="link" onClick={() => onConditionDelete(index)}>
                    <Icon type="MinusOutlined" antdIcon />
                </Button>
            </div>
        );
    }
}
