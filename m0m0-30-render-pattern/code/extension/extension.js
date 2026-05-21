"use strict";
const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");

/**
 * Get patterns from configuration
 * @returns {Array} Array of pattern configurations
 */
function getPatterns() {
    const config = vscode.workspace.getConfiguration("render-pattern");
    return config.get("patterns") || [];
}

/**
 * Transform matched path based on pathTransform setting
 * @param {string} matchedPath - The raw matched string
 * @param {string} transform - The transform type
 * @returns {string} Transformed path
 */
function transformPath(matchedPath, transform) {
    // Clean up trailing punctuation
    let cleanPath = matchedPath.replace(/[.,;:!?)}\]]+$/, "");
    
    if (transform === "forwardSlash") {
        // Convert D:/path to D:\path
        cleanPath = cleanPath.replace(/\//g, "\\");
    } else if (transform === "fileUrl") {
        // Convert file:///D:/path to D:\path
        cleanPath = cleanPath.replace(/^file:\/\/\//, "");
        cleanPath = decodeURIComponent(cleanPath);
        cleanPath = cleanPath.replace(/\//g, "\\");
    }
    
    return cleanPath;
}

/**
 * Extract executable path from a command string
 * @param {string} command - The command string
 * @returns {string|null} The executable path or null
 */
function extractExecutable(command) {
    const trimmed = command.trim();
    
    if (trimmed.startsWith('"')) {
        // Quoted path: extract content between first pair of quotes
        const endQuote = trimmed.indexOf('"', 1);
        if (endQuote > 1) {
            return trimmed.substring(1, endQuote);
        }
    } else {
        // Unquoted: take first space-separated token
        const spaceIndex = trimmed.indexOf(' ');
        return spaceIndex > 0 ? trimmed.substring(0, spaceIndex) : trimmed;
    }
    return null;
}

/**
 * Find the first command with an existing executable
 * @param {string[]} commands - Array of command templates
 * @returns {string|null} The first valid command or null
 */
function findValidCommand(commands) {
    for (const cmd of commands) {
        const executable = extractExecutable(cmd);
        if (executable) {
            // Handle built-in commands like 'explorer'
            if (!executable.includes('/') && !executable.includes('\\')) {
                return cmd;  // Assume built-in commands are always available
            }
            // Normalize path separators for fs check
            const normalizedPath = executable.replace(/\//g, '\\');
            if (fs.existsSync(normalizedPath)) {
                return cmd;
            }
        }
    }
    return null;
}

/**
 * Execute command to open a path
 * @param {string} matchedPath - The matched path string
 * @param {object} patternConfig - The pattern configuration object
 */
function openPath(matchedPath, patternConfig) {
    const transform = patternConfig.pathTransform || "none";
    const targetPath = transformPath(matchedPath, transform);
    
    const commands = patternConfig.commands || [];
    const commandTemplate = findValidCommand(commands);
    
    if (!commandTemplate) {
        vscode.window.showErrorMessage(`No valid command found for pattern: ${patternConfig.name}`);
        return;
    }
    
    // Replace ${path} placeholder with actual path
    const command = commandTemplate.replace(/\$\{path\}/g, targetPath);

    exec(command, (error) => {
        if (error) {
            vscode.window.showErrorMessage(`Failed to open: ${error.message}`);
        }
    });
}

/**
 * DocumentLinkProvider for custom patterns
 */
class PatternLinkProvider {
    provideDocumentLinks(document, token) {
        const links = [];
        const text = document.getText();
        const patterns = getPatterns();

        for (const pattern of patterns) {
            if (!pattern.regex) continue;
            
            let match;
            // Create regex with global flag
            const regex = new RegExp(pattern.regex, "g");

            while ((match = regex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                // Create a command URI that will trigger our handler
                const uri = vscode.Uri.parse(
                    `command:render-pattern.openPath?${encodeURIComponent(JSON.stringify({ 
                        path: match[0], 
                        patternName: pattern.name 
                    }))}`
                );

                const link = new vscode.DocumentLink(range, uri);
                // Build tooltip with optional ${path} replacement
                const tooltipTemplate = pattern.tooltip || `Open: ${match[0]}`;
                link.tooltip = tooltipTemplate.replace(/\$\{path\}/g, match[0]);
                links.push(link);
            }
        }

        return links;
    }
}

let linkProviderDisposable = null;

/**
 * Register or re-register the document link provider
 * @param {vscode.ExtensionContext} context 
 */
function registerLinkProvider(context) {
    // Dispose existing provider if any
    if (linkProviderDisposable) {
        linkProviderDisposable.dispose();
    }
    
    // Register new provider
    linkProviderDisposable = vscode.languages.registerDocumentLinkProvider(
        { scheme: "file" },
        new PatternLinkProvider()
    );
    
    context.subscriptions.push(linkProviderDisposable);
}

function activate(context) {
    // Initial registration
    registerLinkProvider(context);

    // Re-register when configuration changes
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("render-pattern.patterns")) {
            registerLinkProvider(context);
            vscode.window.showInformationMessage("Render Pattern: Configuration updated");
        }
    });

    // Register the command to open paths
    const openPathCommand = vscode.commands.registerCommand(
        "render-pattern.openPath",
        (args) => {
            if (args && args.path && args.patternName) {
                const patterns = getPatterns();
                const patternConfig = patterns.find(p => p.name === args.patternName);
                
                if (patternConfig) {
                    openPath(args.path, patternConfig);
                } else {
                    vscode.window.showErrorMessage(`Pattern not found: ${args.patternName}`);
                }
            }
        }
    );

    context.subscriptions.push(configChangeDisposable, openPathCommand);

    console.log("render-pattern extension is now active");
}

function deactivate() { }

module.exports = { activate, deactivate };
