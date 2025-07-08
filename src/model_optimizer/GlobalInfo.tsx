import React from 'react';
import { Form, InputNumber, Card, Switch, Divider, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GlobalData } from '../utils/rules';

interface GlobalInfoProps {
    onUpdate?: (values: GlobalData) => void;
}

const defaultValues: GlobalData = {
    hasDuplicates: false,
    ingestThroughput: undefined,
};

const GlobalInfo: React.FC<GlobalInfoProps> = ({ onUpdate }) => {
    const [form] = Form.useForm<GlobalData>();

    React.useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [form]);

    return (
        <div className="mx-auto max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-2">Global Information</h2>
            <Card className="mt-6">
                <Form<GlobalData>
                    layout="vertical"
                    form={form}
                    initialValues={defaultValues}
                    onValuesChange={(_, allValues) => {
                        onUpdate?.(allValues);
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span>Is there duplicate data or is deduplication a concern?</span>
                            <Tooltip title={
                                <a
                                    href="https://docs.greptime.com/user-guide/administration/performance-tuning-tips/#using-append-only-table-if-possible"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    View documentation
                                </a>
                            }>
                                <QuestionCircleOutlined className="ml-1 text-gray-400" />
                            </Tooltip>
                        </div>
                        <Form.Item name="hasDuplicates" className="mb-0">
                            <Switch />
                        </Form.Item>
                    </div>
                    <Divider />
                    {/* <Form.Item label="Columns will be searched as text" name="orderBy">
                        <Input placeholder="Select columns" />
                    </Form.Item>
                    <Form.Item label="Limit" name="limit">
                        <InputNumber min={1} placeholder="Enter LIMIT value" style={{ width: '100%' }} />
                    </Form.Item> */}
                    <Form.Item
                        label="Estimated ingest throughput (peak)"
                        name="ingestThroughput"
                    >
                        <InputNumber
                            min={1}
                            placeholder="Enter throughput value"
                            style={{ width: '100%' }}
                            addonAfter="rows/s"
                        />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default GlobalInfo;

