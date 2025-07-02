import React, { useState, useEffect, useRef } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Text, Title } = Typography;

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
    parts: ResourcePart[];
}

interface ResourceAllocatorProps {
    config: ResourceConfig;
}

const ResourceAllocator: React.FC<ResourceAllocatorProps> = ({ config }) => {
    const [totalSize, setTotalSize] = useState(config.initialTotalSize);
    const totalUsedPercent = config.parts.reduce((sum, part) => sum + part.percentage, 0);
    const initialUnusedPercent = Math.max(0, 100 - totalUsedPercent);

    // Add unused space as an adjustable part
    const [parts, setParts] = useState<ResourcePart[]>([
        ...config.parts,
        { id: 'unused', name: 'Unused', percentage: initialUnusedPercent, color: '#e5e7eb' }
    ]);
    const [activePart, setActivePart] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const activePartData = parts.find(p => p.id === activePart);

    useEffect(() => {
        drawLines();
    }, [parts, totalSize]);

    const handleFineTune = (type: 'percent' | 'size', value: number) => {
        if (!activePartData) return;

        let newPercent: number;
        if (type === 'percent') {
            newPercent = Math.max(0, Math.min(100, value));
        } else {
            newPercent = Math.max(0, Math.min(100, (value / totalSize) * 100));
        }

        const oldPercent = activePartData.percentage;
        const diff = newPercent - oldPercent;

        const otherParts = parts.filter(p => p.id !== activePart);
        const totalOtherPercent = otherParts.reduce((sum, p) => sum + p.percentage, 0);

        if (totalOtherPercent - diff < 0) {
            return; // Not enough space
        }

        const newParts = parts.map(part => {
            if (part.id === activePart) {
                return { ...part, percentage: newPercent };
            }

            if (totalOtherPercent > 0) {
                const proportion = part.percentage / totalOtherPercent;
                return { ...part, percentage: Math.max(0, part.percentage - diff * proportion) };
            }

            return part;
        });

        // Ensure total doesn't exceed 100%
        const total = newParts.reduce((sum, p) => sum + p.percentage, 0);
        if (total > 100) {
            const excess = total - 100;
            const adjustmentParts = newParts.filter(p => p.id !== activePart);
            const adjustmentTotal = adjustmentParts.reduce((sum, p) => sum + p.percentage, 0);

            if (adjustmentTotal > 0) {
                newParts.forEach(part => {
                    if (part.id !== activePart) {
                        const proportion = part.percentage / adjustmentTotal;
                        part.percentage = Math.max(0, part.percentage - excess * proportion);
                    }
                });
            }
        }

        setParts(newParts);
    };

    const drawLines = () => {
        if (!svgRef.current) return;

        // Clear existing lines
        svgRef.current.innerHTML = '';

        // This is a simplified version - in a real implementation you'd calculate 
        // proper coordinates based on pipe and legend positions
    };

    return (
        <div className="space-y-6">
            <Title level={3} style={{ color: config.color }}>
                {config.title}
            </Title>

            {/* Total Size Slider */}
            <div>
                <Text className="text-sm font-medium">
                    Total Size: <Text strong>{totalSize} GB</Text>
                </Text>
                <Slider
                    min={config.minSize}
                    max={config.maxSize}
                    step={config.step}
                    value={totalSize}
                    onChange={setTotalSize}
                    className="mt-2"
                />
            </div>

            {/* Usage Pipe Visualization */}
            <div className="relative">
                <div
                    className="flex h-10 rounded-full overflow-hidden border border-gray-300 shadow-inner"
                    style={{ background: 'rgba(0, 0, 0, 0.1)' }}
                >
                    {parts.map((part, _index) => {
                        const isActive = activePart === part.id;
                        return (
                            <div
                                key={part.id}
                                className={`h-full transition-all duration-500 border-r border-gray-400 cursor-pointer hover:brightness-110 ${isActive ? 'ring-2 ring-blue-400 ring-inset' : ''
                                    }`}
                                style={{
                                    width: `${part.percentage}%`,
                                    backgroundColor: part.color,
                                    boxShadow: isActive ? 'inset 0 0 0 2px rgba(59, 130, 246, 0.5)' : undefined,
                                }}
                                onClick={() => setActivePart(isActive ? null : part.id)}
                                title={`${part.name}: ${(totalSize * (part.percentage / 100)).toFixed(1)} GB (${part.percentage.toFixed(0)}%)`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Legends */}
            <div className="relative">
                <svg ref={svgRef} className="absolute w-full h-full top-0 left-0 pointer-events-none" />
                <div className="grid grid-cols-3 gap-2">
                    {parts.map(part => {
                        const partSize = totalSize * (part.percentage / 100);
                        const isActive = activePart === part.id;

                        return (
                            <Card
                                key={part.id}
                                size="small"
                                className={`cursor-pointer text-center transition-all ${isActive ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setActivePart(isActive ? null : part.id)}
                                style={{
                                    borderLeft: `4px solid ${part.color}`,
                                }}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: part.color }}
                                        />
                                        <Text strong>{part.name}</Text>
                                    </div>
                                    <div>
                                        <Text className="text-xs opacity-80">
                                            {partSize.toFixed(1)} GB
                                        </Text>
                                    </div>
                                    <div>
                                        <Text className="text-xs opacity-80">
                                            {part.percentage.toFixed(0)}%
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Fine-Tuning Controls */}
            {activePartData && (
                <Card className="bg-gray-50 space-y-4">
                    <Title level={4}>Adjust {activePartData.name}</Title>

                    <div>
                        <Text className="text-sm">
                            Percent: <Text strong>{activePartData.percentage.toFixed(0)}%</Text>
                        </Text>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={activePartData.percentage}
                            onChange={(value) => handleFineTune('percent', value)}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Text className="text-sm">
                            Size: <Text strong>{(totalSize * (activePartData.percentage / 100)).toFixed(1)} GB</Text>
                        </Text>
                        <Slider
                            min={0}
                            max={totalSize}
                            step={config.step}
                            value={totalSize * (activePartData.percentage / 100)}
                            onChange={(value) => handleFineTune('size', value)}
                            className="mt-2"
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ResourceAllocator; 