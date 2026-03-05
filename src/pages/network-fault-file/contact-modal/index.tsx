import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'oss-ui';
import ContactTable from './contact-table';
import { getContactApi } from '../api';

const Index = (props) => {
    const [data, setData] = useState([]);
    const { onCancel } = props;

    const getData = async () => {
        const params = {
            current: 1,
            pageSize: 0,
        };
        const res = await getContactApi(params);
        if (res.code === 200) {
            setData(res.data);
        }
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <Modal
            title="联系人"
            onCancel={onCancel}
            {...props}
            destroyOnClose
            footer={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={onCancel}>关闭</Button>
                </div>
            }
        >
            <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 20 }}>集团总部各专业联系人信息</div>
            <ContactTable dataSource={data} />
        </Modal>
    );
};

export default Index;
