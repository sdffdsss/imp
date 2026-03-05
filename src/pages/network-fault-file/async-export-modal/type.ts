export interface DataType {
    key: string;
    exportFormat: string;
    exportTime: string;
    exportTotal: string;
    exportState: string;
    exportSchedule: {
        status: 'exception' | 'success' | 'normal' | 'active' | undefined;
        percent: number;
    };
}
