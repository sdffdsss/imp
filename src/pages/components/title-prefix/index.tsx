import React from 'react';
import { IProps, PrefixType } from './types';
import './index.less';

export default function Title(props: IProps) {
    const { prefixType = PrefixType.rect, ...resProps } = props;

    return <em className={`common-title-prefix-${prefixType}`} {...resProps} />;
}
