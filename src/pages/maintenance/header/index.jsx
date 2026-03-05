import React from 'react';
import { Button } from 'oss-ui';
import constants from '@Common/constants';
import './index.less';

const Index = (props) => {
    const teamInfo = props?.location?.state?.mteamInfo || {};
    const { provinceName, professionalName, mteamModelName, mteamName, type } = teamInfo;
    const hanldeBack = () => {
        props.pageInfo.setLoadType('keepAlive');
        props.history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/maintain-team`);
    };
    const leftContentSource = [
        {
            title: '归属省份',
            value: provinceName || '-',
        },
        {
            title: '归属专业',
            value: professionalName || '-',
        },
        {
            title: '班组模式',
            value: mteamModelName || '-',
        },
        {
            title: '班组名称',
            value: mteamName || '-',
        },
    ];
    return (
        <div className="maintenance-header">
            {type === '3' ? (
                <div className="left-content">
                    <label>默认接单人配置</label>
                </div>
            ) : (
                <div className="left-content">
                    {leftContentSource.map((item) => {
                        return (
                            <>
                                <label>{item.title}：</label>
                                <span>{item.value}</span>
                            </>
                        );
                    })}
                </div>
            )}
            <Button
                key={10}
                onClick={() => {
                    hanldeBack();
                }}
            >
                返回
            </Button>
        </div>
    );
};

export default Index;
