import React, { useState, useRef, useEffect } from 'react';
import { Typography, message, Button } from 'antd';
import SQLInput from './SQLInput';
import ColumnInfo from './ColumnInfo';
import GlobalInfo from './GlobalInfo';
import OptimizedSQL from './OptimizedSQL';
import URLInput from './URLInput';
import { Column, parseSQL } from '../utils/parser';
import { generateOptimizedSQL, GlobalData, SQLSuggestion } from '../utils/rules';

const { Title } = Typography;

const ModelOptimizer: React.FC = () => {
    const [parsedColumns, setParsedColumns] = useState<Column[]>([]);
    const [suggestions, setSuggestions] = useState<SQLSuggestion[]>([]);
    const [showGlobalInfo, setShowGlobalInfo] = useState(false);
    const [serverUrl, setServerUrl] = useState<string>('');
    const [columnData, setColumnData] = useState<Column[]>([]);
    const [globalData, setGlobalData] = useState<GlobalData>({ hasDuplicates: false });
    const [hasOptimized, setHasOptimized] = useState<boolean>(false);
    const optimizedSqlRef = useRef<HTMLDivElement>(null);
    const columnInfoRef = useRef<HTMLDivElement>(null);
    const globalInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hasOptimized && optimizedSqlRef.current) {
            optimizedSqlRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hasOptimized]);

    useEffect(() => {
        if (parsedColumns.length > 0 && columnInfoRef.current) {
            columnInfoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [parsedColumns]);

    useEffect(() => {
        if (showGlobalInfo && globalInfoRef.current) {
            globalInfoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showGlobalInfo]);

    const handleSQLParse = async (sql: string) => {
        const parsedColumns = await parseSQL(sql, serverUrl);
        setParsedColumns(parsedColumns);
        setShowGlobalInfo(false);
        setHasOptimized(false);
        message.success('SQL parsed successfully');
    };

    const handleSubmit = (columnData: Column[], globalData: GlobalData) => {
        console.log('Using server URL:', `https://${serverUrl}`);
        console.log('Column Data:', columnData);
        console.log('Global Data:', globalData);

        const suggestions = generateOptimizedSQL(columnData, globalData);
        setSuggestions(suggestions);
        setHasOptimized(true);
        message.success('🧚‍♀️Magic Optimize✨');
    };

    return (
        <div>
            <Title level={2} className="text-center mb-6">Model Optimizer for GreptimeDB</Title>

            <URLInput onSubmit={(url) => {
                console.log('URL:', url);
                setServerUrl(url);
            }} />

            <SQLInput onParse={handleSQLParse} />
            {parsedColumns.length > 0 && (
                <div ref={columnInfoRef}>
                    <ColumnInfo
                        columns={parsedColumns}
                        onUpdate={setColumnData}
                    />
                    <div className="text-center mt-6">
                        {!showGlobalInfo ? (
                            <Button type="primary" onClick={() => setShowGlobalInfo(true)}>
                                Next: Global Information
                            </Button>
                        ) : (
                            <div ref={globalInfoRef}>
                                <GlobalInfo onUpdate={setGlobalData} />
                                <Button
                                    type="primary"
                                    onClick={() => handleSubmit(columnData, globalData)}
                                    className="mt-4"
                                >
                                    🔮 Optimize Model
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {hasOptimized && suggestions && (
                <div ref={optimizedSqlRef}>
                    <OptimizedSQL suggestions={suggestions} />
                </div>
            )}
        </div>
    );
};

export default ModelOptimizer;
