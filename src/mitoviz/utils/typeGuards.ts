export interface NestedMetrics {
    [key: string]: string | number | undefined;
}

export const isNestedMetric = (value: unknown): value is NestedMetrics => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};
