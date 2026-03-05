import React, { useState, useEffect } from 'react';
import { Form } from 'oss-ui';

// import data from './data.json';
import moment from 'moment';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';

const Index = (props) => {
    const userInFo = JSON.parse(props.login.userInfo) || 'admin';
    const [data] = useState(props.alarmClickTarget);
    const [noticeList, setNoticeList] = useState({});

    useEffect(() => {
        let type = '';
        if (data.professional_type.value === '14') {
            type = 'O';
        } else if (data.professional_type.value === '4') {
            type = 'D';
        } else if (data.professional_type.value === '8') {
            type = 'J';
        } else {
            type = 'Z';
        }
        const obj = {
            title: `${moment(data?.event_time?.lable).format('YYMMDDHHmm')}-${data?.region_name?.lable}-${
                data?.ne_label?.lable
            }-${data.title_text.lable}`,
            content: `网络故障重要通知：${moment(data?.event_time?.lable).format('YYYY年MM月DD日 HH:mm:ss')}，${
                data?.region_name?.lable
            }${data?.ne_label?.lable}发生${data?.title_text?.lable}，已通知${
                data?.region_name?.lable
            }分公司尽快处理并及时反馈故障原因。`,
            staffid: userInFo.loginId,
            level: 'S5',
            reportlevel: 'L3',
            type,
            time: data?.event_time?.lable,
            url: '',
            branchareaid: `${data?.region_name?.lable}分公司`,
            Starttime: data?.event_time?.lable,
            staInterCount: '',
            oltInterCount: '',
            impUserCount: '',
        };
        props.menuComponentFormRef.current?.setFieldsValue({
            data: obj,
        });
        setNoticeList(obj);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const onCancel = () => {
    //     setVisible(false);
    // };

    // const onOk = () => {
    //     request('v1/syncAlarmInfo', {
    //         type: 'post',
    //         baseUrlType: 'noticeUrl',
    //         showSuccessMessage: false,
    //         defaultErrorMessage: '保存数据失败',
    //         data: noticeList,
    //     })
    //         .then((res) => {
    //             if (res.code === 0) {
    //                 Message.success('发布成功');
    //                 setVisible(false);
    //             } else {
    //                 Message.error(res.message);
    //                 setVisible(false);
    //             }
    //             console.log(res);
    //         })
    //         .catch((err) => {});
    // };
    return (
        <div
        // title="重要通知确认"
        // visible={visible}
        // onOk={onOk}
        // onCancel={onCancel}
        >
            <Form ref={props.menuComponentFormRef}>
                <Form.Item label="上报标题">
                    <span>{noticeList.title}</span>
                </Form.Item>
                <Form.Item label="上报内容">
                    <span>{noticeList.content}</span>
                </Form.Item>
                <Form.Item label="上报人员账号">
                    <span>{noticeList.staffid}</span>
                </Form.Item>
                <Form.Item label="故障等级">
                    <span>{noticeList.level}</span>
                </Form.Item>
                <Form.Item label="重要通知等级">
                    <span>{noticeList.reportlevel}</span>
                </Form.Item>
                <Form.Item label="故障类型">
                    <span>{noticeList.type}</span>
                </Form.Item>
                <Form.Item label="发生时间">
                    <span>{noticeList.time}</span>
                </Form.Item>
                <Form.Item label="链接地址">
                    <span>{noticeList.url}</span>
                </Form.Item>
                <Form.Item label="故障所属分公司">
                    <span>{noticeList.branchareaid}</span>
                </Form.Item>
                <Form.Item label="开始时间">
                    <span>{noticeList.Starttime}</span>
                </Form.Item>
                <Form.Item label="基站中断个数">
                    <span>{noticeList.staInterCount}</span>
                </Form.Item>
                <Form.Item label="OLT中断个数">
                    <span>{noticeList.oltInterCount}</span>
                </Form.Item>
                <Form.Item label="影响用户数">
                    <span>{noticeList.impUserCount}</span>
                </Form.Item>
            </Form>
        </div>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
