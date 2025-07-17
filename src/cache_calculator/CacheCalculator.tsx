import React, { useState } from 'react';
import { Typography, Card, Button, Input, message } from 'antd';
import ResourceAllocator from './ResourceAllocator';

const { Title } = Typography;

interface ResourcePart {
    id: string;
    name: string;
    percentage: number;
    color: string;
}

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
        config: string;
        path: string;
    }>;
}

interface ConfigState {
    totalSize: number;
    parts: ResourcePart[];
}

interface CacheCalculatorProps {
    isActive?: boolean;
}

const CacheCalculator: React.FC<CacheCalculatorProps> = ({ isActive = true }) => {
    const [memoryState, setMemoryState] = useState<ConfigState | null>(null);
    const [diskState, setDiskState] = useState<ConfigState | null>(null);
    const [tomlConfig, setTomlConfig] = useState<string>('');

    const memoryConfig: ResourceConfig = {
        id: 'memory',
        title: 'Memory',
        color: '#a78bfa',
        initialTotalSize: 32,
        minSize: 1,
        maxSize: 392,
        step: 1,
        parts: [
            { id: 'meta', name: 'SST Metadata', percentage: 15, color: '#C64284', config: "sst_meta_cache_size", path: "region_engine.mito" },
            { id: 'page', name: 'SST Page', percentage: 50, color: '#435BF3', config: "page_cache_size", path: "region_engine.mito" },
            { id: 'index_content', name: 'Inverted Index', percentage: 10, color: '#85bfec', config: "content_cache_size", path: "region_engine.mito.index" },
            { id: 'index_result', name: 'Index Result', percentage: 5, color: '#DEA024', config: "result_cache_size", path: "region_engine.mito.index" },
            { id: 'array', name: 'Array', percentage: 5, color: '#0E6E75', config: "vector_cache_size", path: "region_engine.mito" },
            { id: 'selector', name: 'Series Selector', percentage: 5, color: '#9362EA', config: "selector_result_cache_size", path: "region_engine.mito" },
        ],
    };

    const diskConfig: ResourceConfig = {
        id: 'disk',
        title: 'Disk',
        color: '#60a5fa',
        initialTotalSize: 256,
        minSize: 8,
        maxSize: 1024,
        step: 1,
        parts: [
            { id: 'write', name: 'Write Cache', percentage: 50, color: '#B5D933', config: "write_cache_size", path: "region_engine.mito" },
            { id: 'read', name: 'Read Cache', percentage: 50, color: '#098A72', config: "cache_capacity", path: "storage" },
        ],
    };

    const handleConfigChange = (configId: string, totalSize: number, parts: ResourcePart[]) => {
        const newState = { totalSize, parts };

        if (configId === 'memory') {
            setMemoryState(newState);
        } else if (configId === 'disk') {
            setDiskState(newState);
        }
    };

    const generateTomlConfig = () => {
        if (!memoryState || !diskState) return '';

        const tomlSections: { [key: string]: any } = {};

        // Process memory config
        memoryConfig.parts.forEach(part => {
            const currentPart = memoryState.parts.find(p => p.id === part.id);
            if (currentPart && currentPart.percentage > 0) {
                const sizeGB = (memoryState.totalSize * (currentPart.percentage / 100));
                const pathParts = part.path.split('.');

                let currentSection = tomlSections;
                pathParts.forEach(pathPart => {
                    if (!currentSection[pathPart]) {
                        currentSection[pathPart] = {};
                    }
                    currentSection = currentSection[pathPart];
                });
                currentSection[part.config] = `"${sizeGB.toFixed(0)}GB"`;
            }
        });

        // Process disk config
        diskConfig.parts.forEach(part => {
            const currentPart = diskState.parts.find(p => p.id === part.id);
            if (currentPart && currentPart.percentage > 0) {
                const sizeGB = (diskState.totalSize * (currentPart.percentage / 100));
                const pathParts = part.path.split('.');

                let currentSection = tomlSections;
                pathParts.forEach(pathPart => {
                    if (!currentSection[pathPart]) {
                        currentSection[pathPart] = {};
                    }
                    currentSection = currentSection[pathPart];
                });
                currentSection[part.config] = `"${sizeGB.toFixed(0)}GiB"`;
            }
        });

        // Add enable_write_cache if write cache is configured
        const writeCachePart = diskState.parts.find(p => p.id === 'write');
        if (writeCachePart && writeCachePart.percentage > 0) {
            if (!tomlSections.region_engine) tomlSections.region_engine = {};
            if (!tomlSections.region_engine.mito) tomlSections.region_engine.mito = {};
            tomlSections.region_engine.mito.enable_write_cache = 'true';
        }

        // Convert to TOML string with proper formatting
        let toml = '';

        // Add storage section first with empty line before it
        if (tomlSections.storage) {
            toml += '\n[storage]\n';
            Object.entries(tomlSections.storage).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    toml += `${key} = ${value}\n`;
                }
            });
        }

        // Add region_engine sections
        if (tomlSections.region_engine) {
            toml += '\n[region_engine]\n';

            // Add direct region_engine values if any
            Object.entries(tomlSections.region_engine).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    toml += `${key} = ${value}\n`;
                }
            });

            // Add mito subsection with double brackets
            if (tomlSections.region_engine.mito) {
                toml += '[[region_engine.mito]]\n';
                Object.entries(tomlSections.region_engine.mito).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        toml += `${key} = ${value}\n`;
                    }
                });

                // Add index subsection if it exists
                if (tomlSections.region_engine.mito.index) {
                    toml += '\n[region_engine.mito.index]\n';
                    Object.entries(tomlSections.region_engine.mito.index).forEach(([key, value]) => {
                        if (typeof value === 'string') {
                            toml += `${key} = ${value}\n`;
                        }
                    });
                }
            }
        }

        return toml.trim();
    };

    // Update TOML when states change
    React.useEffect(() => {
        const newToml = generateTomlConfig();
        setTomlConfig(newToml);
    }, [memoryState, diskState]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(tomlConfig);
            message.success('Configuration copied to clipboard!');
        } catch (err) {
            message.error('Failed to copy to clipboard');
        }
    };

    return (
        <div>
            <Title level={2} className="text-center mb-6">Cache Calculator for GreptimeDB</Title>

            <Card className="max-w-6xl mx-auto">
                <div className="space-y-8">
                    <ResourceAllocator config={memoryConfig} onConfigChange={handleConfigChange} isActive={isActive} />
                    <ResourceAllocator config={diskConfig} onConfigChange={handleConfigChange} isActive={isActive} />

                    {/* TOML Configuration Section */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <Title level={3}>Generated TOML Configuration</Title>
                            <Button
                                type="primary"
                                onClick={copyToClipboard}
                                disabled={!tomlConfig}
                            >
                                Copy to Clipboard
                            </Button>
                        </div>
                        <Input.TextArea
                            value={tomlConfig}
                            onChange={(e) => setTomlConfig(e.target.value)}
                            placeholder="Configure the sliders above to generate TOML configuration..."
                            rows={15}
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                backgroundColor: '#f6f8fa'
                            }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CacheCalculator; 