export default function selectedModuleByGroupConverter(res) {
    if (res?.code === 200 && Array.isArray(res.rows)) {
        const { rows } = res;

        return rows.map((item) => {
            return {
                label: item.groupName,
                value: String(item.groupId),
            };
        });
    }

    return [];
}
