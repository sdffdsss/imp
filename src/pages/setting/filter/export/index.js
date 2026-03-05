import React, { PureComponent } from 'react';
import { Icon, message, Tooltip } from 'oss-ui';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { getCommonMsgWithSelectFilter } from '../utils';
import { exportFilter } from '../api';
import AuthButton from '@Src/components/auth-button';

export default class index extends PureComponent {
    msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);

    onExport = async (moduleId, data) => {
        if (!data || !data.filterId) {
            message.error(`请选择${this.msg}`);
            return;
        }
        const params = {
            modelId: 2,
            exportIdList: `${data.filterId}`,
            moduleId: this.props.moduleId,
        };
        const res = await exportFilter(params);
        if (!res) return;
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || window.moxURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = `${this.msg}导出${moment().format('YYYYMMDDHHmmss')}.xls`;
        // 触发点击事件执行下载
        downloadLink.click();
    };

    render() {
        const { iconMode, data = {}, buttonKes, moduleId } = this.props;

        return iconMode ? (
            <Tooltip title="导出">
                <AuthButton
                    onClick={_.partial(this.onExport, data.moduleId || moduleId, data)}
                    authKey={buttonKes?.export[moduleId]}
                    type="text"
                    style={{ padding: 0 }}
                >
                    <Icon antdIcon title="导出" type="ExportOutlined" />
                </AuthButton>
            </Tooltip>
        ) : (
            <AuthButton onClick={_.partial(this.onExport, data.moduleId, data)} authKey={buttonKes?.export[moduleId]}>
                <Icon antdIcon type="ExportOutlined" />
                导出
            </AuthButton>
        );
    }
}
