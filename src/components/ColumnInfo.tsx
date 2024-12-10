import React from 'react';
import { Form, Select, Switch, Tag, Space } from 'antd';

const { Option } = Select;

interface Column {
    name: string;
    dataType: string;
    semanticType: string;
    nullable: boolean;
    index: string | null;
}

interface ColumnInfoProps {
    columns: Column[];
}

const ColumnInfo: React.FC<ColumnInfoProps> = ({ columns }) => {
    const getSemanticTypeColor = (type: string) => {
        switch (type) {
            case 'identifier': return 'magenta';
            case 'text': return 'blue';
            case 'email': return 'cyan';
            case 'timestamp': return 'green';
            default: return 'default';
        }
    };

    return (
        <Form layout="vertical" className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Column Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns.map((column) => (
                    <div key={column.name} className="p-4 border border-gray-200 rounded bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{column.name}</span>
                            <Space>
                                <Tag color={getSemanticTypeColor(column.semanticType)}>{column.semanticType}</Tag>
                                <Tag color={column.nullable ? 'orange' : 'red'}>
                                    {column.nullable ? 'Nullable' : 'Not Nullable'}
                                </Tag>
                            </Space>
                        </div>
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
                        <div className="mt-2 flex justify-between items-center">
                            <Space>
                                <span className="text-xs text-gray-500">Index Type</span>
                                <Form.Item name={`${column.name}-index`} initialValue={column.index} noStyle>
                                    <Select size="small" style={{ width: '120px' }}>
                                        <Option value="">None</Option>
                                        <Option value="primary">Primary</Option>
                                        <Option value="unique">Unique</Option>
                                        <Option value="btree">BTree</Option>
                                        <Option value="hash">Hash</Option>
                                    </Select>
                                </Form.Item>
                            </Space>
                            <Space>
                                <span className="text-xs text-gray-500">Nullable</span>
                                <Form.Item name={`${column.name}-nullable`} valuePropName="checked" initialValue={column.nullable} noStyle>
                                    <Switch size="small" />
                                </Form.Item>
                            </Space>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default ColumnInfo;

