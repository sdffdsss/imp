import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getWorkStationConfigurationDict } from './api';
import constants from '@Src/common/constants';
import './index.less';

const source = [
    {
        workStationName: '默认工作台',
        workStationConfigType: 0,
    },
    {
        workStationName: '监控工作台',
        workStationConfigType: 1,
    },
    {
        workStationName: '调度工作台',
        workStationConfigType: 2,
    },
];

const Index = () => {
    const history = useHistory();
    const [dataSource, handleDataSource] = useState(source);
    useEffect(() => {
        getWorkStationConfigurationDict().then((res) => {
            if (res && res.data) {
                handleDataSource(res.data);
            }
        });
    }, []);
    const jump = (id) => {
        history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/work-bench`,
            state: { type: id.toString() },
        });
    };
    return (
        <div className="workbench-manage-container">
            {source.map((item) => (
                <div
                    type={item.workStationConfigType}
                    onClick={() => {
                        jump(item.workStationConfigType);
                    }}
                >
                    {item.workStationName}
                </div>
            ))}
        </div>
    );
};

export default Index;
