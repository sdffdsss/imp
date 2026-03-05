import React, { PureComponent } from 'react';
import Terminal from 'terminal-in-react';
import moment from 'moment';
import './index.less';
import { _ } from 'oss-web-toolkits';
import { Tabs } from 'oss-ui';

const { TabPane } = Tabs;

const sleep = (milliSeconds) => {
    const startTime = new Date().getTime();
    let variable = new Date().getTime();
    while (variable < startTime + milliSeconds) {
        variable = new Date().getTime();
    }
};
class App extends PureComponent {
    constructor(props) {
        super(props);
        this.instance = React.createRef();
        // window.console.log(this.instance && this.instance.current);
        this.state = {
            shellData: null,
            shellName: null,
            tabList: [],
            activeKey: null
        };
    }
    componentDidUpdate(prevProps) {
        // window.console.log(this.instance && this.instance.current && this.instance.current.getChildContext());
        if (this.props.tabList !== prevProps.tabList) {
            console.log(this.props.tabList);
            this.setState(
                {
                    tabList: this.props.tabList.map((item) => {
                        return {
                            ...item,
                            ref: React.createRef()
                        };
                    })
                }
                // () => {
                //     this.instance && this.instance.current.runCommandOnActive('clear');
                //     this.instance.current.runCommandOnActive('show');
                // }
            );
        }
        if (this.props.tabActive !== prevProps.tabActive) {
            this.setState({
                activeKey: this.props.tabActive
            });
        }
    }
    componentDidMount() {
        console.log(this.props.tabList);
        this.setState(
            {
                tabList:
                    this.props.tabList.map((item) => {
                        return {
                            ...item,
                            ref: React.createRef()
                        };
                    }) || [],
                activeKey: this.props.tabActive
            },
            () => {
                // this.state.tabList
                //     .find((item) => item.shellName === this.state.activeKey)
                //     .ref.current.runCommandOnActive('login');
                sleep(2000);
                // this.state.tabList
                //     .find((item) => item.shellName === this.state.activeKey)
                //     .ref.current.runCommandOnActive('show');
            }
        );
    }
    // 通过ref调用批命令方法
    shellRun = (value) => {
        const { tabList, activeKey } = this.state;
        // window.console.log(value);
        this.setState(
            {
                shellData: value
            },
            () => {
                tabList.find((item) => item.shellName === activeKey).ref.current.runCommandOnActive('shell');
            }
        );
    };
    tabChaged = (value) => {
        this.setState({
            activeKey: value
        });
    };
    onEdit = (value) => {
        const { tabList, activeKey } = this.state;
        if (value === activeKey) {
            this.setState({
                activeKey: tabList.filter((item) => item.shellName !== value)[0].shellName
            });
        }
        this.props.tabChange && this.props.tabChange(value);
        this.setState({
            tabList: tabList.filter((item) => item.shellName !== value)
        });
    };
    showMsg = () => 'Hello World';
    listCell = () => `+++     NMS SERVER        2020-10-27 15:04:24
O&M     #2304
+++    HS4570_42J_哈香坊水利工程局-H5H(华为)       2020-10-27 15:07:55
O&M    #806418293
%%/*14709826*/LST CELL:;%%
RETCODE = 0  执行成功

查询小区静态参数
----------------
本地小区标识  小区名称                     Csg 指示  上行循环前缀长度  下行循环前缀长度  NB-IoT小区指示  覆盖等级类型  频带  上行频点配置指示  上行频点  下行频点  上行带宽  下行带宽  小区标识  物理小区标识  附加频谱散射  小区激活状态  小区闭塞优先级  小区闭塞执行时长(分)  小区双工模式  上下行子帧配比  特殊子帧配比  SSP6下行导频时隙模式  小区主备模式  服务小区偏置(分贝)  服务小区频率偏置(分贝)  根序列索引  高速小区指示  前导格式  小区半径(米)  客户化带宽配置指示  客户化上行实际带宽(0.1兆赫兹)  客户化下行实际带宽(0.1兆赫兹)  UE最大允许发射功率配置指示  UE最大允许发射功率(毫瓦分贝)  多RRU共小区指示  多RRU共小区模式  CPRI_E接口压缩比率  CPRI压缩  SFN小区物理小区数量  小区级参考信号端口数  小区发送和接收模式  小区参考信号天线端口映射  用户标签  工作模式      运营商共享组索引  服务小区同频RAN共享指示  服务小区同频ANR指示  小区起始覆盖位置(米)  专有小区标识  下行闭塞RB个数  SFN主小区标签  多小区共享模式         辅框小区SFN自动恢复时间(小时)  压缩带宽控制干扰模式  上行闭塞RB个数偏置  超高速小区根序列索引

1            HS4570_42J_哈香坊水利工程局-H5H(华为)-1    否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      38950     20M       20M       1         494           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     494         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
2             HS4570_42J_哈香坊水利工程局-H5H(华为)-2    否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      38950     20M       20M       2         495           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     768         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
3             HS4570_42J_哈香坊水利工程局-H5H(华为)-3    否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      38950     20M       20M       3         496           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     705         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
4             HS4570_42J_哈香坊水利工程局-H5H(华为)-4    否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      38950     20M       20M       4         219           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     90          低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                普通压缩  NULL                 2个CRS端口            两发两收            NULL                      NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
5             HS4570_42J_哈香坊水利工程局-H5H(华为)-5    否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      38950     20M       20M       5         220           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     656         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                普通压缩  NULL                 2个CRS端口            两发两收            NULL                      NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
21            HS4570_42J_哈香坊水利工程局-H5H(华为)-101  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39148     20M       20M       21        494           1             去激活        解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     494         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
22            HS4570_42J_哈香坊水利工程局-H5H(华为)-102  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39148     20M       20M       22        495           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     768         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
23            HS4570_42J_哈香坊水利工程局-H5H(华为)-103  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39148     20M       20M       23        496           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     705         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                普通压缩  NULL                 2个CRS端口            两发两收            NULL                      NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
24            HS4570_42J_哈香坊水利工程局-H5H(华为)-104  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39148     20M       20M       24        219           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     90          低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                普通压缩  NULL                 2个CRS端口            两发两收            NULL                      NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
41            HS4570_42J_哈香坊水利工程局-H5H(华为)-201  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39292     10M       10M       41        494           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     494         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
43            HS4570_42J_哈香坊水利工程局-H5H(华为)-203  否        普通循环前缀      普通循环前缀      否              NULL          40    不配置            NULL      39292     10M       10M       43        496           1             激活          解闭塞          NULL                  TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     705         低速小区指示  0         1000          不配置              NULL                           NULL                           配置                        23                            是               小区合并         2:1压缩             普通压缩  NULL                 2个CRS端口            四发四收            不配置                    NULL      上下行均工作  255               是                       允许                 0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
(结果个数 = 11)


---    END
        
                            `;
    despCell = () => `+++    HS4570_42J_哈香坊水利工程局-H5H(华为)        2020-10-27 15:08:19
O&M    #806418309
%%/*14709934*/DSP CELL:;%%
RETCODE = 0  执行成功

查询小区动态参数
----------------
本地小区标识  小区名称                     小区的实例状态  最近一次小区状态变化的原因  最近一次引起小区建立的操作时间  最近一次引起小区建立的操作类型  最近一次引起小区删除的操作时间  最近一次引起小区删除的操作类型  小区节能减排状态  符号关断状态  高铁场景下干扰协同状态  主基带处理板信息  小区拓扑结构  最大发射功率(0.1毫瓦分贝)

1             HS4570_42J_哈香坊水利工程局-H5H(华为)-1    正常            小区建立成功                2020-08-29 13:38:52             小区健康检查                    2020-08-29 13:38:43             小区建立失败                    未启动            符号关断      未启动                  0-0-4             小区合并模式  370                      
2             HS4570_42J_哈香坊水利工程局-H5H(华为)-2    正常            小区建立成功                2020-08-29 13:38:58             小区健康检查                    2020-08-29 13:38:49             小区建立失败                    未启动            符号关断      未启动                  0-0-2             小区合并模式  430                      
3             HS4570_42J_哈香坊水利工程局-H5H(华为)-3    正常            小区建立成功                2020-08-29 13:39:01             小区健康检查                    2020-08-29 13:38:49             小区建立失败                    未启动            符号关断      未启动                  0-0-4             小区合并模式  400                      
4             HS4570_42J_哈香坊水利工程局-H5H(华为)-4    正常            小区建立成功                2020-08-29 13:38:52             小区健康检查                    2020-08-29 13:38:40             小区建立失败                    未启动            符号关断      未启动                  0-0-4             基本模式      340                      
5             HS4570_42J_哈香坊水利工程局-H5H(华为)-5    正常            小区建立成功                2020-08-29 13:38:52             小区健康检查                    2020-08-29 13:38:43             小区建立失败                    未启动            符号关断      未启动                  0-0-2             基本模式      400                      
21            HS4570_42J_哈香坊水利工程局-H5H(华为)-101  未建立          无信息                      0000-00-00 00:00:00             无操作                          0000-00-00 00:00:00             无操作                          未启动            未启动        未启动                  NULL              无效模式      430                      
22            HS4570_42J_哈香坊水利工程局-H5H(华为)-102  正常            小区建立成功                2020-08-29 13:38:55             小区健康检查                    2020-08-29 13:38:43             小区建立失败                    未启动            符号关断      未启动                  0-0-2             小区合并模式  400                      
23            HS4570_42J_哈香坊水利工程局-H5H(华为)-103  正常            小区建立成功                2020-08-29 13:38:55             小区健康检查                    2020-08-29 13:38:46             小区建立失败                    未启动            符号关断      未启动                  0-0-4             基本模式      400                      
24            HS4570_42J_哈香坊水利工程局-H5H(华为)-104  正常            小区建立成功                2020-08-29 13:38:55             小区健康检查                    2020-08-29 13:38:46             小区建立失败                    未启动            符号关断      未启动                  0-0-4             基本模式      340                      
41            HS4570_42J_哈香坊水利工程局-H5H(华为)-201  正常            小区建立成功                2020-08-29 13:38:58             小区健康检查                    2020-08-29 13:38:49             小区建立失败                    未启动            符号关断      未启动                  0-0-1             小区合并模式  370                      
43            HS4570_42J_哈香坊水利工程局-H5H(华为)-203  正常            小区建立成功                2020-08-29 13:38:58             小区健康检查                    2020-08-29 13:38:46             小区建立失败                    未启动            符号关断      未启动                  0-0-1             小区合并模式  370                      
(结果个数 = 11)


---    END
    
    `;
    despGps = () => `+++    HS4570_42J_哈香坊水利工程局-H5H(华为)        2020-10-27 15:14:49
O&M    #56510
%%/*14710882*/DSP GPS:;%%
RETCODE = 0  执行成功

查询GPS状态
-----------
            GPS时钟编号  =  0
                星卡状态  =  正常
                星卡类型  =  UBLOX5
            GPS工作模式  =  全球定位系统
            位置保持状态  =  保持
    跟踪的GPS卫星数目  =  10
跟踪的GLONASS卫星数目  =  0
    跟踪的北斗卫星数目  =  0
跟踪的GALILEO卫星数目  =  0
        天线经度(1e-6度)  =  114315833
        天线纬度(1e-6度)  =  22709444
            天线高度(米)  =  64
            天线掩角(度)  =  5
            链路激活状态  =  激活
        馈线时延(纳秒)  =  76
            GPS版本号  =  6.02 (36023)-00040005
            位置核查开关  =  打开
        位置偏移值(米)  =  0
(结果个数 = 1)


---    END
    
    `;
    despClksrc = () => `+++    HS4570_42J_哈香坊水利工程局-H5H(华为)        2020-10-27 15:10:38
O&M    #56485
%%/*14710344*/DSP CLKSRC:;%%
RETCODE = 0  执行成功

查询参考时钟源状态
------------------
参考时钟源编号  参考时钟源类型  参考时钟源优先级  参考时钟源状态  参考时钟源激活状态  许可授权

0               GPS Clock       3                 可用            激活                未受限  
0               IP Clock        4                 可用            未激活              允许    
0               Peer Clock      4                 不可用          未激活              未受限  
(结果个数 = 3)


---    END
    
    `;
    lstCellHt = () => `+++    HS6952_627_哈平房泰富电气-H5H(华为)        2020-10-29 12:10:54
O&M    #806407306
%%/*197540739*/LST CELL:;%%
RETCODE = 0  执行成功

查询小区静态参数
----------------
本地小区标识  小区名称                Csg 指示  上行循环前缀长度  下行循环前缀长度  NB-IoT小区指示  覆盖等级类型  频带  上行频点配置指示  上行频点  下行频点  上行带宽  下行带宽  小区标识  物理小区标识  附加频谱散射  小区激活状态  小区闭塞优先级  小区中优先级闭塞时长(分)  小区双工模式  上下行子帧配比  特殊子帧配比  SSP6下行导频时隙模式  小区主备模式  服务小区偏置(分贝)  服务小区频率偏置(分贝)  根序列索引  高速小区指示  前导格式  小区半径(米)  客户化带宽配置指示  客户化上行实际带宽(0.1兆赫兹)  客户化下行实际带宽(0.1兆赫兹)  UE最大允许发射功率配置指示  UE最大允许发射功率(毫瓦分贝)  多RRU共小区指示  多RRU共小区模式  CPRI_E接口压缩比率  CPRI压缩  SFN小区物理小区数量  小区级参考信号端口数  小区发送和接收模式  小区参考信号天线端口映射  用户标签  工作模式      运营商共享组索引  服务小区同频RAN共享指示  服务小区同频ANR指示  ANR 频率优先级  小区起始覆盖位置(米)  专有小区标识  下行闭塞RB个数  SFN主小区标签  多小区共享模式         辅框小区SFN自动恢复时间(小时)  压缩带宽控制干扰模式  上行闭塞RB个数偏置  超高速小区根序列索引

65            HS6952_627_哈平房泰富电气-H5H(华为)-1  否        普通循环前缀      普通循环前缀      否              NULL          41    不配置            NULL      40936     20M       20M       65        478           1             激活          解闭塞          NULL                      TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     830         低速小区指示  0         5000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                不压缩    NULL                 2个CRS端口            六十四发六十四收    NULL                      NULL      上下行均工作  255               是                       允许                 0               0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
66            HS6952_627_哈平房泰富电气-H5H(华为)-2  否        普通循环前缀      普通循环前缀      否              NULL          41    不配置            NULL      40936     20M       20M       66        479           1             激活          解闭塞          NULL                      TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     183         低速小区指示  0         5000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                不压缩    NULL                 2个CRS端口            六十四发六十四收    NULL                      NULL      上下行均工作  255               是                       允许                 0               0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
67            HS6952_627_哈平房泰富电气-H5H(华为)-3  否        普通循环前缀      普通循环前缀      否              NULL          41    不配置            NULL      40936     20M       20M       67        477           1             激活          解闭塞          NULL                      TDD           SA2             SSP7          NULL                  主模式        0dB                 0dB                     586         低速小区指示  0         5000          不配置              NULL                           NULL                           配置                        23                            否               NULL             NULL                不压缩    NULL                 2个CRS端口            六十四发六十四收    NULL                      NULL      上下行均工作  255               是                       允许                 0               0                     普通小区      NULL            NULL           非劈裂多小区共RRU模式  NULL                           NULL                  NULL                NULL                
(结果个数 = 3)


---    END`;
    dspCellHt = () => `+++    HS6952_627_哈平房泰富电气-H5H(华为)        2020-10-29 12:11:01
O&M    #806407307
%%/*197540905*/DSP CELL:;%%
RETCODE = 0  执行成功

查询小区动态参数
----------------
本地小区标识  小区名称                小区的实例状态  最近一次小区状态变化的原因  最近一次引起小区建立的操作时间  最近一次引起小区建立的操作类型  最近一次引起小区删除的操作时间  最近一次引起小区删除的操作类型  小区节能减排状态  符号关断状态  高铁场景下干扰协同状态  主基带处理板信息  小区拓扑结构  最大发射功率(0.1毫瓦分贝)

65            HS6952_627_哈平房泰富电气-H5H(华为)-1  未建立          无可用的RRU载波资源         2020-10-29 12:11:00             小区健康检查                    2020-10-29 12:11:00             小区建立失败                    未启动            未启动        未启动                  NULL              无效模式      227                      
66            HS6952_627_哈平房泰富电气-H5H(华为)-2  未建立          无可用的RRU载波资源         2020-10-29 12:11:00             小区健康检查                    2020-10-29 12:11:00             小区建立失败                    未启动            未启动        未启动                  NULL              无效模式      227                      
67            HS6952_627_哈平房泰富电气-H5H(华为)-3  未建立          无可用的RRU载波资源         2020-10-29 12:11:00             小区健康检查                    2020-10-29 12:11:00             小区建立失败                    未启动            未启动        未启动                  NULL              无效模式      237                      
(结果个数 = 3)


---    END`;
    listImsigt = () => `RETCODE = 0  操作成功

IMSI-GT转换表
-------------
 IMSI前缀  国家代码_网络接入号  移动网络名称 

 45404     852949               hk_hutch     
 45406     852901               hk_smartone  
 46693     8869355              tw_taimobile 
 46697     886935               tw_taimobile 
 46699     8869356              tw_tat       
 45410     852921               hk_newworld  
 23001     420603               cz_radiomobil
 52505     659854               sg_starhub   
 45412     852920               hk_peoples   
 62401     23767                cm_mtn       
 44020     8190665              jp_vodafone  
 21670     3670                 hu_vodafone  
 22201     39339                it_tim       
 23415     44385                uk_vodafone  
 41302     9477                 lk_dialog    
 45400     852902               hk_csl       
 46692     886932               tw_cht       
 52503     659                  sg_m1        
 45501     85368989             mo_ctm       
 51502     63917                ph_globe     
 20205     30694                gr_vodafone  
 25099     79037                ru_kb        
 46601     886936               tw_fareastone
 42004     96659                sa_zain      
 26201     49171                de_tmobile   
 53001     6421                 nz_vodafone  
 21401     34607                es_vodafone  
 21406     34607                es_vodafone  
 22210     39349                it_vodafone  
 60202     2010                 eg_vodafone  
 23205     43699                at_connect   
 23212     43681                at_connect   
 20810     33609                fr_vodafone  
 50212     6012                 my_maxis     
 24008     46708                se_vodafone  
 60301     21366                dz_atm       
 52003     66923                th_ais       
 51010     62811                id_telkomsel 
 50503     61415                au_vodafone  
 27201     35387                ie_vodafone  
 26202     49172                de_vodafone  
 24202     47920                no_netcom    
 27401     35489                is_telecom   
 22801     4179                 ch_swisscom  
 26801     35191                pt_vodafone  
 23801     45401                dk_tdc       
 23102     421903               sk_Telekom   
 45416     852923               hk_sunday    
 23410     447802               uk_o2        
 24602     370699               lt_bite      
 41902     96596                kw_vodafone  
 20404     31654                nl_vodafone  
 29341     38641                si_mobitel   
 27801     35694                mt_vodafone  
 24001     46705                se_telia     
 310160    191790               us_tmobile   
 310200    150351               us_tmobile   
 43235     98935                ir_irancell  
 42506     97256                pp_wataniya  
 51401     67073                ti_Telkomcel 
 310240    150545               us_tmobile   
 310250    180825               us_tmobile   
 310260    130333               us_tmobile   
 310270    133433               us_tmobile   
 310310    181326               us_tmobile   
 52501     659                  sg_singtel   
 52502     659                  sg_singtel   
 28601     90532                tr_turkcell  
 26002     48602                pl_era       
 42501     97254                il_partner   
 24491     35840                fi_sonera    
 20601     32475                be_belgacom  
 22601     40722                ro_mobifon   
 45403     852633               hk_hutch3g   
 24701     371292               lv_telephon  
 45500     85362000             mo_smartone  
 23203     43676                at_tmobile   
 71203     5067000              cr_claro     
 25503     38067                ua_kyivstar  
 20210     30693                gr_tim       
(结果个数 = 80)

仍有后续报告输出
---    END`;
    disIntDes = () => `PHY: Physical
*down: administratively down
^down: standby
(l): loopback
(s): spoofing
(E): E-Trunk down
(b): BFD down
(B): Bit-error-detection down
(e): ETHOAM down
(d): Dampening Suppressed
(p): port alarm down
(ld): loop-detect trigger down
Interface                     PHY     Protocol Description                     
Eth-Trunk0                    up      up       (^0^)To-[HEB-DC4-SCL-F2]Eth-Trunk0
Eth-Trunk3                    up      up       TO-[HEB-SPN-7-1]                
GE0/0/0                       *down   down                                     
GE1/0/0                       up      up       (^3^)To-[HEBSBC02BZX]--slot3-RXTX2
GE1/0/1                       up      up       (^3^)To-[HEBSBC02BZX]-slot5-RXTX2
GE1/0/2                       down    down     (^3^)To-[HEB-BSC10]             
GE1/0/3                       up      up       (^3^)To-[HEB-Femto-01]          
GE1/0/4                       up      up       (^3^)To-[HEB-BSC11-HW]          
GE1/0/5                       up      up       (^3^)To-[HEB-BSC12-HW]          
GE1/0/6                       up      up       (^3^)To-[HEB-BSC13-HW]          
GE1/0/7                       *down   down                                     
GE1/0/8                       *down   down                                     
GE1/0/9                       *down   down                                     
GE1/0/10                      *down   down                                     
GE1/0/11                      *down   down                                     
GE1/0/12                      *down   down                                     
GE1/0/13                      *down   down                                     
GE1/0/14                      *down   down                                     
GE1/0/15                      *down   down                                     
GE1/0/16                      *down   down                                     
GE1/0/17                      *down   down                                     
GE1/0/18                      *down   down                                     
GE1/0/19                      *down   down                                     
GE1/0/20                      *down   down                                     
GE1/0/21                      *down   down                                     
GE1/0/22                      *down   down                                     
GE1/0/23                      *down   down                                     
GE1/1/0                       *down   down                                     
GE1/1/1                       *down   down                                     
GE1/1/2                       *down   down                                     
GE1/1/3                       *down   down                                     
GE1/1/4                       *down   down                                     
GE1/1/5                       *down   down                                     
GE1/1/6                       *down   down                                     
GE1/1/7                       *down   down                                     
GE1/1/8                       *down   down                                     
GE1/1/9                       *down   down                                     
GE1/1/10                      *down   down                                     
GE1/1/11                      *down   down                                     
GE1/1/12                      *down   down                                     
GE1/1/13                      *down   down                                     
GE1/1/14                      *down   down                                     
GE1/1/15                      *down   down                                     
GE1/1/16                      *down   down                                     
GE1/1/17                      *down   down                                     
GE1/1/18                      *down   down                                     
GE1/1/19                      up      up       (^0^)To-[HEB-DC4-SCL-F2]Eth-Trunk0
GE1/1/20                      *down   down                                     
GE1/1/21                      *down   down                                     
GE1/1/22                      *down   down                                     
GE1/1/23                      *down   down                                     
GE3/0/0(10G)                  up      down     TO-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10-10G
GE3/0/0.572(10G)              up      up       TO-NC_S1_HA-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.572-10G
GE3/0/0.980(10G)              up      up       TO-IUPS_MEDIA-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.980-10G
GE3/0/0.981(10G)              up      up       TO-HN_IUPS_SG-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.981-10G
GE3/0/0.982(10G)              up      up       TO-HN_GB-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.982-10G
GE3/0/0.990(10G)              up      up       To-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.990-10G
GE3/0/0.991(10G)              up      up       TO-[HAHEB-BA-IPNET-RT01-NE40E-X16A]-GE4/1/10.991-10G
GE3/0/1(10G)                  up      up       TO-[HEB-SPN-7-1]                
GE3/0/2(10G)                  *down   down                                     
GE3/0/3(10G)                  *down   down                                     
GE3/0/4(10G)                  *down   down                                     
GE3/0/5(10G)                  *down   down                                     
GE3/0/6(10G)                  *down   down                                     
GE3/0/7(10G)                  *down   down                                     
GE3/0/8(10G)                  *down   down                                     
GE3/0/9(10G)                  *down   down                                     
GE3/0/10(10G)                 *down   down                                     
GE3/0/11(10G)                 *down   down                                     
GE3/1/0                       *down   down                                     
GE3/1/1                       *down   down                                     
GE3/1/2                       *down   down                                     
GE3/1/3                       *down   down                                     
GE3/1/4                       *down   down                                     
GE3/1/5                       *down   down                                     
GE3/1/6                       *down   down                                     
GE3/1/7                       *down   down                                     
GE3/1/8                       *down   down                                     
GE3/1/9                       *down   down                                     
GE3/1/10                      *down   down                                     
GE3/1/11                      *down   down                                     
GE3/1/12                      *down   down                                     
GE3/1/13                      *down   down                                     
GE3/1/14                      *down   down                                     
GE3/1/15                      *down   down                                     
GE3/1/16                      *down   down                                     
GE3/1/17                      *down   down                                     
GE3/1/18                      *down   down                                     
GE3/1/19                      up      up       (^0^)To-[HEB-DC4-SCL-F2]Eth-Trunk0
GE3/1/20                      *down   down                                     
GE3/1/21                      *down   down                                     
GE3/1/22                      *down   down                                     
GE3/1/23                      *down   down                                     
GE4/0/0(10G)                  up      down     TO-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0-10G
GE4/0/0.10(10G)               up      up       To-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.10
GE4/0/0.15(10G)               up      up       TO-NC_S1_HA-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.15
GE4/0/0.20(10G)               up      up       To-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.20
GE4/0/0.40(10G)               up      up       TO-IUPS_MEDIA-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.40
GE4/0/0.50(10G)               up      up       TO-HN_IUPS_SG-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.50
GE4/0/0.60(10G)               up      up       TO-HN_GB-[HAHEB-PS-IMS-CE04-HWNE40E-X16A]-GE4/0/0.60
GE4/0/1(10G)                  *down   down     TO-[HAHEB-SPN-TEST]-XGE31/9     
GE4/0/2(10G)                  *down   down                                     
GE4/0/3(10G)                  *down   down                                     
GE4/0/4(10G)                  *down   down                                     
GE4/0/5(10G)                  *down   down                                     
GE4/0/6(10G)                  *down   down                                     
GE4/0/7(10G)                  *down   down                                     
GE4/0/8(10G)                  *down   down                                     
GE4/0/9(10G)                  *down   down                                     
GE4/0/10(10G)                 *down   down                                     
GE4/0/11(10G)                 *down   down                                     
GE8/0/0                       down    down     (^3^)TO-[HEB-BSC7-HW]           
GE8/0/1                       *down   down                                     
GE8/0/2                       *down   down                                     
GE8/0/3                       *down   down                                     
GE8/0/4                       *down   down                                     
GE8/0/5                       *down   down                                     
GE8/0/6                       *down   down                                     
GE8/0/7                       *down   down                                     
GE8/0/8                       *down   down                                     
GE8/0/9                       *down   down                                     
GE8/0/10                      *down   down                                     
GE8/0/11                      *down   down                                     
GE8/0/12                      *down   down                                     
GE8/0/13                      *down   down                                     
GE8/0/14                      *down   down                                     
GE8/0/15                      *down   down                                     
GE8/0/16                      *down   down                                     
GE8/0/17                      *down   down                                     
GE8/0/18                      *down   down                                     
GE8/0/19                      *down   down                                     
GE8/0/20                      *down   down                                     
GE8/0/21                      *down   down                                     
GE8/0/22                      *down   down                                     
GE8/0/23                      up      up       (^0^)TO-[HEB-EC3-SCL-02F]-Gi9/1 
GE8/1/0                       *down   down                                     
GE8/1/1                       *down   down                                     
GE8/1/2                       *down   down                                     
GE8/1/3                       *down   down                                     
GE8/1/4                       *down   down                                     
GE8/1/5                       *down   down                                     
GE8/1/6                       *down   down                                     
GE8/1/7                       *down   down                                     
GE8/1/8                       *down   down                                     
GE8/1/9                       *down   down                                     
GE8/1/10                      *down   down                                     
GE8/1/11                      *down   down                                     
GE8/1/12                      *down   down                                     
GE8/1/13                      *down   down                                     
GE8/1/14                      *down   down                                     
GE8/1/15                      *down   down                                     
GE8/1/16                      *down   down                                     
GE8/1/17                      *down   down                                     
GE8/1/18                      *down   down                                     
GE8/1/19                      *down   down                                     
GE8/1/20                      *down   down                                     
GE8/1/21                      *down   down                                     
GE8/1/22                      *down   down                                     
GE8/1/23                      *down   down                                     
NULL0                         up      up(s)                                    
VT0                           up      up(s)                                    
Vlanif1000                    up      up       (^3^)TO-[HEB-BSC7-HW]           
Vlanif1001                    up      up       (^3^)To-[HEB-BSC10]             
Vlanif1002                    up      up       (^3^)To-[HEB-Femto-01-JX]       
Vlanif1003                    up      up       (^3^)To-[HEB-BSC11-HW]          
Vlanif1004                    up      up       (^3^)To-[HEB-BSC12-HW]          
Vlanif1005                    up      up       (^3^)To-[HEB-BSC13-HW]   `;
    disCuIntVlanif1001 = () => `#
interface Vlanif1001
 description (^3^)To-[HEB-BSC10]
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip address 10.91.200.10 255.255.255.248
 vrrp vrid 101 virtual-ip 10.91.200.9
 vrrp vrid 101 priority 120
 vrrp vrid 101 preempt-mode timer delay 120
#
return`;
    disCuInt2 =
        () => `Info: It will take a long time if the content you search is too much or the string you input is too long, you can press CTRL_C to break.
interface Vlanif1001
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.225 255.255.255.255 Vlanif1001 10.91.200.12 description BSC10
<HAHEB-PS-IMS-CE03-HWNE40E-X16A>dis cu | inc ChinaMobile_HN_Gb
Info: It will take a long time if the content you search is too much or the string you input is too long, you can press CTRL_C to break.
ip vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
 ip binding vpn-instance ChinaMobile_HN_Gb
bfd to_hwbsc11 bind peer-ip 10.91.200.28 vpn-instance ChinaMobile_HN_Gb interface Vlanif1003 source-ip 10.91.200.26 auto
bfd to_hwbsc12 bind peer-ip 10.91.200.36 vpn-instance ChinaMobile_HN_Gb interface Vlanif1004 source-ip 10.91.200.34 auto
bfd to_hwbsc13 bind peer-ip 10.91.200.44 vpn-instance ChinaMobile_HN_Gb interface Vlanif1005 source-ip 10.91.200.42 auto
ospf 17 router-id 10.4.230.202 vpn-instance ChinaMobile_HN_Gb
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.0 255.255.252.0 NULL0
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.224 255.255.255.255 Vlanif1000 10.91.200.4 description BSC7
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.225 255.255.255.255 Vlanif1001 10.91.200.12 description BSC10
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.226 255.255.255.255 Vlanif1002 10.91.200.20 description HEB-Femto-01
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.227 255.255.255.255 Vlanif1003 10.91.200.28 track bfd-session to_hwbsc11
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.228 255.255.255.255 Vlanif1004 10.91.200.36 track bfd-session to_hwbsc12
ip route-static vpn-instance ChinaMobile_HN_Gb 10.91.200.229 255.255.255.255 Vlanif1005 10.91.200.44 track bfd-session to_hwbsc13
 vpn-instance ChinaMobile_HN_Gb
 vpn-instance ChinaMobile_HN_Gb
 vpn-instance ChinaMobile_HN_Gb
 vpn-instance ChinaMobile_HN_Gb`;
    render() {
        const { activeKey, tabList } = this.state;
        const list = ['HBMME31BHW', 'HBMME32BHW', 'HBMME33BHW', 'HBMME34BHW'];
        return (
            <div className="terminal-in-content">
                <Tabs
                    type="editable-card"
                    hideAdd
                    activeKey={activeKey}
                    onChange={this.tabChaged}
                    style={{ height: '100%', width: '100%' }}
                    onEdit={this.onEdit}
                    size="small"
                >
                    {!_.isEmpty(tabList) &&
                        tabList.map((item) => {
                            return (
                                <TabPane tab={item.shellName} key={item.shellName} closable={tabList.length >= 2}>
                                    <div
                                        style={{
                                            // display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                            width: '100%'
                                        }}
                                    >
                                        <Terminal
                                            ref={item.ref}
                                            color="#66FFFF"
                                            backgroundColor="#013870"
                                            barColor="black"
                                            promptSymbol={`${item.shellName} >`}
                                            startState={'maximised'}
                                            // actionHandlers={{
                                            //     handleClose: (toggleClose) => {
                                            //         // do something on close
                                            //         toggleClose();
                                            //     },
                                            //     handleMaximise: (toggleMaximise) => {
                                            //         // do something on maximise
                                            //         toggleMaximise();
                                            //     },
                                            // }}
                                            prompt="rgb(100,174,192)"
                                            // promptPrefix="123"
                                            style={{ fontWeight: 'bold', fontSize: '1em' }}
                                            allowTabs={false}
                                            hideTopBar={true}
                                            commands={{
                                                'LST CELL:;': () => {},
                                                'DSP CELL:;': () => {},
                                                'DSP GPS:;': () => {},
                                                'DSP CLKSRC:;': () => {},
                                                'LST IMSIGT:;': () => {},
                                                'dis int des': () => {},
                                                'dis cu int Vlanif1001': () => {},
                                                'dis cu | inc Vlanif1001': () => {},
                                                // `${item.shellName}`:()=>{},
                                                // 'edit-line': () => `${item.shellName}`,
                                                dis: {
                                                    method: (args, print) => {
                                                        let str = '';
                                                        if (args._.length > 1)
                                                            args._.forEach((item) => {
                                                                str += item;
                                                            });
                                                        switch (str) {
                                                            case 'intdes':
                                                                sleep(2000);
                                                                print(`${this.disIntDes()}`);
                                                                this.props.onChanged && this.props.onChanged(this.disIntDes());
                                                                break;
                                                            case 'cuintVlanif1001':
                                                                sleep(2000);
                                                                print(`${this.disCuIntVlanif1001()}`);
                                                                this.props.onChanged && this.props.onChanged(this.disCuIntVlanif1001());
                                                                break;
                                                            case 'cu|incVlanif1001':
                                                                sleep(2000);
                                                                print(`${this.disCuInt2()}`);
                                                                this.props.onChanged && this.props.onChanged(this.disCuInt2());
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                },
                                                LST: {
                                                    method: (args, print, runCommand) => {
                                                        switch (args._[0]) {
                                                            case 'CELL:;':
                                                                if (item.shellName === 'HS4570_42J_哈香坊水利工程局-H5H(华为)') {
                                                                    sleep(2000);
                                                                    print(`${this.listCell()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.listCell());
                                                                } else {
                                                                    sleep(2000);
                                                                    print(`${this.lstCellHt()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.lstCellHt());
                                                                }
                                                                break;
                                                            case 'IMSIGT:;':
                                                                sleep(2000);
                                                                print(`${this.listImsigt()}`);
                                                                this.props.onChanged && this.props.onChanged(this.listImsigt());
                                                                break;
                                                            default:
                                                                print(`-:${args._[0] || 'LST'}: 该指令为非法/危险指令`);
                                                        }
                                                    }
                                                    // options: [
                                                    //     {
                                                    //         name: 'CELL:;',
                                                    //         descriptions: '脚本命令',
                                                    //         defaultValue: 'CELL:;',
                                                    //     },
                                                    // ],
                                                },
                                                DSP: {
                                                    method: (args, print) => {
                                                        switch (args._[0]) {
                                                            case 'CELL:;':
                                                                if (item.shellName === 'HS4570_42J_哈香坊水利工程局-H5H(华为)') {
                                                                    sleep(2000);
                                                                    print(`${this.despCell()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.despCell());
                                                                } else {
                                                                    sleep(2000);
                                                                    print(`${this.dspCellHt()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.dspCellHt());
                                                                }

                                                                break;
                                                            case 'GPS:;':
                                                                if (item.shellName === 'HS4570_42J_哈香坊水利工程局-H5H(华为)') {
                                                                    sleep(2000);
                                                                    print(`${this.despGps()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.despGps());
                                                                } else {
                                                                    print(`-:${args._[0] || 'DSP'}: 该指令为非法/危险指令`);
                                                                }

                                                                break;
                                                            case 'CLKSRC:;':
                                                                if (item.shellName === 'HS4570_42J_哈香坊水利工程局-H5H(华为)') {
                                                                    sleep(2000);
                                                                    print(`${this.despClksrc()}`);
                                                                    this.props.onChanged && this.props.onChanged(this.despClksrc());
                                                                } else {
                                                                    print(`-:${args._[0] || 'DESP'}: 该指令为非法/危险指令`);
                                                                }
                                                                break;
                                                            // case cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'CLKSRC:;':
                                                            //     print(`${this.despClksrc}`);
                                                            //     break;
                                                            default:
                                                                print(`-:${args._[0] || 'DESP'}: 该指令为非法/危险指令`);
                                                        }
                                                    }
                                                },
                                                shell: {
                                                    method: (args, print) => {
                                                        if (this.state.shellData && this.state.shellData.length > 0) {
                                                            const dataList = this.state.shellData.split(':;');
                                                            let str = ``;
                                                            dataList.forEach((item) => {
                                                                switch (item) {
                                                                    case 'LST CELL':
                                                                        str += this.listCell();
                                                                        break;
                                                                    case 'DSP CELL':
                                                                        str += this.despCell();
                                                                        break;
                                                                    case 'DSP GPS':
                                                                        str += this.despGps();
                                                                        break;
                                                                    case 'DSP CLKSRC':
                                                                        str += this.despClksrc();
                                                                        break;
                                                                    case 'LST IMSIGT:;':
                                                                        str += this.listImsigt();
                                                                        break;
                                                                    case 'dis int des':
                                                                        str += this.disIntDes();
                                                                        break;
                                                                    case 'dis cu int Vlanif1001':
                                                                        str += this.disCuIntVlanif1001();
                                                                        break;
                                                                    case 'dis cu | inc Vlanif1001':
                                                                        str += this.disCuInt2();
                                                                        break;
                                                                    default:
                                                                        break;
                                                                }
                                                            });
                                                            this.setState({
                                                                shellData: null
                                                            });
                                                            if (str.length > 0) {
                                                                sleep(2000);
                                                                print(str);
                                                                this.props.onChanged && this.props.onChanged(str);
                                                            } else {
                                                                print(`-:${args._[0] || 'run'}: 该指令为非法/危险指令`);
                                                            }
                                                        }
                                                    }
                                                }
                                                // login: {
                                                //     // method: (args, print, runCommand) => {
                                                //     //     sleep(2000);
                                                //     //     // runCommand('show');
                                                //     // },
                                                // },
                                            }}
                                            commandPassThrough={(cmd, print) => {
                                                print(`-:${cmd}: 该指令为非法/危险指令`);
                                            }}
                                            // commandPassThrough={(cmd, print) => {
                                            //     window.console.log(123);
                                            // }}
                                            // actionHandlers={() => {
                                            //     window.console.log(123);
                                            // }}
                                            //     // do something async
                                            //     switch (cmd) {
                                            //         case cmd.length > 1 && cmd[0] === 'LIST' && cmd[1] === 'CELL:;':
                                            //             print(`${this.listCell}`);
                                            //             break;
                                            //         case cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'CELL:;':
                                            //             print(`${this.despCell}`);
                                            //             break;
                                            //         case cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'GPS:;':
                                            //             print(`${this.despGps}`);
                                            //             break;
                                            //         case cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'CLKSRC:;':
                                            //             print(`${this.despClksrc}`);
                                            //             break;
                                            //         // case cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'CLKSRC:;':
                                            //         //     print(`${this.despClksrc}`);
                                            //         //     break;
                                            //         default:
                                            //             print(`-:${cmd}: 该指令为非法/危险指令`);
                                            //     }
                                            //     window.console.log(cmd);
                                            //     // if (cmd.length > 1 && cmd[0] === 'LIST' && cmd[1] === 'CELL') {
                                            //     //     print(`${this.listCell}`);
                                            //     // } else if (cmd.length > 1 && cmd[0] === 'DESP' && cmd[1] === 'CELL') {
                                            //     //     print(`${this.despCell}`);
                                            //     // }else if else {
                                            //     //     print(`-:${cmd}: 该指令为非法/危险指令`);
                                            //     // }
                                            // }}
                                            descriptions={{
                                                'LST CELL:;': '',
                                                'DSP CELL:;': '',
                                                'DSP GPS:;': '',
                                                'DSP CLKSRC:;': ''
                                            }}
                                            msg={
                                                list.includes(item.shellName) &&
                                                `

+++    CGP/*MEID:0 MENAME:站点管理*/         ${moment().format('YYYY-MM-DD hh:mm:ss')}
O&M    #492706
%%
USE ME:MEID=6;
RETCODE = 0  切换网元成功

---    END

+++    USN/*MEID:6 MENAME:${item.shellName}*/        ${moment().format('YYYY-MM-DD hh:mm:ss')}
O&M    #492707
`
                                            }
                                        />
                                    </div>
                                </TabPane>
                            );
                        })}
                </Tabs>
            </div>
        );
    }
}

export default App;
