import React from 'react';
import './index.less';
import { ReactComponent } from '../../images/alarm-icon.svg';
import { Icon, Image } from 'oss-ui';
import explain from '../../images/explain.png';

export function InterruptExplain() {
  return (
    <div className="interrupt-explain">
      <span className="red-span">监测结果分为两部分:</span>
      <div className="red-span" style={{ paddingLeft: 10 }}>
        1、心跳周期监测：根据设置的监测周期，在监测时间的1个周期内，若周期内有告警则正常，否则异常；
        <br/>
        2、中断/恢复监测：原中断状态新上告警，即流水恢复则正常；原正常状态新周期不上新告警，即流水中断则异常。
      </div>
      <span>
        <span style={{ fontWeight: 'bold' }}>示例：</span>
        监测周期为3min，<span className="blue-span"><Icon antdIcon component={ReactComponent} /></span> 为告警。
      </span>
      <div style={{ marginTop: 10 }}>
        <Image src={explain} preview={false} />
      </div>
    </div>
  )
}