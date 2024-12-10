import React, { useState } from 'react';
import { Typography, Card, Button, message } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface OptimizedSQLProps {
    sql: string;
}

const OptimizedSQL: React.FC<OptimizedSQLProps> = ({ sql }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(sql);
            setCopied(true);
            message.success('SQL copied to clipboard');
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            message.error('Failed to copy SQL');
        }
    };

    return (
        <Card className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <Title level={4} className="m-0">Optimized SQL</Title>
                <Button
                    type="primary"
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopy}
                >
                    {copied ? 'Copied!' : 'Copy SQL'}
                </Button>
            </div>
            <SyntaxHighlighter
                language="sql"
                style={vscDarkPlus}
                customStyle={{
                    borderRadius: '4px',
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                }}
            >
                {sql}
            </SyntaxHighlighter>
        </Card>
    );
};

export default OptimizedSQL;

