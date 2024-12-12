import React, { useState } from 'react';
import { Input, message, Badge, Tooltip } from 'antd';

interface URLInputProps {
    onSubmit?: (url: string) => void;
}

type HealthStatus = 'default' | 'success' | 'error' | 'processing';

const URLInput: React.FC<URLInputProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState<string>('');
    const [status, setStatus] = useState<HealthStatus>('default');
    const [checking, setChecking] = useState(false);

    const checkHealth = async (urlToCheck: string) => {
        setStatus('processing');
        setChecking(true);
        try {
            const response = await fetch(`http://${urlToCheck}/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                    'Content-Type': 'application/json',
                },
                credentials: 'omit'
            });
            if (response.status === 200) {
                setStatus('success');
                return true;
            } else {
                setStatus('error');
                message.error('Server health check failed');
                return false;
            }
        } catch (error) {
            setStatus('error');
            console.error('Health check error:', error);
            message.error(error instanceof Error ? error.message : 'Could not connect to server');
            return false;
        } finally {
            setChecking(false);
        }
    };

    const handleUrlSubmit = async (url: string) => {
        if (!url) return false;
        const isHealthy = await checkHealth(url);
        if (isHealthy) {
            onSubmit?.(url);
            return true;
        }
        return false;
    };

    const getStatusProps = () => {
        switch (status) {
            case 'success':
                return { status: 'success', text: 'Healthy' };
            case 'error':
                return { status: 'error', text: 'Unhealthy' };
            case 'processing':
                return { status: 'processing', text: 'Checking' };
            default:
                return { status: 'default', text: 'Not checked' };
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-6 flex items-center gap-2">
            <Input.Group compact className="flex-1">
                <Input
                    style={{ width: '20%' }}
                    disabled
                    defaultValue="http://"
                />
                <Input.Search
                    style={{ width: '80%' }}
                    placeholder="Enter your URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={() => handleUrlSubmit(url)}
                    disabled={checking}
                />
            </Input.Group>
            <Tooltip title={getStatusProps().text}>
                <Badge
                    status={getStatusProps().status as 'success' | 'error' | 'default' | 'processing'}
                    className="ml-2"
                />
            </Tooltip>
        </div>
    );
};

export default URLInput;
