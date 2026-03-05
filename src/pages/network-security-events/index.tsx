import React, { useEffect, useState } from 'react';
import { withModel } from 'hox';

import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { TableIndex } from './compoents/table';
import { api } from './utils';

/**
 *  交接班-网络安全事件
 */
function NetworkSecurityEvents(props) {
    const [dic, setDic] = useState([]);
    useEffect(() => {
        api.professionalDic().then((res) => {
            setDic([
                { label: '全部', value: '-1' },
                ...res.data.map((item) => {
                    return { label: item.txt, value: item.id.toString() };
                }),
            ]);
        });
    }, [props.login.userId]);
    return <TableIndex loginInfo={props.login} professionDic={dic} />;
}

export default withModel([useLoginInfoModel, useEnvironmentModel], (sysInfo) => ({
    login: sysInfo[0],
    envConfig: sysInfo[1],
}))(NetworkSecurityEvents);
