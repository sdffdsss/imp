import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import { sendLogFn } from '@Pages/components/auth/utils';
import TextEdit from '../components/text-edit';
import CommonWrapper from '../../components/common-wrapper';
import './index.less';

function Index({ title, pattern, schedulingObj, saveItemInfoCb, loginInfo, moduleId }, ref) {
    function handleSave(value) {
        sendLogFn({ authKey: 'workbench-Workbench-ReInsurance-Condition-Save' });
        saveItemInfoCb('reinsurance', 'reinsuranceSituation', {
            operationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            userName: loginInfo.userName,
            userId: loginInfo.userId,
            content: value,
        });
    }
    const textEditRef = useRef(schedulingObj?.reinsuranceSituation?.content || '');
    const textChange = (value) => {
        textEditRef.current = value;
    };
    useImperativeHandle(ref, () => {
        return {
            upDateMap: () => {
                return {
                    modifyScope: 'reinsurance',
                    fieldName: 'reinsuranceSituation',
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
                <TextEdit
                    pattern={pattern}
                    value={schedulingObj?.reinsuranceSituation}
                    onSave={handleSave}
                    maxLength={2000}
                    textChange={textChange}
                />
            </div>
        </CommonWrapper>
    );
}
export default forwardRef(Index);
