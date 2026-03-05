import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal, message, Tooltip, Button, Icon, Form, Input, DatePicker, Radio, Select, Row, Space, Col, Table } from 'oss-ui';
import type { IModalContentProps } from './types';
import useLoginInfoModel from '@Src/hox';
import { download } from '@Src/common/utils/download';
import ModalFooter from '@Components/custom-modal-footer';
import ModalAlarm from './modal-alarm';
import { selectAlarmView } from '../../api';
import { columns } from '@Src/pages/fault-report/columns';

export default forwardRef((props: IModalContentProps, ref) => {
    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectView, setSelectView] = useState('');

    // 点击确定时需要调用此方法

    useEffect(() => {
        selectAlarmView({ current: 0, pageSize: 0 }).then((res) => {
            if (res.code === 200) {
                setSelectView(res.data.find((item) => item.isDefault === 1));
                setDataSource(res.data || []);
            } else {
                message.error('接口错误');
            }
        });
    }, []);

    return (
        <>
            <Form layout="horizontal" labelCol={{ span: 4 }} labelAlign="left" wrapperCol={{ span: 14 }}>
                <Form.Item required label="视图名称">
                    <Radio.Group value={selectView.id} onChange={(e) => setSelectView(dataSource.find((item) => e.target.value === item.id))}>
                        <Space direction="vertical" style={{ paddingTop: '4px' }}>
                            {dataSource.map((item) => {
                                return <Radio value={item.id}>{item.viewName}</Radio>;
                            })}
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Form>
            <ModalFooter
                onOk={() => {
                    setVisible(true);
                }}
                onCancel={props.onCancel}
            />
            <ModalAlarm
                title="告警视图"
                width={1000}
                destroyOnClose
                bodyStyle={{ padding: '0 12px 12px' }}
                contentProps={{ selectView, planDetail: props.planDetail }}
                onCancel={() => setVisible(false)}
                visible={visible}
            />
        </>
    );
});
