import React from 'react';
import { Form, Input, InputNumber, Card } from 'antd';

const GlobalInfo: React.FC = () => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-2">Global Information</h2>
            <Card className="mt-6">
                <Form layout="vertical">
                    <Form.Item label="Condition" name="condition">
                        <Input placeholder="Enter WHERE condition" />
                    </Form.Item>
                    <Form.Item label="Order By" name="orderBy">
                        <Input placeholder="Enter ORDER BY clause" />
                    </Form.Item>
                    <Form.Item label="Limit" name="limit">
                        <InputNumber min={1} placeholder="Enter LIMIT value" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default GlobalInfo;

