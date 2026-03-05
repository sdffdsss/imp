import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import TextEdit from '../components/text-edit';
import CommonWrapper from '../../components/common-wrapper';
import './index.less';

function Index({ title, pattern, schedulingObj, saveItemInfoCb, loginInfo, moduleId }, ref) {
    const textEditRef = useRef(schedulingObj?.majorFaultSituation?.content || '');
    const textChange = (value) => {
        textEditRef.current = value;
    };
    function handleSave(value) {
        saveItemInfoCb('majorFault', 'majorFaultSituation', {
            operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            userName: loginInfo.userName,
            userId: loginInfo.userId,
            content: value,
        });
    }
    useImperativeHandle(ref, () => {
        return {
            upDateMap: () => {
                return {
                    modifyScope: 'majorFault',
                    fieldName: 'majorFaultSituation',
                    value: {
                        operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        userName: loginInfo.userName,
                        userId: loginInfo.userId,
                        content: textEditRef.current,
                    },
                };
            },
        };
    });
    return (
        <CommonWrapper title={title} moduleId={moduleId}>
            <div className="text-show-wrapper">
                <TextEdit pattern={pattern} value={schedulingObj?.majorFaultSituation} onSave={handleSave} maxLength={2000} textChange={textChange} />
            </div>
        </CommonWrapper>
    );
}
export default forwardRef(Index);
