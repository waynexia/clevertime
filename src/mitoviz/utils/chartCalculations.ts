export interface FileData {
    file_id: string;
    time_range_start: string;
    time_range_end: string;
    rows: number;
    size: number;
    index_size: number;
}

export interface ChartBar {
    fileId: string;
    leftPercent: number;
    widthPercent: number;
    top: number;
    file: FileData;
}

export interface ChartDimensions {
    minTime: number;
    maxTime: number;
    timeRange: number;
    chartHeight: number;
    lineSpacing: number;
}

export function parseTimestamp(timestamp: string): number {
    const parts = timestamp.split('::');
    return parseInt(parts[0]);
}

export function formatTimestamp(timestamp: string): string {
    const ts = parseTimestamp(timestamp);
    return new Date(ts).toISOString().replace('T', ' ').replace('Z', '');
}

export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function shortenFileId(fileId: string): string {
    return fileId.substring(0, 8) + '...';
}

export function calculateChartDimensions(files: FileData[]): ChartDimensions | null {
    if (!files || files.length === 0) {
        return null;
    }

    let minTime = Infinity;
    let maxTime = -Infinity;

    files.forEach(file => {
        const start = parseTimestamp(file.time_range_start);
        const end = parseTimestamp(file.time_range_end);
        minTime = Math.min(minTime, start);
        maxTime = Math.max(maxTime, end);
    });

    const timeRange = maxTime - minTime;
    if (timeRange === 0) {
        return null;
    }

    const chartHeight = 170; // Leave space for axis
    const lineSpacing = Math.min(8, chartHeight / files.length);

    return {
        minTime,
        maxTime,
        timeRange,
        chartHeight,
        lineSpacing,
    };
}

export function calculateChartBars(files: FileData[], dimensions: ChartDimensions): ChartBar[] {
    // Sort files by end time then start time for Y-axis positioning
    const sortedFiles = [...files].sort((a, b) => {
        const endDiff = parseTimestamp(a.time_range_end) - parseTimestamp(b.time_range_end);
        if (endDiff !== 0) return endDiff;
        return parseTimestamp(a.time_range_start) - parseTimestamp(b.time_range_start);
    });

    return sortedFiles.map((file, index) => {
        const start = parseTimestamp(file.time_range_start);
        const end = parseTimestamp(file.time_range_end);
        const leftPercent = ((start - dimensions.minTime) / dimensions.timeRange) * 100;
        const widthPercent = ((end - start) / dimensions.timeRange) * 100;
        const top = index * dimensions.lineSpacing + 10; // Add some top margin

        return {
            fileId: file.file_id,
            leftPercent,
            widthPercent,
            top,
            file,
        };
    });
}