import React from 'react';
import { Typography, Card } from 'antd';
import ResourceAllocator from './ResourceAllocator';

const { Title } = Typography;

interface ResourceConfig {
    id: string;
    title: string;
    color: string;
    initialTotalSize: number;
    minSize: number;
    maxSize: number;
    step: number;
    parts: Array<{
        id: string;
        name: string;
        percentage: number;
        color: string;
    }>;
}

const CacheCalculator: React.FC = () => {
    const memoryConfig: ResourceConfig = {
        id: 'memory',
        title: 'Memory',
        color: '#a78bfa',
        initialTotalSize: 128,
        minSize: 1,
        maxSize: 392,
        step: 1,
        parts: [
            { id: 'meta', name: 'Meta', percentage: 15, color: '#c4b5fd' },
            { id: 'page', name: 'Page', percentage: 50, color: '#a78bfa' },
            { id: 'index', name: 'Index', percentage: 25, color: '#8b5cf6' },
        ],
    };

    const diskConfig: ResourceConfig = {
        id: 'disk',
        title: 'Disk',
        color: '#60a5fa',
        initialTotalSize: 1024,
        minSize: 8,
        maxSize: 1024,
        step: 8,
        parts: [
            { id: 'data', name: 'Data', percentage: 70, color: '#93c5fd' },
            { id: 'logs', name: 'Logs', percentage: 10, color: '#60a5fa' },
            { id: 'wal', name: 'WAL', percentage: 10, color: '#3b82f6' },
        ],
    };

    return (
        <div>
            <Title level={2} className="text-center mb-6">Cache Calculator for GreptimeDB</Title>

            <Card className="max-w-6xl mx-auto">
                <div className="space-y-8">
                    <ResourceAllocator config={memoryConfig} />
                    <ResourceAllocator config={diskConfig} />
                </div>
            </Card>
        </div>
    );
};

export default CacheCalculator; 