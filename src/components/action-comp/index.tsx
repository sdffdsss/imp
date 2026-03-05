import { stopPop } from '@Src/common/utils/stopPop';
import { Icon, Popconfirm, Tooltip, Button } from 'oss-ui';
import React, { CSSProperties, useState } from 'react';
import AuthButton from '../auth-button';
import './index.less';

export enum ActionCompType {
  view = 'view',
  delete = 'delete',
  edit = 'edit',
  stop = 'stop',
  start = 'start',
  update = 'update',
  release = 'release',
  quote = 'quote',
  share = 'share',
  cancelShare = 'cancelShare',
  add = 'add',
  cancel = 'cancel',
  detail = 'detail',
}

interface ActionCompProps {
  type: ActionCompType;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClick: (params: any) => void;
  disabled?: boolean;
  authKey?: string;
  style?: CSSProperties;
  noPop?: boolean;
  addLog?: boolean;
}

export function ActionComp(props: ActionCompProps) {
  const { title, type, onClick, children, disabled, authKey, style, noPop, addLog } = props;
  const [params, setParams] = useState<any>({});

  const isDelete = type === ActionCompType.delete;

  function getTitle() {
    if (children) {
      return children;
    }
    switch (type) {
      case ActionCompType.view:
        return '查看';
      case ActionCompType.delete:
        return '删除';
      case ActionCompType.edit:
        return '编辑';
      case ActionCompType.stop:
        return '停用';
      case ActionCompType.start:
        return '启用';
      case ActionCompType.update:
        return '升级';
      case ActionCompType.release:
        return '发布';
      case ActionCompType.quote:
        return '引用';
      case ActionCompType.share:
        return '共享';
      case ActionCompType.cancelShare:
        return '取消共享';
      case ActionCompType.add:
        return '添加';
      case ActionCompType.cancel:
        return '取消';
      case ActionCompType.detail:
        return '查看详情';
    }
  }

  function getIcon() {
    let iconType: string | undefined = undefined;
    let component = undefined;
    switch (type) {
      case ActionCompType.view:
        iconType = 'SearchOutlined';
        break;
      case ActionCompType.delete:
        iconType = 'DeleteOutlined';
        break;
      case ActionCompType.edit:
        iconType = 'EditOutlined';
        break;
      case ActionCompType.stop:
        iconType = 'StopOutlined';
        break;
      case ActionCompType.start:
        iconType = 'PlayCircleOutlined';
        break;
      case ActionCompType.update:
        iconType = 'UploadOutlined';
        break
      case ActionCompType.release:
        iconType = 'CloudUploadOutlined';
        break;
      case ActionCompType.quote:
        iconType = 'ShareAltOutlined';
        break;
      case ActionCompType.share:
        iconType = 'PaperClipOutlined';
        break;
      case ActionCompType.cancelShare:
        iconType = 'LinkOutlined';
        break;
      case ActionCompType.add:
        iconType = 'PlusCircleOutlined';
        break;
      case ActionCompType.cancel:
        iconType = 'MinusCircleOutlined';
        break;
      case ActionCompType.detail:
        iconType = 'FileSearchOutlined';
        break;
    }
    // @ts-ignore
    return <Icon antdIcon={!!iconType} type={iconType!} component={component} />
  }

  function onActionClick(params: any, e: any) {
    e && stopPop(e);
    onClick && onClick(params);
  }

  function deleteClick(params: any, e: any) {
    e && stopPop(e);
    setParams(params)
  }

  const node = (
    <Tooltip title={getTitle()}>
      {authKey ?
        <AuthButton
          type="text"
          style={style}
          addLog={addLog}
          authKey={authKey}
          disabled={disabled}
          className="action-comp"
          onClick={isDelete && !noPop ? deleteClick : onActionClick}
        >
          {getIcon()}
        </AuthButton> :
        <Button
          type="text"
          style={style}
          disabled={disabled}
          className="action-comp"
          onClick={isDelete && !noPop ? undefined : (e) => onActionClick({}, e)}
        >
          {getIcon()}
        </Button>}
    </Tooltip>
  )

  function renderDeleteTitle() {
    return (
      <div style={{ maxWidth: '160px' }}>{title || '是否确认删除？'}</div>
    )
  }

  return isDelete && !noPop ? (
    <Popconfirm disabled={disabled} title={renderDeleteTitle()} onConfirm={e => onActionClick(params, e)}>
      {node}
    </Popconfirm>
  ) : (
    node
  )
}