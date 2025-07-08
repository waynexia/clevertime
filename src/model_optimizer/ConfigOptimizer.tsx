import React from 'react';
import { Typography } from 'antd';
import { WindowChrome } from '../config_ui/window-chrome';
import { NavTabs } from '../config_ui/nav-tabs';
import { SettingsPanel } from '../config_ui/setting-pannel';

const { Title } = Typography;

const ConfigOptimizer: React.FC = () => {
    return (
        <div>
            <Title level={2} className="text-center mb-6">Config Optimizer for GreptimeDB</Title>
            <div className="w-[800px] h-[700px] bg-white rounded-lg shadow-xl border border-2 overflow-hidden">
                <WindowChrome />
                <NavTabs />
                <SettingsPanel />
            </div>
        </div>
    );
};

export default ConfigOptimizer;
