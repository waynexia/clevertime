import React, { useState } from 'react';
import { Typography, Card, Button, message, Collapse } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { SQLSuggestion } from '../utils/rules';

const { Title } = Typography;
const { Panel } = Collapse;

const mockSuggestions: SQLSuggestion[] = [
    {
        title: "All Good",
        explanation: "No suggestion from our side!"
    },
];

interface OptimizedSQLProps {
    suggestions?: SQLSuggestion[];
}

const OptimizedSQL: React.FC<OptimizedSQLProps> = ({ suggestions = mockSuggestions }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = async (sql: string, index: number) => {
        try {
            await navigator.clipboard.writeText(sql);
            setCopiedIndex(index);
            message.success('SQL copied to clipboard');
            setTimeout(() => setCopiedIndex(null), 3000);
        } catch {
            message.error('Failed to copy SQL');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="mt-6">
                <Title level={4} className="mb-4">Optimization Suggestions</Title>
                <Collapse>
                    {suggestions.map((suggestion, index) => (
                        <Panel
                            header={suggestion.title}
                            key={index}
                            extra={suggestion.sql && (
                                <Button
                                    type="primary"
                                    icon={copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (suggestion.sql) {
                                            handleCopy(suggestion.sql, index);
                                        } else {
                                            message.error('No SQL to copy');
                                        }
                                    }}
                                >
                                    {copiedIndex === index ? 'Copied!' : 'Copy SQL'}
                                </Button>
                            )}
                        >
                            {suggestion.explanation && (
                                <p className="mb-4">{suggestion.explanation}</p>
                            )}
                            {suggestion.sql && (
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
                                    {suggestion.sql}
                                </SyntaxHighlighter>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            </Card>
        </div>
    );
};

export default OptimizedSQL;

