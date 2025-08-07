import { useCallback, useEffect } from 'react';
import { scrollToElement, highlightElement, createHighlightStyles } from '../utils/scrollUtils';

export interface UseFileInteractionsOptions {
    filesContainerId?: string;
    highlightDuration?: number;
}

export function useFileInteractions(options: UseFileInteractionsOptions = {}) {
    const {
        filesContainerId = 'files-list-container',
        highlightDuration = 2000,
    } = options;

    // Inject styles for highlighting
    useEffect(() => {
        const styleId = 'mitoviz-highlight-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = createHighlightStyles();
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    const focusFile = useCallback(
        (fileId: string) => {
            const elementId = `file-item-${fileId}`;
            
            // First scroll to the element
            const scrollSuccess = scrollToElement(elementId, filesContainerId);
            
            if (scrollSuccess) {
                // Then highlight it after a small delay to ensure scroll completes
                setTimeout(() => {
                    highlightElement(elementId, highlightDuration);
                }, 100);
            }
            
            return scrollSuccess;
        },
        [filesContainerId, highlightDuration]
    );

    return {
        focusFile,
    };
}