import { DataSource } from '@Components/fail-progress-timeline/type';
/**
 * description 整合工单流程数据
 * @param progressList {any[]} 流程通知列表 
 * @param noticeList {any[]} 调度通知列表
 * @return {DataSource[]}
 */

export const parseDataSource = (progressList, noticeList): DataSource[] => {
  const arr: any = [];
  progressList.forEach((item, index) => {
      const currNoticeList = noticeList.filter((notice) => {
          return (
              notice.noticeTime >= item.operateTime && (progressList[index + 1] ? notice.noticeTime < progressList[index + 1].operateTime : true)
          );
      });
      arr.push({
          ...item,
          noticeList: currNoticeList,
      });
  });
  return arr;
};