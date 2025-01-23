import { useConfig } from '../ConfigContext';
import { Select, Switch, Button } from 'antd'
import { PlusOutlined, MinusOutlined, EditOutlined, LockOutlined, KeyOutlined, CreditCardOutlined, BellOutlined, DeleteOutlined, FolderOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons'

export function ProfilesTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Description Text */}
            <p className="text-gray-600 mb-6">
                Profiles help keep your data separate across Spaces — like history, logins, cookies, and extensions.
                You can use any Profile across one or more Spaces.
            </p>

            <div className="flex gap-8">
                {/* Left Column - Profiles */}
                <div className="w-[300px] border rounded-lg bg-white shadow-sm overflow-hidden min-h-[400px] max-h-[480px]">
                    <div className="p-3 border-b">
                        <h3 className="text-gray-600 font-normal text-sm">Your Profiles</h3>
                    </div>

                    <div className="min-h-[350px] max-h-[400px] overflow-y-auto">
                        <div className="bg-blue-50 m-3 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Default</span>
                                <span className="text-gray-500">3 Spaces</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t p-2 flex gap-1">
                        <Button
                            type="text"
                            size="small"
                            icon={<PlusOutlined />}
                            className="!flex !items-center !justify-center !w-8 !h-8 !min-w-0"
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<MinusOutlined />}
                            className="!flex !items-center !justify-center !w-8 !h-8 !min-w-0"
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            className="!flex !items-center !justify-center !w-8 !h-8 !min-w-0"
                        />
                    </div>
                </div>

                {/* Right Column - Settings */}
                <div className="flex-1">
                    <div className="space-y-6">
                        {/* Search Settings */}
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Search engine</span>
                                <Select
                                    defaultValue="google"
                                    style={{ width: 150 }}
                                    options={[{ value: 'google', label: 'Google' }]}
                                    size="small"
                                />
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Manage search</span>
                                <Button type="default" size="small">Search Settings...</Button>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Include search engine suggestions</span>
                                <Switch defaultChecked size="small" />
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1">
                                    <span>Archive tabs after</span>
                                    <InfoCircleOutlined className="text-gray-400" />
                                </div>
                                <Select
                                    defaultValue="24h"
                                    style={{ width: 150 }}
                                    options={[{ value: '24h', label: '24 hours' }]}
                                    size="small"
                                />
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>New documents</span>
                                <Select
                                    defaultValue="default"
                                    style={{ width: 150 }}
                                    options={[{ value: 'default', label: '—' }]}
                                    size="small"
                                />
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Download location</span>
                                <div className="flex items-center gap-1">
                                    <FolderOutlined className="text-blue-500" />
                                    <span>Downloads</span>
                                </div>
                            </div>
                        </div>

                        {/* Data and Settings */}
                        <div>
                            <h3 className="text-gray-700 mb-4">Your Data and Settings</h3>
                            <div className="space-y-2">
                                {/* Settings buttons */}
                                <Button
                                    type="text"
                                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50"
                                    block
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <LockOutlined className="text-white" />
                                        </div>
                                        <span>Privacy and Security</span>
                                    </div>
                                    <RightOutlined className="text-gray-400" />
                                </Button>

                                <Button type="text" className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                            <KeyOutlined className="text-white" />
                                        </div>
                                        <span>Passwords</span>
                                    </div>
                                    <RightOutlined className="text-blue-500" />
                                </Button>

                                <Button type="text" className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <CreditCardOutlined className="text-white" />
                                        </div>
                                        <span>Credit Cards</span>
                                    </div>
                                    <RightOutlined className="text-blue-500" />
                                </Button>

                                <Button type="text" className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <BellOutlined className="text-white" />
                                        </div>
                                        <span>Notifications</span>
                                    </div>
                                    <RightOutlined className="text-blue-500" />
                                </Button>

                                <Button type="text" className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                            <DeleteOutlined className="text-white" />
                                        </div>
                                        <span>Clear Browsing Data</span>
                                    </div>
                                    <RightOutlined className="text-blue-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

