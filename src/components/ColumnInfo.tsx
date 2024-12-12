import React, { useState } from 'react';
import { Form, Select, Switch, Tag, Space, InputNumber, Button, Tooltip } from 'antd';
import { UpOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Column } from '../utils/parser';

const { Option } = Select;

interface ColumnInfoProps {
    columns: Column[];
}

const ColumnInfo: React.FC<ColumnInfoProps> = ({ columns }) => {
    const [collapsed, setCollapsed] = useState({
        timestamp: false,
        tag: false,
        field: false
    });

    const getSemanticTypeColor = (type: string) => {
        switch (type) {
            case 'timestamp': return 'magenta';
            case 'tag': return 'blue';
            case 'field': return 'cyan';
            default: return 'default';
        }
    };

    const groupedColumns = {
        timestamp: columns.filter(col => col.semanticType === 'timestamp'),
        tag: columns.filter(col => col.semanticType === 'tag'),
        field: columns.filter(col => col.semanticType === 'field')
    };

    const toggleSection = (section: 'timestamp' | 'tag' | 'field') => {
        setCollapsed(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderSectionHeader = (
        title: string,
        type: 'timestamp' | 'tag' | 'field',
        color: string,
        count: number
    ) => (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <h4 className={`text-md font-medium text-${color}-600 m-0`}>{title}</h4>
                <Tag>{count} columns</Tag>
            </div>
            <Button
                type="text"
                icon={collapsed[type] ? <DownOutlined /> : <UpOutlined />}
                onClick={() => toggleSection(type)}
                size="small"
            />
        </div>
    );

    const renderColumnCard = (column: Column) => (
        <div key={column.name} className="p-4 border border-gray-200 rounded bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{column.name}</span>
                <Space>
                    <Tag color={getSemanticTypeColor(column.semanticType)}>{column.semanticType}</Tag>
                    {column.semanticType !== 'timestamp' && (
                        <Tag color={column.nullable ? 'orange' : 'green'}>
                            {column.nullable ? 'Nullable' : 'Not Nullable'}
                        </Tag>
                    )}
                </Space>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <span className="text-xs text-gray-500">Type</span>
                    <Form.Item name={`${column.name}-type`} initialValue={column.dataType} noStyle>
                        <Select size="small" style={{ width: '100%' }} placeholder="Data Type">
                            <Option value="bigint">BigInt</Option>
                            <Option value="int">Integer</Option>
                            <Option value="varchar">VARCHAR</Option>
                            <Option value="text">Text</Option>
                            <Option value="timestamp">Timestamp</Option>
                            <Option value="datetime">DateTime</Option>
                            <Option value="boolean">Boolean</Option>
                            <Option value="float">Float</Option>
                            <Option value="double">Double</Option>
                        </Select>
                    </Form.Item>
                </div>
                <div className="flex-1">
                    <span className="text-xs text-gray-500">
                        Index
                        <Tooltip title="https://docs.greptime.com/user-guide/concepts/key-concepts/#index">
                            <QuestionCircleOutlined className="ml-1 text-gray-400" />
                        </Tooltip>
                    </span>
                    <Form.Item name={`${column.name}-index`} initialValue={column.index} noStyle>
                        <Select size="small" style={{ width: '100%' }}>
                            <Option value="none">None</Option>
                            <Option value="primary">Primary</Option>
                            <Option value="fulltext">Fulltext</Option>
                            <Option value="inverted">Inverted</Option>
                        </Select>
                    </Form.Item>
                </div>
            </div>
            {column.semanticType !== 'timestamp' && (
                <div className="mt-2 flex justify-between items-center">
                    <Space>
                        <span className="text-xs text-gray-500">Filter/Search Query</span>
                        <Form.Item name={`${column.name}-nullable`} valuePropName="checked" initialValue={false} noStyle>
                            <Switch size="small" />
                        </Form.Item>
                    </Space>
                    <Space>
                        <span className="text-xs text-gray-500">
                            Cardinality
                            <Tooltip title="https://docs.greptime.com/user-guide/concepts/why-greptimedb/#cost-effective">
                                <QuestionCircleOutlined className="ml-1 text-gray-400" />
                            </Tooltip>
                        </span>
                        <Form.Item name={`${column.name}-cardinality`} initialValue={0} noStyle>
                            <InputNumber size="small" min={0} style={{ width: '80px' }} />
                        </Form.Item>
                    </Space>
                </div>
            )}
        </div>
    );

    return (
        <Form layout="vertical" className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Column Information</h3>

            {groupedColumns.timestamp.length > 0 && (
                <div className="mb-6">
                    {renderSectionHeader(
                        'Timestamp Columns',
                        'timestamp',
                        'purple',
                        groupedColumns.timestamp.length
                    )}
                    {!collapsed.timestamp && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedColumns.timestamp.map(renderColumnCard)}
                        </div>
                    )}
                </div>
            )}

            {groupedColumns.tag.length > 0 && (
                <div className="mb-6">
                    {renderSectionHeader(
                        'Tag Columns',
                        'tag',
                        'blue',
                        groupedColumns.tag.length
                    )}
                    {!collapsed.tag && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedColumns.tag.map(renderColumnCard)}
                        </div>
                    )}
                </div>
            )}

            {groupedColumns.field.length > 0 && (
                <div className="mb-6">
                    {renderSectionHeader(
                        'Field Columns',
                        'field',
                        'cyan',
                        groupedColumns.field.length
                    )}
                    {!collapsed.field && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedColumns.field.map(renderColumnCard)}
                        </div>
                    )}
                </div>
            )}
        </Form>
    );
};

export default ColumnInfo;

