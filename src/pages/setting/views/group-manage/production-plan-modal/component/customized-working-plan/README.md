# 使用

```tsx
import { CustomizedWorkingPlan } from 'customized-working-plan';

const Comp = () => {
    return (
        <>
            <CustomizedWorkingPlan
                //
                defaultTabActiveKey={'any'}
                onTabChange={(activeKey, info) => {}}
                onCellSelectChange={(value, info) => {}}
            />
        </>
    );
};
```
