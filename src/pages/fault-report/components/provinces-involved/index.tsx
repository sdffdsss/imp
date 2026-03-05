import React, { FC, useEffect, useState } from 'react';
import { Select, Col, Form } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import { getProvinceList } from '../../api';

interface Props {}

const FormSelect = (props) => {
    const { value, onChange } = props;

    const { userId } = useLoginInfoModel();
    const [selectedItems, setSelectedItems] = useState<string[]>(['0']);
    const [pronvinceList, setPronvinceList] = useState<any[]>([]);

    useEffect(() => {
        if (!value) {
            onChange('0');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPronvinceList = async () => {
        const data = {
            creator: userId,
            // provinceId: zoneId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const Reg = /(^自管节点)|(\D大区$)|澳门|香港|台湾/;
            const list = res.filter((item) => !Reg.test(item.regionName));
            list.unshift({ regionName: '全选', regionId: 'all' });
            const optionList = list.map((item) => ({
                label: item.regionName,
                value: item.regionId,
            }));
            setPronvinceList(optionList);
        }
    };

    useEffect(() => {
        getPronvinceList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (value) {
            const newValue = value?.split(',');
            onChange(value);
            setSelectedItems(value ? newValue : []);
        }
    }, [value, onChange]);

    const onSelectChange = (values: string[]) => {
        let newValues = values;
        // 如果点击了全选
        if (values.includes('all')) {
            // 已经全选 则点击全部不选中
            if (selectedItems.length === pronvinceList.length - 1) {
                newValues = [];
            } else {
                // 还没有全选 则点击全选
                newValues = pronvinceList.map((item) => item.value);
            }
        }
        newValues = newValues.filter((item) => item !== 'all');
        onChange(newValues.join(','));
        setSelectedItems(newValues);
    };

    return (
        <Select
            mode="multiple"
            placeholder="请选择涉及省份！"
            value={selectedItems}
            onChange={onSelectChange}
            optionLabelProp="label"
            style={{ width: '100%' }}
            options={pronvinceList}
            maxTagCount={2}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
    );
};

const ProvincesInvolved: FC<Props> = () => {
    return (
        <Col span={8}>
            <Form.Item
                label="涉及省份"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                name="involvedProvince"
                rules={[{ required: true, message: '请选择涉及省份！' }]}
            >
                <FormSelect />
            </Form.Item>
        </Col>
    );
};

export default ProvincesInvolved;
