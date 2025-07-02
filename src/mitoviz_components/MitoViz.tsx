import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Card,
    Input,
    Button,
    Table,
    Collapse,
    Checkbox,
    Select,
    Row,
    Col,
    Space,
    Typography,
    Tooltip,
    message,
    Tag,
    Divider,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;
const { Panel } = Collapse;

interface PartitionCount {
    count: number;
    mem_ranges: number;
    files: number;
    file_ranges: number;
}

interface FileData {
    file_id: string;
    time_range_start: string;
    time_range_end: string;
    rows: number;
    size: number;
    index_size: number;
}

interface PartitionMetrics {
    [key: string]: string | number;
}

interface Partition {
    partition: number;
    metrics: PartitionMetrics;
}

interface MitoVizData {
    partition_count?: PartitionCount;
    num_mem_ranges?: number;
    num_files?: number;
    num_file_ranges?: number;
    projection?: string[];
    files?: FileData[];
    metrics_per_partition?: Partition[];
    [key: string]: unknown;
}

interface FileTableRecord {
    key: string;
    index: number;
    file_id: string;
    short_id: string;
    start_time: string;
    end_time: string;
    time_span: string;
    rows: number;
    size: string;
    index_size: string;
}

interface SummaryTableRecord {
    key: string;
    metric: string;
    value: string;
    visible: boolean;
}

const MitoViz: React.FC = () => {
    const [jsonInput, setJsonInput] = useState<string>('');
    const [data, setData] = useState<MitoVizData | null>(null);
    const [selectedPartitions, setSelectedPartitions] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filesSortBy, setFilesSortBy] = useState<string>('default');
    const [showFullFileIds, setShowFullFileIds] = useState<boolean>(false);
    const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>({});

    const exampleData: MitoVizData = useMemo(() => ({
        partition_count: { count: 26415, mem_ranges: 0, files: 266, file_ranges: 26415 },
        num_mem_ranges: 0,
        num_files: 0,
        num_file_ranges: 0,
        projection: ['ts', 'log_uid', 'log_message', 'log_status', 'p', 'host_id', 'host_name'],
        files: [
            {
                file_id: 'fb5e2e46-3ec7-49b0-9b1f-105d20c1c426',
                time_range_start: '1750049996844::Millisecond',
                time_range_end: '1750049999999::Millisecond',
                rows: 1385377,
                size: 69146519,
                index_size: 6091707,
            },
            {
                file_id: '186ab9e4-a6e7-460b-9dc7-9a14e2260ba2',
                time_range_start: '1750045912798::Millisecond',
                time_range_end: '1750045923654::Millisecond',
                rows: 3350000,
                size: 167078268,
                index_size: 13714665,
            },
        ],
        metrics_per_partition: [
            {
                partition: 0,
                metrics: {
                    prepare_scan_cost: '272.571µs',
                    build_reader_cost: '0ns',
                    scan_cost: '0ns',
                    total_cost: '275.236µs',
                    num_rows: 0,
                    num_batches: 0,
                },
            },
            {
                partition: 1,
                metrics: {
                    prepare_scan_cost: '131.016µs',
                    build_reader_cost: '0ns',
                    scan_cost: '0ns',
                    total_cost: '140.974µs',
                    num_rows: 1000,
                    num_batches: 5,
                },
            },
        ],
    }), []);

    useEffect(() => {
        setJsonInput(JSON.stringify(exampleData, null, 2));
        setData(exampleData);
        if (exampleData.metrics_per_partition) {
            setSelectedPartitions(new Set(exampleData.metrics_per_partition.map(p => p.partition)));
        }
    }, [exampleData]);

    const handleRender = () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            setData(parsedData);
            if (parsedData.metrics_per_partition) {
                setSelectedPartitions(new Set(parsedData.metrics_per_partition.map((p: Partition) => p.partition)));
            }
            message.success('Data rendered successfully');
        } catch {
            message.error('Invalid JSON format');
        }
    };

    const parseTimestamp = (timestamp: string): number => {
        const parts = timestamp.split('::');
        return parseInt(parts[0]);
    };

    const formatTimestamp = useCallback((timestamp: string): string => {
        const ts = parseTimestamp(timestamp);
        return new Date(ts).toISOString().replace('T', ' ').replace('Z', '');
    }, []);

    const formatFileSize = (bytes: number): string => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const shortenFileId = (fileId: string): string => {
        return fileId.substring(0, 8) + '...';
    };

    const parseTime = (timeStr: string | number): number => {
        if (typeof timeStr === 'number') return timeStr;
        if (typeof timeStr !== 'string') return 0;

        const value = parseFloat(timeStr);
        if (isNaN(value)) return 0;

        if (timeStr.endsWith('ns')) return value;
        if (timeStr.endsWith('µs')) return value * 1000;
        if (timeStr.endsWith('ms')) return value * 1000 * 1000;
        if (timeStr.endsWith('s')) return value * 1000 * 1000 * 1000;
        return value;
    };

    const formatNanos = (ns: number): string => {
        if (ns < 1000) return `${ns.toFixed(0)}ns`;
        if (ns < 1000 * 1000) return `${(ns / 1000).toFixed(3)}µs`;
        if (ns < 1000 * 1000 * 1000) return `${(ns / (1000 * 1000)).toFixed(3)}ms`;
        return `${(ns / (1000 * 1000 * 1000)).toFixed(3)}s`;
    };

    const formatFieldName = (name: string): string => {
        return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success('Copied to clipboard');
        } catch {
            message.error('Failed to copy');
        }
    };

    const sortedFiles = useMemo(() => {
        if (!data?.files) return [];

        const files = [...data.files];
        switch (filesSortBy) {
            case 'start_time':
                return files.sort((a, b) => parseTimestamp(a.time_range_start) - parseTimestamp(b.time_range_start));
            case 'end_time':
                return files.sort((a, b) => parseTimestamp(a.time_range_end) - parseTimestamp(b.time_range_end));
            case 'rows':
                return files.sort((a, b) => b.rows - a.rows);
            case 'size':
                return files.sort((a, b) => b.size - a.size);
            case 'index_size':
                return files.sort((a, b) => b.index_size - a.index_size);
            case 'time_span':
                return files.sort((a, b) => {
                    const spanA = parseTimestamp(a.time_range_end) - parseTimestamp(a.time_range_start);
                    const spanB = parseTimestamp(b.time_range_end) - parseTimestamp(b.time_range_start);
                    return spanB - spanA;
                });
            default:
                return files;
        }
    }, [data?.files, filesSortBy]);

    const filteredPartitions = useMemo(() => {
        if (!data?.metrics_per_partition) return [];

        return data.metrics_per_partition.filter(partition => {
            const isSelected = selectedPartitions.has(partition.partition);
            const matchesSearch = searchTerm === '' ||
                JSON.stringify(partition.metrics).toLowerCase().includes(searchTerm.toLowerCase());
            return isSelected && matchesSearch;
        });
    }, [data?.metrics_per_partition, selectedPartitions, searchTerm]);

    const summaryMetrics = useMemo(() => {
        const summary: Record<string, number> = {};

        filteredPartitions.forEach(partition => {
            Object.entries(partition.metrics).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    summary[key] = (summary[key] || 0) + value;
                } else {
                    summary[key] = (summary[key] || 0) + parseTime(value);
                }
            });
        });

        return summary;
    }, [filteredPartitions]);

    const topLevelData = useMemo(() => {
        if (!data) return [];

        const tableData = [];
        for (const [key, value] of Object.entries(data)) {
            if (!['projection', 'metrics_per_partition', 'files'].includes(key)) {
                if (key === 'partition_count' && typeof value === 'object') {
                    tableData.push({
                        key,
                        field: formatFieldName(key),
                        value: Object.entries(value as PartitionCount)
                            .map(([k, v]) => `${formatFieldName(k)}: ${v}`)
                            .join(', '),
                    });
                } else {
                    tableData.push({
                        key,
                        field: formatFieldName(key),
                        value: String(value),
                    });
                }
            }
        }
        return tableData;
    }, [data]);

    const filesTableData = useMemo(() => {
        return sortedFiles.map((file, index) => ({
            key: file.file_id,
            index: index + 1,
            file_id: file.file_id,
            short_id: shortenFileId(file.file_id),
            start_time: formatTimestamp(file.time_range_start),
            end_time: formatTimestamp(file.time_range_end),
            time_span: ((parseTimestamp(file.time_range_end) - parseTimestamp(file.time_range_start)) / 1000).toFixed(1) + 's',
            rows: file.rows,
            size: formatFileSize(file.size),
            index_size: formatFileSize(file.index_size),
        }));
    }, [sortedFiles, formatTimestamp]);

    const summaryTableData = useMemo(() => {
        return Object.entries(summaryMetrics).map(([key, value]) => {
            const isTime = filteredPartitions.length > 0 &&
                typeof filteredPartitions[0].metrics[key] === 'string' &&
                (filteredPartitions[0].metrics[key] as string).match(/(ns|µs|ms|s)$/);

            return {
                key,
                metric: formatFieldName(key),
                value: isTime ? formatNanos(value) : value.toLocaleString(),
                visible: fieldVisibility[key] ?? (value !== 0),
            };
        });
    }, [summaryMetrics, fieldVisibility, filteredPartitions]);

    const topLevelColumns = [
        { title: 'Field', dataIndex: 'field', key: 'field' },
        { title: 'Value', dataIndex: 'value', key: 'value' },
    ];

    const filesColumns = [
        { title: '#', dataIndex: 'index', key: 'index', width: 50 },
        {
            title: 'File ID',
            dataIndex: showFullFileIds ? 'file_id' : 'short_id',
            key: 'file_id',
            render: (_text: string, record: FileTableRecord) => (
                <Tooltip title={record.file_id}>
                    <Text code style={{ fontSize: '11px' }}>
                        {showFullFileIds ? record.file_id : record.short_id}
                    </Text>
                </Tooltip>
            ),
        },
        { title: 'Start Time', dataIndex: 'start_time', key: 'start_time' },
        { title: 'End Time', dataIndex: 'end_time', key: 'end_time' },
        { title: 'Time Span', dataIndex: 'time_span', key: 'time_span' },
        {
            title: 'Rows',
            dataIndex: 'rows',
            key: 'rows',
            render: (value: number) => value.toLocaleString(),
        },
        { title: 'Size', dataIndex: 'size', key: 'size' },
        { title: 'Index Size', dataIndex: 'index_size', key: 'index_size' },
    ];

    const summaryColumns = [
        {
            title: 'Show',
            dataIndex: 'visible',
            key: 'visible',
            width: 60,
            render: (visible: boolean, record: SummaryTableRecord) => (
                <Checkbox
                    checked={visible}
                    onChange={(e) => {
                        setFieldVisibility(prev => ({
                            ...prev,
                            [record.key]: e.target.checked,
                        }));
                    }}
                />
            ),
        },
        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
        { title: 'Total Value', dataIndex: 'value', key: 'value' },
    ];

    return (
        <div className="space-y-6">
            <Card title="JSON Input">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your GreptimeDB runtime metrics JSON here..."
                        rows={8}
                        style={{ fontFamily: 'monospace' }}
                    />
                    <Button type="primary" onClick={handleRender}>
                        Render
                    </Button>
                </Space>
            </Card>

            {data && (
                <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={8}>
                            <Card title="Top Level Attributes" size="small">
                                <Table
                                    dataSource={topLevelData}
                                    columns={topLevelColumns}
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Projection" size="small">
                                {data.projection && (
                                    <Collapse size="small" defaultActiveKey={['1']}>
                                        <Panel header={`Projected Columns (${data.projection.length})`} key="1">
                                            <Space wrap>
                                                {data.projection.map((column, index) => (
                                                    <Tag
                                                        key={index}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => copyToClipboard(column)}
                                                        icon={<CopyOutlined />}
                                                    >
                                                        {column}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        </Panel>
                                    </Collapse>
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Files" size="small">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space wrap>
                                        <Checkbox
                                            checked={showFullFileIds}
                                            onChange={(e) => setShowFullFileIds(e.target.checked)}
                                        >
                                            Show Full File IDs
                                        </Checkbox>
                                        <Select
                                            value={filesSortBy}
                                            onChange={setFilesSortBy}
                                            style={{ width: 150 }}
                                            size="small"
                                        >
                                            <Select.Option value="default">Default Order</Select.Option>
                                            <Select.Option value="start_time">Start Time</Select.Option>
                                            <Select.Option value="end_time">End Time</Select.Option>
                                            <Select.Option value="rows">Rows</Select.Option>
                                            <Select.Option value="size">Size</Select.Option>
                                            <Select.Option value="index_size">Index Size</Select.Option>
                                            <Select.Option value="time_span">Time Span</Select.Option>
                                        </Select>
                                    </Space>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <Table
                                            dataSource={filesTableData}
                                            columns={filesColumns}
                                            pagination={false}
                                            size="small"
                                            scroll={{ x: true }}
                                        />
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Partitions Summary" size="small">
                        <Text type="secondary">
                            This summarizes metrics for all <strong>visible</strong> partitions.
                            Use checkboxes to toggle field visibility in the partition cards below.
                        </Text>
                        <Divider />
                        <Table
                            dataSource={summaryTableData}
                            columns={summaryColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>

                    <Card title="Partitions" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space wrap align="center">
                                <Input.Search
                                    placeholder="Search partitions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: 200 }}
                                    allowClear
                                />
                                <Button
                                    size="small"
                                    onClick={() => {
                                        if (data.metrics_per_partition) {
                                            setSelectedPartitions(new Set(data.metrics_per_partition.map(p => p.partition)));
                                        }
                                    }}
                                >
                                    Select All
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSelectedPartitions(new Set())}
                                >
                                    Unselect All
                                </Button>
                            </Space>

                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '8px' }}>
                                <Space wrap>
                                    {data.metrics_per_partition?.map(partition => (
                                        <Checkbox
                                            key={partition.partition}
                                            checked={selectedPartitions.has(partition.partition)}
                                            onChange={(e) => {
                                                const newSelected = new Set(selectedPartitions);
                                                if (e.target.checked) {
                                                    newSelected.add(partition.partition);
                                                } else {
                                                    newSelected.delete(partition.partition);
                                                }
                                                setSelectedPartitions(newSelected);
                                            }}
                                        >
                                            Partition {partition.partition}
                                        </Checkbox>
                                    ))}
                                </Space>
                            </div>

                            <Row gutter={[16, 16]}>
                                {filteredPartitions.map(partition => (
                                    <Col xs={24} md={12} lg={8} key={partition.partition}>
                                        <Card
                                            title={`Partition ${partition.partition}`}
                                            size="small"
                                            style={{ height: '100%' }}
                                        >
                                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                {Object.entries(partition.metrics)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([key, value]) => {
                                                        const isVisible = fieldVisibility[key] ?? (value !== 0 && value !== '0ns');
                                                        if (!isVisible) return null;

                                                        const isZero = value === 0 || value === '0ns';
                                                        return (
                                                            <div
                                                                key={key}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    padding: '2px 0',
                                                                    opacity: isZero ? 0.5 : 1,
                                                                    fontSize: '12px',
                                                                }}
                                                            >
                                                                <Text strong>{formatFieldName(key)}:</Text>
                                                                <Text code>{String(value)}</Text>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Space>
                    </Card>
                </>
            )}
        </div>
    );
};

export default MitoViz; 