import React from 'react';
import constants from '@Src/common/constants';
import { Button } from 'oss-ui';
import { useHistory } from 'react-router-dom';
import PageContainer from '@Src/components/page-container';
import EditContent from './edit-content';
import ViewContent from './view-content';
import './index.less';

const Edit = (props) => {
    const urlNoticeId = localStorage.getItem('noticeId');
    const title = { new: '新建', edit: '编辑', view: '通知详情' };

    const history = useHistory();

    const modelType = props.match.params.type;
    const noticId = props.location?.state?.noticeId;

    const goBack = () => {
        if (urlNoticeId) {
            localStorage.removeItem('noticeId');
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench`);
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification`);
        }
    };

    return (
        <PageContainer
            className="fault-scheduling-container"
            gridContentStyle={{ height: `calc(100% - 51px)` }}
            title={
                <div className="volume-title">
                    <span className="volume-form-box"></span>
                    <span>{title[`${modelType}`]}</span>
                    {modelType === 'view' && (
                        <Button className="go-back" onClick={goBack}>
                            返回
                        </Button>
                    )}
                </div>
            }
        >
            {modelType === 'view' ? <ViewContent noticeId={noticId} /> : <EditContent type={modelType} noticeId={noticId} />}
        </PageContainer>
    );
};

export default Edit;
