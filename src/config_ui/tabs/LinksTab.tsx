import { useConfig } from '../ConfigContext';

export function LinksTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Links</h2>
            <p>Manage your database links here.</p>
        </div>
    );
}

