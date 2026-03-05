import React from 'react';
import request from '@Common/api';
import { Checkbox, Row, Col } from 'oss-ui';

const CompSheetStatus = (props) => {
    const [sheetStatusEnum, setSheetStatusEnum] = React.useState([]);
    const getDictEntry = (dictName) => {
        return Promise.resolve(
            request('alarmmodel/field/v1/dict/entry', {
                type: 'get',
                baseUrlType: 'filterUrl',
                showSuccessMessage: false,
                defaultErrorMessage: '获取字典键值失败',
                data: {
                    dictName,
                    en: false,
                    modelId: 2,
                    creator: props.userId,
                    clientRequestInfo: JSON.stringify({
                        clientRequestId: 'nomean',
                        clientToken: localStorage.getItem('access_token'),
                    }),
                },
            })
                .then((res) => {
                    if (res && res.data && res.data.length) {
                        return res.data;
                    }
                    return [];
                })
                .catch((err) => {
                    console.error(err);
                    return [];
                })
        );
    };
    const getOptions = async () => {
        const result = await getDictEntry(props.dictName);
        setSheetStatusEnum(result);
    };
    React.useEffect(() => {
        getOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Checkbox.Group
            className={props.className}
            // options={
            //     sheetStatusEnum && sheetStatusEnum.length > 0
            //         ? sheetStatusEnum
            //         : []
            // }  result.map(item=>{return {label:item.value,value:item.key}})
        >
            <Row align="bottom">
                {sheetStatusEnum && sheetStatusEnum.length > 0
                    ? sheetStatusEnum.map((item) => {
                          return (
                              <Col span={4}>
                                  <Checkbox value={item.key}>{item.value}</Checkbox>
                              </Col>
                          );
                      })
                    : []}
            </Row>
        </Checkbox.Group>
    );
};

export default CompSheetStatus;
