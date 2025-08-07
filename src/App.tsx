import React, { useState, useEffect } from 'react';
import { Layout, Typography, ConfigProvider, Tabs } from 'antd';
import { ExperimentOutlined, BarChartOutlined, DatabaseOutlined, EditOutlined } from '@ant-design/icons';
import ModelOptimizer from './model_optimizer/ModelOptimizer';
import CacheCalculator from './cache_calculator/CacheCalculator';
import 'uno.css';
import MitoViz from './mitoviz/MitoViz';
import SqlFormatter from './sql_formatter/SqlFormatter';

const { Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState('model');

  // Initialize active tab from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');

    // Valid tab keys
    const validTabs = ['model', 'cache', 'mitoviz', 'sql'];

    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveKey(tabFromUrl);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (key: string) => {
    setActiveKey(key);

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.pushState({}, '', url.toString());
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

          <Tabs
            centered
            activeKey={activeKey}
            onChange={handleTabChange}
            items={[
              {
                key: 'model',
                label: 'Model Optimizer',
                children: (
                  <div className="max-w-800px mx-auto">
                    <ModelOptimizer />
                  </div>
                ),
                icon: <ExperimentOutlined />,
              },
              // {
              //   key: 'config',
              //   label: 'Config Optimizer',
              //   children: <ConfigOptimizer />,
              //   icon: <SettingOutlined />,
              // },
              {
                key: 'cache',
                label: 'Cache Calculator',
                children: (
                  <div className="max-w-800px mx-auto">
                    <CacheCalculator isActive={activeKey === 'cache'} />
                  </div>
                ),
                icon: <DatabaseOutlined />,
              },
              {
                key: 'mitoviz',
                label: 'MitoViz',
                children: <MitoViz />,
                icon: <BarChartOutlined />,
              },
              {
                key: 'sql',
                label: 'SQL Formatter',
                children: (
                  <div className="max-w-800px mx-auto">
                    <SqlFormatter />
                  </div>
                ),
                icon: <EditOutlined />,
              },
            ]}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;

