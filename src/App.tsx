import React from 'react';
import { Layout, Typography, ConfigProvider, Tabs } from 'antd';
import { ExperimentOutlined, SettingOutlined } from '@ant-design/icons';
import ModelOptimizer from './components/ModelOptimizer';
import ConfigOptimizer from './components/ConfigOptimizer';
import 'uno.css';

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
                {
                  key: 'config',
                  label: 'Config Optimizer',
                  children: <ConfigOptimizer />,
                  icon: <SettingOutlined />,
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

