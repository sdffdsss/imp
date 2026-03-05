import React, { useEffect, useState, FC } from 'react';
import { Form, Col, Input, Select } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getCableSectionList } from '../api';

const { Option } = Select;

interface Props {}

const TrunkCableField: FC<Props> = () => {
    const [cableSection, setCableSection] = useState<any[]>([]);
    const loginInfo = useLoginInfoModel();

    const getEnum = async () => {
        const data = {
            regionId: loginInfo.provinceId,
        };
        const res = await getCableSectionList(data);
        if (+res.code === 200) {
            setCableSection(res.data);
        }
    };

    useEffect(() => {
        getEnum();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Col span={8}>
                <Form.Item label="传输段" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }} name="transSegId">
                    <Select 
                    placeholder="请选择" 
                    allowClear 
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    filterOption={(input, option: any) =>{
                        return  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }}
                    >
                        {cableSection.map((item) => {
                            return (
                                <Option key={item.dCode} value={item.dCode}>
                                    {item.dName}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="传输系统" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }} name="transSystem">
                    <Input maxLength={50} placeholder="请输入" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="光缆段" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="reuseTransSeg">
                    <Input maxLength={50} placeholder="请输入" />
                </Form.Item>
            </Col>
        </>
    );
};

export default TrunkCableField;
