import { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { DatabaseOutlined, SettingOutlined, UserOutlined, ApiOutlined, LinkOutlined, GoldOutlined, AppstoreOutlined, ToolOutlined } from '@ant-design/icons'
import { ConnectionsTab } from './tabs/ConnectionsTab.tsx'
import { GeneralTab } from './tabs/GeneralTab.tsx'
import { ProfilesTab } from './tabs/ProfilesTab.tsx'
import { ApiTab } from './tabs/ApiTab.tsx'
import { LinksTab } from './tabs/LinksTab.tsx'
import { ShortcutsTab } from './tabs/ShortcutsTab.tsx'
import { PluginsTab } from './tabs/PluginsTab.tsx'
import { AdvancedTab } from './tabs/AdvancedTab.tsx'
import { ConfigProvider } from './ConfigContext';

const items = [
    {
        key: 'profiles',
        label: 'Profiles',
        icon: <UserOutlined />,
        component: <ProfilesTab />
    },
    {
        key: 'connections',
        label: 'Connections',
        icon: <DatabaseOutlined />,
        component: <ConnectionsTab />
    },
    {
        key: 'general',
        label: 'General',
        icon: <SettingOutlined />,
        component: <GeneralTab />
    },
    {
        key: 'api',
        label: 'API',
        icon: <ApiOutlined />,
        component: <ApiTab />
    },
    {
        key: 'links',
        label: 'Links',
        icon: <LinkOutlined />,
        component: <LinksTab />
    },
    {
        key: 'shortcuts',
        label: 'Shortcuts',
        icon: <GoldOutlined />,
        component: <ShortcutsTab />
    },
    {
        key: 'plugins',
        label: 'Plugins',
        icon: <AppstoreOutlined />,
        component: <PluginsTab />
    },
    {
        key: 'advanced',
        label: 'Advanced',
        icon: <ToolOutlined />,
        component: <AdvancedTab />
    }
]

export function NavTabs() {
    const [activeKey, setActiveKey] = useState(items[0].key)

    // Initialize active tab from URL hash on component mount
    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove the # symbol

        // Valid tab keys for config
        const validConfigTabs = items.map(item => item.key);

        if (hash && validConfigTabs.includes(hash)) {
            setActiveKey(hash);
        }
    }, []);

    // Update URL hash when config tab changes
    const handleConfigTabChange = (key: string) => {
        setActiveKey(key);

        // Update URL hash without page reload
        window.location.hash = key;
        console.log(`Switched to tab: ${key}`);
    };

    return (
        <ConfigProvider>
            <div className="flex flex-col">
                <div className="border-b bg-gray-50">
                    <Tabs
                        activeKey={activeKey}
                        items={items}
                        className="px-4"
                        tabBarStyle={{ margin: 0 }}
                        onChange={handleConfigTabChange}
                        tabBarGutter={0}
                        renderTabBar={(props, DefaultTabBar) => (
                            <div className="flex justify-center">
                                <DefaultTabBar {...props}>
                                    {(node) => {
                                        const tab = items.find(item => item.key === node.key)
                                        return (
                                            <div
                                                className={`!flex flex-col items-center gap-1 min-w-[80px] py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${node.key === activeKey ? 'text-blue-500' : 'text-gray-500'
                                                    }`}
                                                onClick={() => node.key && handleConfigTabChange(node.key)}
                                            >
                                                {tab?.icon}
                                                <span className="text-xs w-20 text-center">{tab?.label}</span>
                                            </div>
                                        )
                                    }}
                                </DefaultTabBar>
                            </div>
                        )}
                    />
                </div>
                <div className="flex-1 bg-gray-100 border-t border-gray">
                    {items.find(item => item.key === activeKey)?.component}
                </div>
            </div>
        </ConfigProvider>
    )
}

