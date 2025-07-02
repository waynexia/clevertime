import React from 'react';
import { Layout, Typography, ConfigProvider, Tabs } from 'antd';
import { ExperimentOutlined, SettingOutlined, BarChartOutlined, DatabaseOutlined } from '@ant-design/icons';
import ModelOptimizer from './components/ModelOptimizer';
import ConfigOptimizer from './components/ConfigOptimizer';
import CacheCalculator from './cache_calculator/CacheCalculator';
import 'uno.css';
import MitoViz from './mitoviz_components/MitoViz';

const { Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
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

          <div className="max-w-800px mx-auto">
            <Tabs
              centered
              defaultActiveKey="model"
              items={[
                {
                  key: 'model',
                  label: 'Model Optimizer',
                  children: <ModelOptimizer />,
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
                  children: <CacheCalculator />,
                  icon: <DatabaseOutlined />,
                },
                {
                  key: 'mitoviz',
                  label: 'MitoViz',
                  children: <MitoViz />,
                  icon: <BarChartOutlined />,
                },
              ]}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;

