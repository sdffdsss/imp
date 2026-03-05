import React, { FC } from 'react';
import { Form, Col, Input } from 'oss-ui';
import { CATEGORY_PUBLIC, CATEGORY_COMPLAINT } from '../../type';

interface Props {
    currentCategory: string;
}

const PublicSentiment: FC<Props> = (props) => {
    const { currentCategory } = props;
    return (
        <>
            {currentCategory === CATEGORY_PUBLIC && (
                <>
                    <Col span={8}>
                        <Form.Item label="大V名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="vName">
                            <Input maxLength={20} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="粉丝数量" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="fansCount">
                            <Input maxLength={20} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="转评数量" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="forwardCommentsCount">
                            <Input maxLength={20} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="舆情声量" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="voiceInfo">
                            <Input maxLength={40} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="舆情链接" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="linkAddress">
                            <Input maxLength={40} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                </>
            )}

            {currentCategory === CATEGORY_COMPLAINT && (
                <Col span={8}>
                    <Form.Item label="案例号码" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name="caseNum">
                        <Input maxLength={200} placeholder="请输入" />
                    </Form.Item>
                </Col>
            )}
        </>
    );
};

export default PublicSentiment;
