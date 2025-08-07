export interface ScrollOptions {
    behavior?: 'smooth' | 'auto';
    block?: 'start' | 'center' | 'end' | 'nearest';
}

export function scrollToElement(
    elementId: string,
    containerId?: string,
    options: ScrollOptions = { behavior: 'smooth', block: 'center' }
): boolean {
    const element = document.getElementById(elementId);
    if (!element) return false;

    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const containerHeight = container.clientHeight;
            const elementHeight = element.clientHeight;
            
            // Calculate scroll position to center the element
            const scrollTop = element.offsetTop - (containerHeight / 2) + (elementHeight / 2);
            
            container.scrollTo({
                top: scrollTop,
                behavior: options.behavior || 'smooth'
            });
        }
    } else {
        element.scrollIntoView(options);
    }

    return true;
}

export function highlightElement(elementId: string, duration: number = 2000): boolean {
    const element = document.getElementById(elementId);
    if (!element) return false;

    // Remove any existing highlight
    document.querySelectorAll('.mitoviz-focused').forEach(el => {
        el.classList.remove('mitoviz-focused');
    });

    // Add highlight class
    element.classList.add('mitoviz-focused');

    // Remove highlight after duration
    setTimeout(() => {
        element.classList.remove('mitoviz-focused');
    }, duration);

    return true;
}

export function createHighlightStyles(): string {
    return `
        .mitoviz-focused {
            background-color: #444 !important;
            border-left: 3px solid #1890ff !important;
            animation: mitoviz-highlight 1s ease-out;
        }
        
        @keyframes mitoviz-highlight {
            0% {
                background-color: #1890ff !important;
            }
            100% {
                background-color: #444 !important;
            }
        }
    `;
}