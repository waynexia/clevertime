import React, { useState } from 'react';
import { Form, Select, Switch, Tag, Space } from 'antd';

const { Option } = Select;

interface ColumnInfoProps {
    columns: string[];
}

const ColumnInfo: React.FC<ColumnInfoProps> = ({ columns }) => {
    const [nullableStates, setNullableStates] = useState<Record<string, boolean>>(
        Object.fromEntries(columns.map(column => [column, false]))
    );

    const getSemanticTypeColor = (type: string) => {
        switch (type) {
            case 'id': return 'magenta';
            case 'name': return 'red';
            case 'date': return 'green';
            case 'number': return 'blue';
            default: return 'default';
        }
    };

    const handleNullableChange = (column: string, checked: boolean) => {
        setNullableStates(prev => ({ ...prev, [column]: checked }));
    };

    return (
        <Form layout="vertical" className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Column Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns.map((column) => (
                    <div key={column} className="p-4 border border-gray-200 rounded bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{column}</span>
                            <Space>
                                <Tag color={getSemanticTypeColor('name')}>Name</Tag>
                                <Tag color={nullableStates[column] ? 'orange' : 'red'}>
                                    {nullableStates[column] ? 'Nullable' : 'Not Nullable'}
                                </Tag>
                            </Space>
                        </div>
                        <Form.Item name={`${column}-type`} noStyle>
                            <Select size="small" style={{ width: '100%' }} placeholder="Data Type">
                                <Option value="int">Integer</Option>
                                <Option value="varchar">VARCHAR</Option>
                                <Option value="datetime">DateTime</Option>
                                <Option value="boolean">Boolean</Option>
                            </Select>
                        </Form.Item>
                        <div className="mt-2 flex justify-between items-center">
                            <Space>
                                <span className="text-xs text-gray-500">Indexed</span>
                                <Form.Item name={`${column}-index`} valuePropName="checked" noStyle>
                                    <Switch size="small" />
                                </Form.Item>
                            </Space>
                            <Space>
                                <span className="text-xs text-gray-500">Nullable</span>
                                <Form.Item name={`${column}-nullable`} valuePropName="checked" noStyle>
                                    <Switch
                                        size="small"
                                        checked={nullableStates[column]}
                                        onChange={(checked) => handleNullableChange(column, checked)}
                                    />
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

