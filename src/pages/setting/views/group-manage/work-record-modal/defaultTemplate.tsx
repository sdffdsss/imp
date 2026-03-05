import React, { FC, useEffect, useState } from 'react';
import { Input, Select, Radio, Space, Card, Row, Col } from 'oss-ui';
import { useDrag } from 'react-dnd';
import styles from './style.module.less';
import { getWorkPlanTemplate } from '../api';

interface Props {}

const DragElement = (props) => {
    const { element, data } = props;

    const [, drag] = useDrag(() => ({
        type: 'box',
        item: {
            data,
            isCopy: true,
        },
    }));

    return (
        <div ref={drag} className={styles['drag-item']} style={data.type === 'input' && data.subtype === 'presets' ? { flex: 'auto' } : {}}>
            <div className={styles['drag-item-element']}>{element}</div>
        </div>
    );
};

const DefaultTemplate: FC<Props> = () => {
    const [templateList, setTemplateList] = useState<any[]>([]);

    const getDefaultList = async () => {
        const res = await getWorkPlanTemplate();

        if (+res.code === 200) {
            setTemplateList(res.data);
        }
    };

    useEffect(() => {
        getDefaultList();
    }, []);

    const classificationCompontent = (data) => {
        const { type, compProps } = data;

        const { options, ...otherProps } = compProps;

        switch (type) {
            case 'input':
                return <Input.TextArea {...compProps} />;
            case 'select':
                return <Select {...compProps} />;
            case 'radio':
                return (
                    <Radio.Group>
                        <Space direction="vertical">
                            {options.map((item) => {
                                return (
                                    <Radio value={item}>
                                        <Input {...otherProps} />
                                    </Radio>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                );
            default:
                return null;
        }
    };

    const list = templateList.map((item) => {
        const children = item?.children.map((item2) => {
            const [type, subtype1, subtype2] = item2.templateIdentifier.split('_');

            let compProps = {};
            const options = item2.templateContents?.map((itemIn) => ({ label: itemIn, value: itemIn })) || [];

            switch (type) {
                case 'input':
                    // eslint-disable-next-line no-case-declarations
                    let width: number | string = 0;

                    switch (subtype2) {
                        case undefined:
                        case '2':
                        case '':
                            width = 50;
                            break;
                        case '5':
                            width = (5 + 1) * 14;
                            break;
                        case '10':
                            width = 145;
                            break;
                        default:
                            break;
                    }

                    if (subtype1 === 'presets') {
                        width = '100%';
                    }

                    compProps = {
                        disabled: subtype1 === 'null',
                        style: {
                            width,
                        },
                        maxLength: 400,
                        rows: 1,
                    };

                    break;
                case 'select':
                    compProps = {
                        options,
                        defaultValue: options?.[0].value,
                    };
                    break;
                case 'radio':
                    compProps = {
                        options: ['', ''],
                        maxLength: 400,
                    };
                    break;
                default:
                    break;
            }

            const data = {
                type,
                subtype: [subtype1, subtype2].filter(Boolean).join('_'),
                compProps,
            };

            return {
                ...item2,
                data,
                element: classificationCompontent(data),
            };
        });
        return {
            ...item,
            children,
        };
    });

    const dom = list.map((item) => {
        const { title } = item;

        return (
            <Card title={title} key={title} bordered style={{ marginBottom: '8px' }}>
                {item.children.map((item2) => {
                    return (
                        <Row className={styles['default-template-item-children']}>
                            <Col span={8}>{item2.templateModuleName}：</Col>
                            <Col span={16} style={{ display: 'flex', justifyContent: 'start' }}>
                                <DragElement element={item2.element} data={item2.data} />
                            </Col>
                        </Row>
                    );
                })}
            </Card>
        );
    });
    return (
        <Card
            size="small"
            className={styles['default-template']}
            headStyle={{ textAlign: 'center', background: '#f7f7f7' }}
            bodyStyle={{ overflowY: 'auto', height: 'calc(100% - 30px)' }}
            title="可选组件"
        >
            {dom}
        </Card>
    );
};

export default DefaultTemplate;
