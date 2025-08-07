import React, { CSSProperties } from 'react';
import { Card, Empty } from 'antd';
import { FileData } from '../utils/chartCalculations';
import { useChartDimensions } from '../hooks/useChartDimensions';
import { formatTimestamp, shortenFileId, formatFileSize } from '../utils/chartCalculations';

interface FilesTimeChartProps {
    files: FileData[];
    onFileClick?: (fileId: string) => void;
    height?: number;
    className?: string;
}

const FilesTimeChart: React.FC<FilesTimeChartProps> = ({ 
    files, 
    onFileClick, 
    height = 200,
    className 
}) => {
    const { dimensions, chartBars, isEmpty, hasValidTimeRange } = useChartDimensions(files);

    if (isEmpty) {
        return (
            <Card title="Files Time Range Chart" size="small" className={className}>
                <Empty description="No files data to display" />
            </Card>
        );
    }

    if (!hasValidTimeRange) {
        return (
            <Card title="Files Time Range Chart" size="small" className={className}>
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    All files have the same time range
                </div>
            </Card>
        );
    }

    const containerStyle: CSSProperties = {
        height: `${height}px`,
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        position: 'relative',
        backgroundColor: '#fafafa',
        overflowX: 'auto',
        cursor: 'default',
    };

    const contentStyle: CSSProperties = {
        height: '100%',
        position: 'relative',
        minWidth: '800px',
    };

    const axisStyle: CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30px',
        borderTop: '1px solid #d9d9d9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        fontSize: '10px',
        color: '#666',
        backgroundColor: '#fff',
    };

    const handleBarClick = (fileId: string) => {
        if (onFileClick) {
            onFileClick(fileId);
        }
    };

    return (
        <Card title="Files Time Range Chart" size="small" className={className}>
            <div style={containerStyle}>
                <div style={contentStyle}>
                    {chartBars.map(({ fileId, leftPercent, widthPercent, top, file }) => {
                        const barStyle: CSSProperties = {
                            position: 'absolute',
                            height: '2px',
                            backgroundColor: '#1890ff',
                            borderRadius: '1px',
                            opacity: 0.8,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            top: `${top}px`,
                        };

                        const tooltipText = [
                            `File: ${shortenFileId(fileId)}`,
                            `Start: ${formatTimestamp(file.time_range_start)}`,
                            `End: ${formatTimestamp(file.time_range_end)}`,
                            `Rows: ${file.rows.toLocaleString()}`,
                            `Size: ${formatFileSize(file.size)}`,
                            'Click to focus in list'
                        ].join('\n');

                        return (
                            <div
                                key={fileId}
                                style={barStyle}
                                title={tooltipText}
                                onClick={() => handleBarClick(fileId)}
                                onMouseEnter={(e) => {
                                    const target = e.currentTarget as HTMLElement;
                                    target.style.opacity = '1';
                                    target.style.height = '4px';
                                }}
                                onMouseLeave={(e) => {
                                    const target = e.currentTarget as HTMLElement;
                                    target.style.opacity = '0.8';
                                    target.style.height = '2px';
                                }}
                            />
                        );
                    })}
                    
                    {dimensions && (
                        <div style={axisStyle}>
                            <span>{formatTimestamp(dimensions.minTime + '::Millisecond')}</span>
                            <span>{formatTimestamp(dimensions.maxTime + '::Millisecond')}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default FilesTimeChart;