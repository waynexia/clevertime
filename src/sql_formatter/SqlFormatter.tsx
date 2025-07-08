import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Button, Modal, Space, Typography, Divider, message } from 'antd';
import { CopyOutlined, FullscreenOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Helper functions to convert between dialects
function convertPostgresToMySQL(sql: string): string {
    let result = '';
    let inSingleQuote = false;

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (char === "'") {
            inSingleQuote = !inSingleQuote;
            result += char;
        } else if (char === '"' && !inSingleQuote) {
            result += '`';
        } else {
            result += char;
        }
    }

    return result;
}

function convertMySQLToPostgres(sql: string): string {
    let result = '';
    let inSingleQuote = false;

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (char === "'") {
            inSingleQuote = !inSingleQuote;
            result += char;
        } else if (char === '`' && !inSingleQuote) {
            result += '"';
        } else {
            result += char;
        }
    }

    return result;
}

function convertSqlDialect(
    sql: string,
    inputDialect: 'postgresql' | 'mysql',
    outputDialect: 'postgresql' | 'mysql'
): string {
    if (!sql.trim()) return '';
    if (inputDialect === outputDialect) return sql;

    if (inputDialect === 'postgresql' && outputDialect === 'mysql') {
        return convertPostgresToMySQL(sql);
    }

    if (inputDialect === 'mysql' && outputDialect === 'postgresql') {
        return convertMySQLToPostgres(sql);
    }

    return sql;
}

type Dialect = 'postgresql' | 'mysql';

const SqlFormatter: React.FC = () => {
    const [inputSql, setInputSql] = useState<string>('');
    const [outputSql, setOutputSql] = useState<string>('');
    const [inputDialect, setInputDialect] = useState<Dialect>('postgresql');
    const [outputDialect, setOutputDialect] = useState<Dialect>('mysql');

    const [inputModalOpen, setInputModalOpen] = useState(false);
    const [outputModalOpen, setOutputModalOpen] = useState(false);

    const handleCopy = (text: string) => {
        if (!text) {
            message.warning('Nothing to copy');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            message.success('Copied to clipboard');
        }).catch(() => {
            message.error('Failed to copy');
        });
    };

    // Perform conversion whenever dependencies change
    useEffect(() => {
        const converted = convertSqlDialect(inputSql, inputDialect, outputDialect);
        setOutputSql(converted);
    }, [inputSql, inputDialect, outputDialect]);

    const codeStyle: React.CSSProperties = {
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        fontSize: 14,
    };

    return (
        <div>
            <Space size="large" direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16} align="top">
                    <Col span={12}>
                        <Space align="baseline">
                            <Typography.Text strong>Input SQL</Typography.Text>
                            <Select
                                size="small"
                                value={inputDialect}
                                onChange={(val: Dialect) => setInputDialect(val)}
                            >
                                <Select.Option value="postgresql">PostgreSQL</Select.Option>
                                <Select.Option value="mysql">MySQL</Select.Option>
                            </Select>
                            <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(inputSql)} />
                            <Button type="text" icon={<FullscreenOutlined />} onClick={() => setInputModalOpen(true)} />
                        </Space>
                        <TextArea
                            rows={18}
                            value={inputSql}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputSql(e.target.value)}
                            placeholder="Enter SQL here..."
                            style={codeStyle}
                            spellCheck={false}
                        />
                    </Col>

                    <Col span={12}>
                        <Space align="baseline">
                            <Typography.Text strong>Output SQL</Typography.Text>
                            <Select
                                size="small"
                                value={outputDialect}
                                onChange={(val: Dialect) => setOutputDialect(val)}
                            >
                                <Select.Option value="postgresql">PostgreSQL</Select.Option>
                                <Select.Option value="mysql">MySQL</Select.Option>
                            </Select>
                            <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(outputSql)} />
                            <Button type="text" icon={<FullscreenOutlined />} onClick={() => setOutputModalOpen(true)} />
                        </Space>
                        <TextArea rows={18} value={outputSql} readOnly style={codeStyle} />
                    </Col>
                </Row>

                <Divider />
                <Typography.Paragraph type="secondary">
                    Note: This formatter currently handles basic identifier quoting differences between
                    PostgreSQL (double quotes) and MySQL (backticks). Complex SQL features may require
                    manual adjustments.
                </Typography.Paragraph>
            </Space>

            {/* Input Modal */}
            <Modal
                open={inputModalOpen}
                title="Edit Input SQL"
                onOk={() => setInputModalOpen(false)}
                onCancel={() => setInputModalOpen(false)}
                width={800}
            >
                <TextArea
                    rows={20}
                    value={inputSql}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputSql(e.target.value)}
                    style={codeStyle}
                    spellCheck={false}
                />
            </Modal>

            {/* Output Modal */}
            <Modal
                open={outputModalOpen}
                title="Formatted SQL"
                onOk={() => setOutputModalOpen(false)}
                onCancel={() => setOutputModalOpen(false)}
                width={800}
                footer={<Button onClick={() => setOutputModalOpen(false)}>Close</Button>}
            >
                <TextArea rows={20} value={outputSql} readOnly style={codeStyle} />
            </Modal>
        </div>
    );
};

export default SqlFormatter; 