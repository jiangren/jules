/**
 * Utility to extract specific component code from a raw source string.
 * It looks for the definition of the component and captures the block.
 */
export const extractComponentCode = (source, name) => {
    if (!source || !name) return source || '';

    // Try to find the start of the component
    const startRegex = new RegExp(`(const|function|export const|export function)\\s+${name}\\s*[=|(]`);
    const match = source.match(startRegex);

    if (!match) return `// Could not find source for ${name}\n\n${source}`;

    const startIndex = match.index;
    const subSource = source.substring(startIndex);

    // Simple brace counting to find the end of the block
    let braceCount = 0;
    let started = false;
    let endIndex = -1;

    for (let i = 0; i < subSource.length; i++) {
        if (subSource[i] === '{') {
            braceCount++;
            started = true;
        } else if (subSource[i] === '}') {
            braceCount--;
        }

        if (started && braceCount === 0) {
            // Find the end of the line
            const nextNewline = subSource.indexOf('\n', i);
            endIndex = nextNewline !== -1 ? nextNewline : subSource.length;
            break;
        }
    }

    let componentCode = subSource;
    if (endIndex !== -1) {
        componentCode = subSource.substring(0, endIndex).trim();
    }

    // Also try to find shared styles and constants
    const styleRegex = /(?:export\s+)?(?:const|let|var)\s+(styles|gsapStyles|gsapStyle|stylesMatch|commonStyles)\s*=\s*[\s\S]*?(?:;|\n\n|$)/g;
    const styleMatches = Array.from(source.matchAll(styleRegex)).map(m => m[0]);
    const sharedStyles = Array.from(new Set(styleMatches)).join('\n\n');

    return `${componentCode}\n\n${sharedStyles}`.trim();
};
