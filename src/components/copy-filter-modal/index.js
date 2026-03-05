import React, { useState, useRef } from 'react';
import { Button, Radio, Input, Modal, Icon, Table, message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { withModel } from 'hox';
import CustomModalFooter from '@Components/custom-modal-footer';
import useLoginInfoModel from '@Src/hox';
import request from '@Src/common/api';
import { useEffect } from 'react';

const CopyFilterModal = (props) => {
    const { onCancel, conditionExprChange } = props;

    const [isPrivate, setIsPrivate] = useState(1);
    const [data, setData] = useState([]);
    const [keyWord, setKeyWord] = useState('');
    const filterId = useRef(null);
    const columns = [
        {
            title: '过滤器名称',
            dataIndex: 'filterName',
            key: 'filterName',
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
    ];
    const userInFo = JSON.parse(props.login.userInfo);
    const zoneInfo = userInFo?.zones;

    useEffect(() => {
        getData();
    }, [isPrivate, keyWord]);

    const getData = () => {
        const param = {
            needConditionList: isPrivate,
            filterProvince: zoneInfo && zoneInfo[0]?.zoneLevel === '1' ? '' : zoneInfo && zoneInfo[0]?.zoneLevel_2Id?.toString(),
            creator: props.login.userId,
            filterName: keyWord,
        };
        request('interruptalarm/filter/v1/filters?modelId=2&moduleId=1&orderFieldName=createTime&order=2&current=1&pageSize=99999', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: param,
        }).then((res) => {
            if (res && res.data) {
                setData(res.data);
            } else {
                setData([]);
            }
        });
    };

    const handleOk = () => {
        console.log(filterId.current);
        if (!filterId.current) {
            message.error('请选择过滤器');
            return;
        }
        const param = { filterIds: filterId.current };
        request('alarmmodel/filter/v1/filter/getConditions', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: param,
        }).then((res) => {
            if (res && res.data) {
                conditionExprChange(res.data);
                onCancel();
            }
        });
    };

    const isPrivateChange = (e) => {
        filterId.current = null;
        setIsPrivate(e.target.value);
    };

    const onChange = (value) => {
        filterId.current = value[0];
    };

    return (
        <Modal
            zIndex={1001}
            visible={true}
            title="选择"
            centered
            className="condition-modal-wrapper"
            width={970}
            onCancel={onCancel}
            maskClosable={false}
            // getContainer={this.props.container}
            footer={<CustomModalFooter onCancel={onCancel} onOk={handleOk} />}
        >
            <div style={{ display: 'flex', margin: '0 10px 20px 0', alignItems: 'center' }}>
                <div>
                    <Radio.Group onChange={isPrivateChange} value={isPrivate}>
                        <Radio value={1}>我的过滤器</Radio>
                        <Radio value={2}>其他人过滤器</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <Input.Search placeholder="请输入条件" onSearch={(value) => setKeyWord(value)} style={{ width: 200 }} />
                </div>
            </div>
            <Table
                rowKey={(record) => record.filterId}
                columns={columns}
                dataSource={data}
                rowSelection={{ type: 'radio', onChange: onChange }}
                pagination={false}
            ></Table>
        </Modal>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(CopyFilterModal);
