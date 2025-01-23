import { Switch, Input, Button } from 'antd'
import { FolderOutlined } from '@ant-design/icons'

export function SettingsPanel() {
    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Connection Settings */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Database Connection</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Host</label>
                            <Input placeholder="localhost" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Port</label>
                            <Input placeholder="5432" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Database</label>
                            <Input placeholder="mydatabase" />
                        </div>
                    </div>
                </section>

                {/* Authentication */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Authentication</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Username</label>
                            <Input placeholder="username" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <Input.Password placeholder="password" />
                        </div>
                    </div>
                </section>

                {/* Additional Settings */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Additional Settings</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>SSL Connection</span>
                            <Switch />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Connection Timeout (ms)</label>
                            <Input placeholder="5000" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Save Location</label>
                            <Input
                                placeholder="Select folder"
                                suffix={<Button type="text" icon={<FolderOutlined />} />}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

