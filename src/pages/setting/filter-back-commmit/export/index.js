import React, { PureComponent } from 'react';
import { Button, Icon, message, Tooltip } from 'oss-ui';
import request from '@Common/api';

export default class index extends PureComponent {
    onExport = () => {
        const { data } = this.props;

        if (!data) {
            message.error('请选择过滤器');

            return;
        }

        request('sysadminFilter/export-filter', {
            type: 'post',
            baseUrlType: 'filter',
            showSuccessMessage: false,
            data: {
                iceEndpoint: 'SysadminServer:default -h 10.10.1.170 -p 4508',
                listInteger: [0],
            },
        });
    };

    render() {
        const { iconMode } = this.props;

        return iconMode ? (
            <Tooltip title="导出">
                <Icon antdIcon title="导出" type="ExportOutlined" onClick={this.onExport} />
            </Tooltip>
        ) : (
            <Button onClick={this.onExport}>
                <Icon antdIcon type="ExportOutlined" />
                导出
            </Button>
        );
    }
}
