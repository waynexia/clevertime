import React from 'react';
import { Form, Input, InputNumber } from 'antd';

const GlobalInfo: React.FC = () => {
    return (
        <Form layout="vertical" className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Global Information</h3>
            <Form.Item label="Condition" name="condition">
                <Input placeholder="Enter WHERE condition" />
            </Form.Item>
            <Form.Item label="Order By" name="orderBy">
                <Input placeholder="Enter ORDER BY clause" />
            </Form.Item>
            <Form.Item label="Limit" name="limit">
                <InputNumber min={1} placeholder="Enter LIMIT value" />
            </Form.Item>
        </Form>
    );
};

export default GlobalInfo;

