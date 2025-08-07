export interface MetricStats {
    min: number;
    max: number;
    isTime: boolean;
    isNumeric: boolean;
}

export function parseTime(timeStr: string | number): number {
    if (typeof timeStr === 'number') return timeStr;
    if (typeof timeStr !== 'string') return 0;

    const value = parseFloat(timeStr);
    if (isNaN(value)) return 0;

    if (timeStr.endsWith('ns')) return value;
    if (timeStr.endsWith('µs')) return value * 1000;
    if (timeStr.endsWith('ms')) return value * 1000 * 1000;
    if (timeStr.endsWith('s')) return value * 1000 * 1000 * 1000;
    return value;
}

export function formatNanos(ns: number): string {
    if (ns < 1000) return `${ns.toFixed(0)}ns`;
    if (ns < 1000 * 1000) return `${(ns / 1000).toFixed(3)}µs`;
    if (ns < 1000 * 1000 * 1000) return `${(ns / (1000 * 1000)).toFixed(3)}ms`;
    return `${(ns / (1000 * 1000 * 1000)).toFixed(3)}s`;
}

export function calculateMetricStats(partitions: Array<{ metrics: Record<string, string | number> }>): Record<string, MetricStats> {
    const stats: Record<string, MetricStats> = {};
    
    partitions.forEach(partition => {
        Object.entries(partition.metrics).forEach(([key, value]) => {
            if (!stats[key]) {
                stats[key] = { 
                    min: Infinity, 
                    max: -Infinity, 
                    isTime: false, 
                    isNumeric: true 
                };
            }
            
            const stat = stats[key];
            
            if (typeof value === 'string' && (value.endsWith('ns') || value.endsWith('µs') || value.endsWith('ms') || value.endsWith('s'))) {
                const ns = parseTime(value);
                if (ns > 0) {
                    stat.min = Math.min(stat.min, ns);
                    stat.max = Math.max(stat.max, ns);
                }
                stat.isTime = true;
            } else if (typeof value === 'number') {
                if (value > 0) {
                    stat.min = Math.min(stat.min, value);
                    stat.max = Math.max(stat.max, value);
                }
            } else {
                stat.isNumeric = false;
            }
        });
    });
    
    return stats;
}

export function getColorForValue(value: number, min: number, max: number): string {
    if (value === 0 || max === min) return 'inherit';
    
    // From green (120) to red (0) in HSL
    const hue = 120 * (1 - ((value - min) / (max - min)));
    return `hsl(${hue}, 80%, 60%)`;
}

export function getMetricColor(
    value: string | number, 
    stats: MetricStats | undefined
): string {
    if (!stats || !stats.isNumeric || value === 0 || value === '0ns') {
        return 'inherit';
    }
    
    const numericValue = stats.isTime ? parseTime(value) : (typeof value === 'number' ? value : 0);
    return getColorForValue(numericValue, stats.min, stats.max);
}