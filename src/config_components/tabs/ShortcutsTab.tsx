import { useConfig } from '../ConfigContext';

export function ShortcutsTab() {
    const { config, setConfig } = useConfig();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Shortcuts</h2>
            <p>Configure keyboard shortcuts for your database operations here.</p>
        </div>
    );
}

