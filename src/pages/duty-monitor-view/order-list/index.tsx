import React from 'react';
import './index.less';
import TitleSvg from '../img/表头.svg';
import { Image } from 'oss-ui';
import Api from '../api.jsx';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
const OrderList = (props) => {
    const { title, dataSource } = props;
    const { loginId } = useLoginInfoModel();
    // const cutoverList = [
    //     {
    //         title: '江苏省南京市:东南三环南京丹凤街割接申请江苏省南京市东南三环南京丹凤街割接申请',
    //         number: 'JS/LF/E07 202301-000012',
    //         time: '2023-03-01 15:40:12',
    //         name: '张博',
    //         phone: '18601101827',
    //     },
    //     {
    //         title: '江苏省南京市:东南三环南京丹凤街割接申请江苏省南京市东南三环南京丹凤街割接申请',
    //         number: 'JS/LF/E07 202301-000012',
    //         time: '2023-03-01 15:40:12',
    //         name: '张博',
    //         phone: '18601101827',
    //     },
    //     {
    //         title: '江苏省南京市:东南三环南京丹凤街割接申请江苏省南京市',
    //         number: 'JS/LF/E07 202301-000012',
    //         time: '2023-03-01 15:40:12',
    //         name: '张博',
    //         phone: '18601101827',
    //     },
    // ];
    const jumpToDetail = (sheetNo) => {
        Api.getCutSheetDataDetailUrl({ sheetNumber: sheetNo, logInId: loginId }).then((res) => {
            if (res.data) {
                window.open(res.data);
            }
        });
    };

    return (
        <div className="order-list-page">
            <div className="duty-view-title">{title}</div>
            <div className="order-list-page-content">
                {dataSource && dataSource.length
                    ? dataSource.map((item, index) => {
                          if (props.title === '工程割接列表') {
                              const { sheetNumber, startTime, endTime, province, sheetTopic, applicant, applicationTel } = item || {};
                              return (
                                  <div className="order-list-page-content-item">
                                      <div className="order-list-page-content-item-left">
                                          <Image src={TitleSvg} preview={false} width={14} />
                                      </div>
                                      <div className="order-list-page-content-item-right">
                                          <div className="order-list-page-content-item-right-title">{sheetTopic}</div>
                                          <div className="order-list-page-content-item-right-number" onClick={() => jumpToDetail(sheetNumber)}>
                                              {sheetNumber}
                                          </div>
                                          <div className="order-list-page-content-item-right-time">{startTime}</div>
                                          {/* <div className="order-list-page-content-item-right-time">{endTime}</div> */}
                                          <div className="order-list-page-content-item-right-bottom">
                                              <div className="order-list-page-content-item-right-bottom-province">
                                                  <span>{province}</span>
                                              </div>
                                              <div className="order-list-page-content-item-right-bottom-application">
                                                  <span>{applicant}</span>
                                                  <span>{applicationTel}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          }
                          const { title, sheetNo, forwardTime, sender, senderTel, sheetStatus } = item || {};
                          return (
                              <div className={`order-list-page-content-item ${sheetStatus === '已归档' ? 'filed-order' : undefined}`}>
                                  <div className="order-list-page-content-item-left">
                                      <Image src={TitleSvg} preview={false} width={14} />
                                  </div>
                                  <div className="order-list-page-content-item-right">
                                      <div className="order-list-page-content-item-right-title">{title}</div>
                                      <div className="order-list-page-content-item-right-number">{sheetNo}</div>
                                      <div className="order-list-page-content-item-right-time">{forwardTime}</div>
                                      <div className="order-list-page-content-item-right-info">
                                          <span>{sender}</span>
                                          <span>{senderTel}</span>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
};

export default OrderList;
