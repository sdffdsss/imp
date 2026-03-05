import React from 'react';

export type FunctionVariadic = (...args: any[]) => any;

export type PromiseFunctionWrapper<T> = (...args: any[]) => Promise<T>;

export function useLoading<T = any>(func: FunctionVariadic): [PromiseFunctionWrapper<T>, boolean] {
  const [flag, setFlag] = React.useState(false);

  // 返回tuple， 第一个为wrapped的function, 第二个为当前promise对应的loading flag
  return [async (...args: any[]) => {
    setFlag(true);
    try {
      // @ts-ignore
      const result = await (func.apply(this, args) as Promise<T>);
      return result;
    } finally {
      setFlag(false);
    }
  }, flag];
}