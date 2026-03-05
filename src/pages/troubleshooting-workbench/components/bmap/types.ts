import { is } from 'immutable';
import { MAP_MODE } from './config';

type Noop = (...args: any[]) => void;

export type TroubleshootingWorkbenchMapProps = {
    /**
     * 地图类型
     */
    mapMode: MAP_MODE;
    /**
     * 是否在线
     */
    isOnline: boolean;
    /**
     * 区域id
     */
    areaId: 'china' | string;

    /**
     * 所选专业
     */
    selProfessional: any;
    setFloatingWindowInfo: (info: any) => void;
    relatedVisible: boolean;
    setRelatedVisible: (flag: boolean) => void;
} & Partial<{
    /**
     * 强制更新的切换开关，需要从false --> true
     */
    forceReInitFlag: boolean;

    /**
     * 微应用切换，需要强制启动一下地图
     * @returns
     */
    forceReInitMap: () => void;

    /**
     * 启动请求轮询
     * @default true
     */
    enableRequestLoop: boolean;

    /**
     * 请求参数格式化
     * @param type
     * @param args
     * @returns
     */
    requestParamsFormatter: (type: 'heatmap' | 'fault' | 'online', params: any) => Promise<any>;

    /**
     * 容器id
     */
    id: string;

    /**
     * 启动热力图
     */
    enableHeatmap: boolean;
    /**
     * 启动线图
     */
    enableLinemap: boolean;

    /**
     * 判断当前地图是否支持選中
     */
    enableSelect: boolean | ((areaInfo: { id: string; adcode: string; name: string; [p: string]: any }) => boolean);

    /**
     * 判断当前地图是否支持下钻
     */
    enableDrilldown: boolean | ((areaInfo: { id: string; adcode: string; name: string; [p: string]: any }) => boolean);

    /**
     * 支持返回
     */
    enableRollupButton: boolean;

    /**
     * f
     */
    onRollupButtonClick: Noop;

    /**
     * newMsgs
     */
    newMsgs: {
        /**
         * 专业的code
         */
        specialty: any;

        /**
         * failureClass
         */
        failureClass: any;

        /**
         * 通知类型 1:故障通知 2:倒计时通知，3：活动告警，4：清除告警
         */
        notificationType: 1 | 2 | 3 | 4 | 5;
        /**
         * 最新上报状态 1 首报草稿,2 首报上报,3续报草稿,4 续报上报,5终报草稿,6终报上报
         */
        latestReportStatus: 1 | 2 | 3 | 4 | 5 | 6;

        /**
         * cityName
         */
        cityName: any;

        /**
         * provinceId
         */
        provinceId: any;

        /**
         * cityId
         */
        cityId: any;
        involvedProvince: any;
    };

    /**
     * lightFlag
     */
    lightFlag: any;

    /**
     * onClick
     */
    onClick: Noop;

    /**
     * onChange
     */
    onChange: Noop;
    showLineModal: any;
    zoneLevelFlags?: any;
    currentZoneId?: any;
    benchType?: any;
    mgmtZones?: any;
    showRelatedLine?: any;
    showRelatedLineModal?: any;
    faultEquipmentInfo: any;
    selectedCard: any;
    tempProvinceList?: any;
    provinceOnlineCount?: any;
    needOpenSpecialty: any[];
    timeType: any;
}>;
