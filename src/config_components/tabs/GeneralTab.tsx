import { useConfig } from '../ConfigContext';

export function GeneralTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">General Settings</h2>
            <p>Configure general settings for your database here.</p>
        </div>
    )
}

