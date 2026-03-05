import { Spin } from 'antd';
import React, { CSSProperties } from 'react';

interface LoadingProps {
  loading: boolean;
}

export function Loading(props: LoadingProps) {
  const { loading } = props;

  const divStyle: CSSProperties = {
    top: 0,
    left: 0,
    zIndex: 99999,
    width: '100vw',
    display: 'flex',
    height: '100vh',
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
  }
  return loading ? (
    <div style={divStyle}>
      <Spin size="large" spinning={true}/>
    </div>
  ) : null
}