import { useMemo } from 'react';
import { FileData, ChartDimensions, calculateChartDimensions, calculateChartBars, ChartBar } from '../utils/chartCalculations';

export interface UseChartDimensionsResult {
    dimensions: ChartDimensions | null;
    chartBars: ChartBar[];
    isEmpty: boolean;
    hasValidTimeRange: boolean;
}

export function useChartDimensions(files: FileData[]): UseChartDimensionsResult {
    const result = useMemo(() => {
        if (!files || files.length === 0) {
            return {
                dimensions: null,
                chartBars: [],
                isEmpty: true,
                hasValidTimeRange: false,
            };
        }

        const dimensions = calculateChartDimensions(files);
        
        if (!dimensions) {
            return {
                dimensions: null,
                chartBars: [],
                isEmpty: false,
                hasValidTimeRange: false,
            };
        }

        const chartBars = calculateChartBars(files, dimensions);

        return {
            dimensions,
            chartBars,
            isEmpty: false,
            hasValidTimeRange: true,
        };
    }, [files]);

    return result;
}