"use strict";

/**
 * Markdown backtick links extension for VS Code
 * This extension adds support for links with backtick-wrapped URLs: [title](`url`)
 */

// Module system helpers
const defineProperty = Object.defineProperty;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const hasOwnProperty = Object.prototype.hasOwnProperty;

// Module factory function
const createModule = (moduleFunction, moduleExports) => () => {
    if (!moduleExports) {
        moduleFunction((moduleExports = { exports: {} }).exports, moduleExports);
    }
    return moduleExports.exports;
};

// Export helper
const exportProperties = (target, source) => {
    for (const key in source) {
        defineProperty(target, key, {
            get: source[key],
            enumerable: true
        });
    }
};

// Module interop helper
const interopModule = (target, source, excludeKey, descriptor) => {
    if (source && (typeof source === "object" || typeof source === "function")) {
        for (const key of getOwnPropertyNames(source)) {
            if (!hasOwnProperty.call(target, key) && key !== excludeKey) {
                defineProperty(target, key, {
                    get: () => source[key],
                    enumerable: !(descriptor = getOwnPropertyDescriptor(source, key)) || descriptor.enumerable
                });
            }
        }
    }
    return target;
};

// Create ES module
const createESModule = (moduleContent) => interopModule(defineProperty({}, "__esModule", { value: true }), moduleContent);

// Pattern configuration for auto-linking
const linkPatterns = [
    // RJQ tickets
    {
        regex: /\bRJQ-[0-9]{1,6}\b/gi,
        urlTemplate: "https://indeed.atlassian.net/browse/$&",
    },

    // ! single/multiple target hp/serp models
    // pre-apply/post-apply UDS: preapply_serp_row_6e1f741/postapply_hp_us_4a8ab91
    // pre-apply/post-apply MTM: preapply_hp_row_6e1f741/postapply_hp_us_4a8ab91
    // MTM: applyperseen_rj_hp_jp_52684ee / ctr_rj_sjhp_jp_a3683b0 / applyperseen_mobweb_rotw_a3683b0 / applyperseen_and_ctr_rj_hp_jp_15339e0
    // bidding: ac-per-click_rj_hp_us_5a303d3 / apply_rj_hp_us_fbed164 / ac-per-click_sjmobweb_rotw_60306c6 / apply_sjmobweb_rotw_e60cca4
    // post-apply: qualifiedapply_mob_global_6156574 / qualified_mob_global_e9b72c9
    // glassdoor model: gd_sjmobweb_rotw_3c86644
    // default MTM: multi_rj_hp_us_15339e0
    // others: dislike_rj_hp_us_b734f31
    {
        regex: /\b((gd_)?((sjmobweb)|(applyperseen)|(ctr)|(applyperseen_and_ctr)|(dislike)|(apply)|(ac-per-click)|(qualifiedapply)|(qualified)|(multi)|(preapply)|(postapply))_(((rj_sjhp)|(rj_hp)|(mobweb)|(mob)|(sjmobweb)|(hp)|(serp))_)?((us)|(rot?w)|(jp)|(global))_[a-zA-Z0-9]{7})\b/g,
        urlTemplate: "https://butterfly.sandbox.indeed.net/model/$&/PUBLISHED/config",
    },

    // ! I2A models: elephant-multi-en-all_en-4e18057
    {
        regex: /\b(elephant-multi-en-all_en-[a-f0-9]{7})\b/g,
        urlTemplate: "https://butterfly.sandbox.indeed.net/model/$&/PUBLISHED/config",
    },

];

// Backtick link plugin implementation
const backtickLinkPlugin = createModule((exports, module) => {
    "use strict";

    // Main plugin function
    module.exports = function backtickLinkPlugin(markdownIt) {
        /**
         * Parse backtick links rule
         * Matches: [title](`url`)
         * This allows URLs to contain special characters that might interfere with normal markdown parsing
         */
        function parseBacktickLink(state, silent) {
            let pos, labelStart, labelEnd, urlStart, urlEnd, token;
            const max = state.posMax;
            const start = state.pos;

            // Check opening marker [
            if (start >= max || state.src.charCodeAt(start) !== 0x5B /* [ */) {
                return false;
            }

            // Find label end using markdown-it's built-in parser
            labelStart = start + 1;
            labelEnd = state.md.helpers.parseLinkLabel(state, start, false);

            if (labelEnd < 0) {
                return false;
            }

            pos = labelEnd + 1;

            // Check for opening parenthesis and backtick: ](`
            if (pos >= max ||
                state.src.charCodeAt(pos) !== 0x28 /* ( */ ||
                pos + 1 >= max ||
                state.src.charCodeAt(pos + 1) !== 0x60 /* ` */) {
                return false;
            }

            // Find URL boundaries between backticks
            urlStart = pos + 2;
            urlEnd = -1;

            // Look for closing backtick and parenthesis: `)
            for (let i = urlStart; i < max - 1; i++) {
                if (state.src.charCodeAt(i) === 0x60 /* ` */ &&
                    state.src.charCodeAt(i + 1) === 0x29 /* ) */) {
                    urlEnd = i;
                    break;
                }
            }

            // Validate URL was found
            if (urlEnd < 0 || urlEnd <= urlStart) {
                return false;
            }

            if (!silent) {
                const label = state.src.slice(labelStart, labelEnd);
                const url = state.src.slice(urlStart, urlEnd).trim();

                // Validate URL is not empty
                if (!url) {
                    return false;
                }

                // Create link opening token
                token = state.push("link_open", "a", 1);
                token.attrs = [["href", url]];
                token.markup = "backtick_link";

                // Create text token for label
                token = state.push("text", "", 0);
                token.content = label;

                // Create link closing token
                token = state.push("link_close", "a", -1);
                token.markup = "backtick_link";
            }

            state.pos = urlEnd + 2; // Skip closing `)
            return true;
        }

        // Register backtick link parsing rule
        markdownIt.inline.ruler.before("link", "backtick_link", parseBacktickLink);
        
        // Add pattern-based auto-linking using renderer approach
        const defaultTextRule = markdownIt.renderer.rules.text;
        
        markdownIt.renderer.rules.text = function(tokens, idx, options, env, renderer) {
            let text = tokens[idx].content;
            
            // Apply all patterns
            for (const pattern of linkPatterns) {
                pattern.regex.lastIndex = 0;
                text = text.replace(pattern.regex, (match) => {
                    const url = pattern.urlTemplate.replace('$&', match);
                    return `<a href="${url}">${match}</a>`;
                });
            }
            
            return text;
        };
    };
});

// Extension exports
const extensionExports = {};
exportProperties(extensionExports, {
    activate: () => activateExtension
});
module.exports = createESModule(extensionExports);

/**
 * Activate the markdown backtick links extension
 * @returns {Object} Extension configuration
 */
function activateExtension() {
    return {
        extendMarkdownIt(markdownIt) {
            return markdownIt.use(backtickLinkPlugin());
        }
    };
}