import request from '@Src/common/api';
import { AlarmSheetDetailJson, AlarmSheetInfoParams, AlarmSheetJson, AlarmSheetParams, SupplementDetailJson, SupplementListJson, SupplementListParam } from '@Src/common/interface/interface';
import { apiWrapper } from '@Common/utils/apiWrapper';

const baseUrlType = 'supplementUrl';

@apiWrapper
class SupplementApi {
  async getSupplementList(data: SupplementListParam): Promise<{ rows: SupplementListJson[], total: number }> {
    const result = await request('supplementDispatch/queryTaskList', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data
    });
    return result;
  }

  async getAlarmSheetInfo(data: AlarmSheetInfoParams): Promise<{ rows: AlarmSheetJson[], total: number }> {
    const result = await request('supplementDispatch/queryAlarmSheetInfo', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data
    });
    return result;
  }

  async checkTaskName(taskName: string, provinceId: string): Promise<boolean> {
    const result = await request('supplementDispatch/checkTaskName', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data: { taskName, provinceId }
    });
    return result.code === 200;
  }

  async saveSupplementTask(data: AlarmSheetParams, params: any) {
    const result = await request('supplementDispatch/saveOneTask', {
      type: 'post',
      baseUrlType,
      defaultSuccessMessage: '保存成功',
      data,
      handlers: {
        params,
      },
    });
    return result;
  }

  async deleteSupplementTask(taskId: number, params: any) {
    const result = await request('supplementDispatch/deleteOneTask', {
      type: 'post',
      baseUrlType,
      defaultSuccessMessage: '删除成功',
      data: { taskId },
      handlers: {
        params,
      },
    });
    return result;
  }

  async getSupplementTaskDetail(taskId: number): Promise<AlarmSheetParams> {
    const result = await request('supplementDispatch/queryTaskById', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data: { taskId }
    });
    return result?.data || {};
  }

  async getTaskDetail(taskId: number): Promise<SupplementDetailJson> {
    const result = await request('supplementDispatch/getTaskDetail', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data: { taskId }
    });
    return result?.data || {};
  }

  async getAlarmSheetDetail(data: { taskId: number; pageSize: number; pageNum: number }): Promise<{ rows: AlarmSheetDetailJson[]; total: number }> {
    const result = await request('supplementDispatch/getAlarmSheetDetail', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data
    });
    return result;
  }
  
  async exportAlarmSheetDetail(data: { taskId: number; pageSize: number; pageNum: number }): Promise<string> {
    const result = await request('supplementDispatch/exportAlarmSheetDetail', {
      type: 'post',
      baseUrlType,
      showSuccessMessage: false,
      data
    });
    return result?.fileurl;
  }
}

export const supplementApi = new SupplementApi();
