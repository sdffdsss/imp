import React from 'react';
import { Form, Input, message } from 'oss-ui';
import api from '../api';

/** *
 * 脚本详情
 */
export default React.forwardRef((props, ref) => {
    /** *
     * 脚本 详情数据加载
     */
    const showScript = (val) => {
        ref.current.setFieldsValue({
            description: val.result
        });
        // api.getScriptsDesc(
        //     val,
        //     (data) => {
        //         let description = '';
        //         if (!data.scriptDescription || data.scriptDescription.length === 0) {
        //             description = '未查询到脚本信息，请联系管理员。';
        //         } else {
        //             description = data.scriptDescription;
        //         }
        //         ref.current.setFieldsValue({
        //             description: description,
        //         });
        //     },
        //     (error) => {
        //         message.error(error.desc);
        //     }
        // );
    };
    React.useEffect(() => {
        if (ref.current) {
            showScript(props.result);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current]);

    return (
        <Form ref={ref} name="preTreatDesc">
            <Form.Item name="description">
                <Input.TextArea autoSize={true} allowClear></Input.TextArea>
            </Form.Item>
        </Form>
    );
});
