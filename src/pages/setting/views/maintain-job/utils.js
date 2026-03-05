import { nanoid } from '../group-manage/production-plan-modal/utils';

export function formatWorkRecordConfig(data) {
    return data?.map((item) => {
        return item?.map((itemIn) => {
            const { identifier, value, result } = itemIn;

            let compProps = {};
            let defaultValue = '';
            const [type, subtype1, subtype2] = identifier.split('_');

            if (type === 'input') {
                let width = 0;

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

                defaultValue = ['null', 'presets'].includes(subtype1) ? result || '' : value[0] || '';
                compProps = {
                    style: {
                        width: subtype1 === 'presets' ? '100%' : width,
                    },
                    maxLength: 400,
                    rows: subtype1 === 'presets' ? undefined : 1,
                    autoSize: subtype1 === 'presets',
                    defaultValue,
                };
            }

            if (type === 'select') {
                defaultValue = result || value?.[0];
                compProps = {
                    options: value.map((itemTemp) => ({ label: itemTemp, value: itemTemp })),
                    defaultValue,
                };
            }

            if (type === 'radio') {
                defaultValue = result || value[0];
                compProps = {
                    options: value,
                    defaultValue,
                };
            }
            return {
                fieldKey: nanoid(),
                type,
                subtype: [subtype1, subtype2].filter(Boolean).join('_'),
                compProps,
                value,
                result: defaultValue,
            };
        });
    });
}

export function formatWorkRecordConfigSave(data) {
    return data.map((item) => {
        return item.map((itemIn) => {
            const { type, subtype, value, result } = itemIn;

            return {
                type,
                identifier: `${type}_${subtype}`,
                value,
                result,
            };
        });
    });
}

export function genInputPresetsRow() {
    return [
        {
            fieldKey: nanoid(),
            type: 'input',
            subtype: 'presets',
            compProps: {
                style: {
                    width: 50,
                },
                maxLength: 400,
                autoSize: true,
                defaultValue: '',
            },
            value: [''],
            result: '',
        },
    ];
}
