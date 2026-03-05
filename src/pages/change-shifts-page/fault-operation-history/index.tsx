import React, { useEffect, useState } from 'react';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { TableIndex } from './compoents/table';
import api from '../api';
import './index.less';

/**
 *  交接班-故障记录操作历史查询
 */
function FaultOperationHistory(props) {
    const [dic, setDic] = useState([]);

    const { userId, provinceId } = useLoginInfoModel();

    useEffect(() => {
        const dicKey = 'dutyProfessional';
        api.professionDic(dicKey).then((res) => {
            setDic(
                res.data[`${dicKey}`].map((item) => {
                    return { label: item.value, value: item.key };
                }),
            );
        });
    }, [userId]);

    return <TableIndex userId={userId} provinceId={provinceId} frameInfo={props.appConfig} professionDic={dic} />;
}

export default withModel([useLoginInfoModel, useEnvironmentModel], (sysInfo) => ({
    login: sysInfo[0],
    envConfig: sysInfo[1],
}))(FaultOperationHistory);
