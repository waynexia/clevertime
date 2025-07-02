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
    onConfigChange?: (id: string, totalSize: number, parts: ResourcePart[]) => void;
}

const ResourceAllocator: React.FC<ResourceAllocatorProps> = ({ config, onConfigChange }) => {
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
    const animationRef = useRef<number>();

    const activePartData = parts.find(p => p.id === activePart);

    useEffect(() => {
        drawLines();
        startWaveAnimation();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [parts, totalSize]);

    // Notify parent of config changes
    useEffect(() => {
        if (onConfigChange) {
            onConfigChange(config.id, totalSize, parts);
        }
    }, [totalSize, parts, onConfigChange, config.id]);

    const startWaveAnimation = () => {
        const animate = () => {
            updateWaves();
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const updateWaves = () => {
        if (!svgRef.current) return;

        const time = Date.now() * 0.001; // Convert to seconds
        const waves = svgRef.current.querySelectorAll('.wave-path');

        waves.forEach((wave, index) => {
            const path = wave as SVGPathElement;
            const segmentIndex = Math.floor(index / 2); // Two waves per segment
            const isUpperWave = index % 2 === 0;

            // Different wave parameters for different layers but same frequency for continuity
            const amplitude = isUpperWave ? 6 : 4;
            const speed = isUpperWave ? 1.2 : 1.8;
            const phase = isUpperWave ? 0 : Math.PI * 0.4; // Phase difference between layers

            const d = generateWavePath(
                segmentIndex,
                1, // Use same frequency for all segments for continuity
                amplitude,
                time * speed + phase
            );
            path.setAttribute('d', d);
        });
    };

    const generateWavePath = (segmentIndex: number, _frequency: number, amplitude: number, timeOffset: number) => {
        const totalWidth = 400;
        let currentX = 0;

        // Calculate segment boundaries
        for (let i = 0; i < segmentIndex; i++) {
            currentX += (parts[i].percentage / 100) * totalWidth;
        }

        const segmentWidth = (parts[segmentIndex].percentage / 100) * totalWidth;
        const endX = currentX + segmentWidth;

        if (segmentWidth <= 0) return '';

        let path = `M ${currentX} 20`; // Start at middle height

        // Generate continuous wave points across the entire pipe width
        const steps = Math.max(10, Math.floor(segmentWidth / 2));
        for (let i = 0; i <= steps; i++) {
            const x = currentX + (i / steps) * segmentWidth;
            // Use global x position for continuous waves across all segments
            const globalNormalizedX = x / totalWidth;
            const y = 20 + Math.sin(globalNormalizedX * Math.PI * 8 + timeOffset) * amplitude;
            path += ` L ${x} ${y}`;
        }

        // Close the path to create a filled area
        path += ` L ${endX} 40 L ${currentX} 40 Z`;

        return path;
    };

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

        // Clear existing content
        svgRef.current.innerHTML = '';

        // Create base pipe structure with waves
        const totalWidth = 400;
        let currentX = 0;

        parts.forEach((part, _index) => {
            const segmentWidth = (part.percentage / 100) * totalWidth;

            if (segmentWidth > 0) {
                // Create inner wave layer (lighter)
                const innerWave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                innerWave.classList.add('wave-path');
                innerWave.setAttribute('fill', part.color);
                innerWave.setAttribute('opacity', '0.6');
                svgRef.current!.appendChild(innerWave);

                // Create upper wave layer (deeper color)
                const upperWave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                upperWave.classList.add('wave-path');
                const darkerColor = adjustColorBrightness(part.color, -40);
                upperWave.setAttribute('fill', darkerColor);
                upperWave.setAttribute('opacity', '0.8');
                svgRef.current!.appendChild(upperWave);

                currentX += segmentWidth;
            }
        });

        // Add universal shade overlay
        const shadeOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shadeOverlay.setAttribute('x', '0');
        shadeOverlay.setAttribute('y', '0');
        shadeOverlay.setAttribute('width', totalWidth.toString());
        shadeOverlay.setAttribute('height', '40');
        shadeOverlay.setAttribute('fill', 'url(#pipeGradient)');
        svgRef.current!.appendChild(shadeOverlay);

        // Create gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'pipeGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', 'rgba(0,0,0,0.2)');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', 'rgba(255,255,255,0.1)');

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', 'rgba(0,0,0,0.1)');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svgRef.current!.insertBefore(defs, svgRef.current!.firstChild);
    };

    const adjustColorBrightness = (color: string, amount: number): string => {
        // Simple color brightness adjustment
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
                <svg
                    ref={svgRef}
                    className="w-full h-10 rounded-full overflow-hidden border border-gray-300 shadow-inner"
                    style={{ background: 'rgba(0, 0, 0, 0.1)' }}
                    viewBox="0 0 400 40"
                    preserveAspectRatio="none"
                />
                {/* Clickable overlay for segments */}
                <div className="absolute inset-0 flex">
                    {parts.map((part, _index) => {
                        const isActive = activePart === part.id;
                        return (
                            <div
                                key={part.id}
                                className={`h-full transition-all duration-500 cursor-pointer hover:bg-white hover:bg-opacity-10 ${isActive ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
                                style={{
                                    width: `${part.percentage}%`,
                                    backgroundColor: 'transparent',
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