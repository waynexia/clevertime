import React, { useState } from 'react';
import { Layout, Typography, message, ConfigProvider, Button } from 'antd';
import SQLInput from './components/SQLInput.tsx';
import ColumnInfo from './components/ColumnInfo.tsx';
import GlobalInfo from './components/GlobalInfo.tsx';
import OptimizedSQL from './components/OptimizedSQL.tsx';
import URLInput from './components/URLInput.tsx';
import { Column, parseSQL } from './utils/parser';
import 'uno.css';

const { Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [parsedColumns, setParsedColumns] = useState<Column[]>([]);
  const [optimizedSQL, setOptimizedSQL] = useState<string>('');
  const [showGlobalInfo, setShowGlobalInfo] = useState(false);
  const [serverUrl, setServerUrl] = useState<string>('');

  const handleSQLParse = async (sql: string) => {
    const parsedColumns = await parseSQL(sql, serverUrl);
    setParsedColumns(parsedColumns);
    setShowGlobalInfo(false);
    setOptimizedSQL('');
    message.success('SQL parsed successfully');
  };

  const handleSubmit = (columnData: any, globalData: any) => {
    // Now we have access to serverUrl for API calls
    console.log('Using server URL:', `https://${serverUrl}`);
    // This is a placeholder for the actual SQL optimization logic
    const mockOptimizedSQL = `
SELECT 
  id,
  name,
  email,
  created_at
FROM 
  users
WHERE 
  created_at > '2023-01-01'
ORDER BY 
  created_at DESC
LIMIT 
  100;
    `.trim();
    setOptimizedSQL(mockOptimizedSQL);
    message.success('SQL optimized successfully');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout className="min-h-screen">
        <Content className="p-6">
          <Title level={1} className="text-center mb-4">Clevertime</Title>
          <Title level={2} className="text-center mb-6">Model Optimizer for GreptimeDB</Title>

          <URLInput onSubmit={(url) => {
            console.log('URL:', url);
            setServerUrl(url);
          }} />

          <SQLInput onParse={handleSQLParse} />
          {parsedColumns.length > 0 && (
            <>
              <ColumnInfo columns={parsedColumns} />
              <div className="text-center mt-6">
                {!showGlobalInfo ? (
                  <Button type="primary" onClick={() => setShowGlobalInfo(true)}>
                    Next: Global Information
                  </Button>
                ) : (
                  <>
                    <GlobalInfo />
                    <Button type="primary" onClick={() => handleSubmit([], {})} className="mt-4">
                      Optimize SQL
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
          {optimizedSQL && <OptimizedSQL sql={optimizedSQL} />}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;

