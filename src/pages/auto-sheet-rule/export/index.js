import React, { PureComponent } from 'react';
import { Icon, message, Tooltip } from 'oss-ui';
import request from '@Src/common/api';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';
import { getCommonMsgWithSelectFilter } from '../utils';
import AuthButton from '@Src/components/auth-button';

export default class index extends PureComponent {
    msg = getCommonMsgWithSelectFilter(this.props.data.moduleId);

    onExport = (moduleId, data) => {
        if (!data || !data.filterId) {
            message.error(`请选择${this.msg}`);
            return;
        }
        request('alarmmodel/filter/v1/filter/exports', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '导出失败，请检查服务',
            responseType: 'blob',
            data: {
                modelId: 2,
                exportIdList: `${data.filterId}`,
                moduleId,
            },
        }).then((res) => {
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
        });
    };
    getAuthKey = () => {
        // const { moduleId } = this.props;
        // switch (moduleId) {
        //     case '604':
        //         return 'crhSheetRuleManage:export';
        //     case '605':
        //         return 'superviseSheetRuleManage:export';
        //     default:
        //     }
        return 'sheetRuleManage:export';
    };
    render() {
        const { iconMode, data = {} } = this.props;
        const { moduleId } = data;
        const authKey = this.getAuthKey();
        return iconMode ? (
            <Tooltip title="导出">
                <AuthButton onClick={_.partial(this.onExport, moduleId, data)} authKey={authKey} type="text" style={{ padding: 0 }}>
                    <Icon antdIcon title="导出" type="ExportOutlined" />
                </AuthButton>
            </Tooltip>
        ) : (
            <AuthButton onClick={_.partial(this.onExport, moduleId, data)} authKey={authKey}>
                <Icon antdIcon type="ExportOutlined" />
                导出
            </AuthButton>
        );
    }
}
