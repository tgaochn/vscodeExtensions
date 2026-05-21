(() => {
    var t = {
        17: (t, e, s) => {
            try {
                var i = s(23);
                if (typeof i.inherits != "function") {
                    throw "";
                }
                t.exports = i.inherits;
            } catch (e) {
                t.exports = s(698);
            }
        },
        23: t => {
            "use strict";

            t.exports = require("util");
        },
        24: t => {
            "use strict";

            t.exports = require("node:fs");
        },
        27: (t, e, s) => {
            t.exports = p;
            p.Minimatch = d;
            var i = function () {
                try {
                    return s(928);
                } catch (t) { }
            }() || {
                sep: "/"
            };
            p.sep = i.sep;
            var r = p.GLOBSTAR = d.GLOBSTAR = {};
            var n = s(547);
            var o = {
                "!": {
                    open: "(?:(?!(?:",
                    close: "))[^/]*?)"
                },
                "?": {
                    open: "(?:",
                    close: ")?"
                },
                "+": {
                    open: "(?:",
                    close: ")+"
                },
                "*": {
                    open: "(?:",
                    close: ")*"
                },
                "@": {
                    open: "(?:",
                    close: ")"
                }
            };
            var a = "[^/]";
            var h = a + "*?";
            var c = "().*{}+?[]^$\\!".split("").reduce(function (t, e) {
                t[e] = true;
                return t;
            }, {});
            var l = /\/+/;
            function u(t, e) {
                e = e || {};
                var s = {};
                Object.keys(t).forEach(function (e) {
                    s[e] = t[e];
                });
                Object.keys(e).forEach(function (t) {
                    s[t] = e[t];
                });
                return s;
            }
            function p(t, e, s) {
                g(e);
                if (!s) {
                    s = {};
                }
                return !(!s.nocomment && e.charAt(0) === "#") && new d(e, s).match(t);
            }
            function d(t, e) {
                if (!(this instanceof d)) {
                    return new d(t, e);
                }
                g(t);
                if (!e) {
                    e = {};
                }
                t = t.trim();
                if (!(e.allowWindowsEscape || i.sep === "/")) {
                    t = t.split(i.sep).join("/");
                }
                this.options = e;
                this.set = [];
                this.pattern = t;
                this.regexp = null;
                this.negate = false;
                this.comment = false;
                this.empty = false;
                this.partial = !!e.partial;
                this.make();
            }
            function f(t, e) {
                if (!e) {
                    e = this instanceof d ? this.options : {};
                }
                t = t === undefined ? this.pattern : t;
                g(t);
                if (e.nobrace || !/\{(?:(?!\{).)*\}/.test(t)) {
                    return [t];
                } else {
                    return n(t);
                }
            }
            p.filter = function (t, e) {
                e = e || {};
                return function (s, i, r) {
                    return p(s, t, e);
                };
            };
            p.defaults = function (t) {
                if (!t || typeof t != "object" || !Object.keys(t).length) {
                    return p;
                }
                var e = p;
                function s(s, i, r) {
                    return e(s, i, u(t, r));
                }
                (s.Minimatch = function (s, i) {
                    return new e.Minimatch(s, u(t, i));
                }).defaults = function (s) {
                    return e.defaults(u(t, s)).Minimatch;
                };
                s.filter = function (s, i) {
                    return e.filter(s, u(t, i));
                };
                s.defaults = function (s) {
                    return e.defaults(u(t, s));
                };
                s.makeRe = function (s, i) {
                    return e.makeRe(s, u(t, i));
                };
                s.braceExpand = function (s, i) {
                    return e.braceExpand(s, u(t, i));
                };
                s.match = function (s, i, r) {
                    return e.match(s, i, u(t, r));
                };
                return s;
            };
            d.defaults = function (t) {
                return p.defaults(t).Minimatch;
            };
            d.prototype.debug = function () { };
            d.prototype.make = function () {
                var t = this.pattern;
                var e = this.options;
                if (e.nocomment || t.charAt(0) !== "#") {
                    if (t) {
                        this.parseNegate();
                        var s = this.globSet = this.braceExpand();
                        if (e.debug) {
                            this.debug = function () {
                                console.error.apply(console, arguments);
                            };
                        }
                        this.debug(this.pattern, s);
                        s = this.globParts = s.map(function (t) {
                            return t.split(l);
                        });
                        this.debug(this.pattern, s);
                        s = s.map(function (t, e, s) {
                            return t.map(this.parse, this);
                        }, this);
                        this.debug(this.pattern, s);
                        s = s.filter(function (t) {
                            return t.indexOf(false) === -1;
                        });
                        this.debug(this.pattern, s);
                        this.set = s;
                    } else {
                        this.empty = true;
                    }
                } else {
                    this.comment = true;
                }
            };
            d.prototype.parseNegate = function () {
                var t = this.pattern;
                var e = false;
                var s = 0;
                if (!this.options.nonegate) {
                    for (var i = 0, r = t.length; i < r && t.charAt(i) === "!"; i++) {
                        e = !e;
                        s++;
                    }
                    if (s) {
                        this.pattern = t.substr(s);
                    }
                    this.negate = e;
                }
            };
            p.braceExpand = function (t, e) {
                return f(t, e);
            };
            d.prototype.braceExpand = f;
            function g(t) {
                if (typeof t != "string") {
                    throw new TypeError("invalid pattern");
                }
                if (t.length > 65536) {
                    throw new TypeError("pattern is too long");
                }
            }
            d.prototype.parse = function (t, e) {
                g(t);
                var s = this.options;
                if (t === "**") {
                    if (!s.noglobstar) {
                        return r;
                    }
                    t = "*";
                }
                if (t === "") {
                    return "";
                }
                var i;
                var n = "";
                var l = !!s.nocase;
                var u = false;
                var p = [];
                var d = [];
                var f = false;
                var y = -1;
                var w = -1;
                var b = t.charAt(0) === "." ? "" : s.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
                var v = this;
                function S() {
                    if (i) {
                        switch (i) {
                            case "*":
                                n += h;
                                l = true;
                                break;
                            case "?":
                                n += a;
                                l = true;
                                break;
                            default:
                                n += "\\" + i;
                        }
                        v.debug("clearStateChar %j %j", i, n);
                        i = false;
                    }
                }
                for (var k, E = 0, x = t.length; E < x && (k = t.charAt(E)); E++) {
                    this.debug("%s\t%s %s %j", t, E, n, k);
                    if (u && c[k]) {
                        n += "\\" + k;
                        u = false;
                    } else {
                        switch (k) {
                            case "/":
                                return false;
                            case "\\":
                                S();
                                u = true;
                                continue;
                            case "?":
                            case "*":
                            case "+":
                            case "@":
                            case "!":
                                this.debug("%s\t%s %s %j <-- stateChar", t, E, n, k);
                                if (f) {
                                    this.debug("  in class");
                                    if (k === "!" && E === w + 1) {
                                        k = "^";
                                    }
                                    n += k;
                                    continue;
                                }
                                v.debug("call clearStateChar %j", i);
                                S();
                                i = k;
                                if (s.noext) {
                                    S();
                                }
                                continue;
                            case "(":
                                if (f) {
                                    n += "(";
                                    continue;
                                }
                                if (!i) {
                                    n += "\\(";
                                    continue;
                                }
                                p.push({
                                    type: i,
                                    start: E - 1,
                                    reStart: n.length,
                                    open: o[i].open,
                                    close: o[i].close
                                });
                                n += i === "!" ? "(?:(?!(?:" : "(?:";
                                this.debug("plType %j %j", i, n);
                                i = false;
                                continue;
                            case ")":
                                if (f || !p.length) {
                                    n += "\\)";
                                    continue;
                                }
                                S();
                                l = true;
                                var O = p.pop();
                                n += O.close;
                                if (O.type === "!") {
                                    d.push(O);
                                }
                                O.reEnd = n.length;
                                continue;
                            case "|":
                                if (f || !p.length || u) {
                                    n += "\\|";
                                    u = false;
                                    continue;
                                }
                                S();
                                n += "|";
                                continue;
                            case "[":
                                S();
                                if (f) {
                                    n += "\\" + k;
                                    continue;
                                }
                                f = true;
                                w = E;
                                y = n.length;
                                n += k;
                                continue;
                            case "]":
                                if (E === w + 1 || !f) {
                                    n += "\\" + k;
                                    u = false;
                                    continue;
                                }
                                var _ = t.substring(w + 1, E);
                                try {
                                    RegExp("[" + _ + "]");
                                } catch (t) {
                                    var T = this.parse(_, m);
                                    n = n.substr(0, y) + "\\[" + T[0] + "\\]";
                                    l = l || T[1];
                                    f = false;
                                    continue;
                                }
                                l = true;
                                f = false;
                                n += k;
                                continue;
                            default:
                                S();
                                if (u) {
                                    u = false;
                                } else if (!(!c[k] || k === "^" && f)) {
                                    n += "\\";
                                }
                                n += k;
                        }
                    }
                }
                if (f) {
                    _ = t.substr(w + 1);
                    T = this.parse(_, m);
                    n = n.substr(0, y) + "\\[" + T[0];
                    l = l || T[1];
                }
                O = p.pop();
                for (; O; O = p.pop()) {
                    var A = n.slice(O.reStart + O.open.length);
                    this.debug("setting tail", n, O);
                    A = A.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (t, e, s) {
                        if (!s) {
                            s = "\\";
                        }
                        return e + e + s + "|";
                    });
                    this.debug("tail=%j\n   %s", A, A, O, n);
                    var M = O.type === "*" ? h : O.type === "?" ? a : "\\" + O.type;
                    l = true;
                    n = n.slice(0, O.reStart) + M + "\\(" + A;
                }
                S();
                if (u) {
                    n += "\\\\";
                }
                var L = false;
                switch (n.charAt(0)) {
                    case "[":
                    case ".":
                    case "(":
                        L = true;
                }
                for (var C = d.length - 1; C > -1; C--) {
                    var P = d[C];
                    var N = n.slice(0, P.reStart);
                    var j = n.slice(P.reStart, P.reEnd - 8);
                    var R = n.slice(P.reEnd - 8, P.reEnd);
                    var F = n.slice(P.reEnd);
                    R += F;
                    var D = N.split("(").length - 1;
                    var I = F;
                    for (E = 0; E < D; E++) {
                        I = I.replace(/\)[+*?]?/, "");
                    }
                    var z = "";
                    if ((F = I) === "" && e !== m) {
                        z = "$";
                    }
                    n = N + j + F + z + R;
                }
                if (n !== "" && l) {
                    n = "(?=.)" + n;
                }
                if (L) {
                    n = b + n;
                }
                if (e === m) {
                    return [n, l];
                }
                if (!l) {
                    return t.replace(/\\(.)/g, "$1");
                }
                var B = s.nocase ? "i" : "";
                try {
                    var W = new RegExp("^" + n + "$", B);
                } catch (t) {
                    return new RegExp("$.");
                }
                W._glob = t;
                W._src = n;
                return W;
            };
            var m = {};
            p.makeRe = function (t, e) {
                return new d(t, e || {}).makeRe();
            };
            d.prototype.makeRe = function () {
                if (this.regexp || this.regexp === false) {
                    return this.regexp;
                }
                var t = this.set;
                if (!t.length) {
                    this.regexp = false;
                    return this.regexp;
                }
                var e = this.options;
                var s = e.noglobstar ? h : e.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?";
                var i = e.nocase ? "i" : "";
                var n = t.map(function (t) {
                    return t.map(function (t) {
                        if (t === r) {
                            return s;
                        } else if (typeof t == "string") {
                            return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                        } else {
                            return t._src;
                        }
                    }).join("\\/");
                }).join("|");
                n = "^(?:" + n + ")$";
                if (this.negate) {
                    n = "^(?!" + n + ").*$";
                }
                try {
                    this.regexp = new RegExp(n, i);
                } catch (t) {
                    this.regexp = false;
                }
                return this.regexp;
            };
            p.match = function (t, e, s) {
                var i = new d(e, s = s || {});
                t = t.filter(function (t) {
                    return i.match(t);
                });
                if (i.options.nonull && !t.length) {
                    t.push(e);
                }
                return t;
            };
            d.prototype.match = function (t, e) {
                if (e === undefined) {
                    e = this.partial;
                }
                this.debug("match", t, this.pattern);
                if (this.comment) {
                    return false;
                }
                if (this.empty) {
                    return t === "";
                }
                if (t === "/" && e) {
                    return true;
                }
                var s = this.options;
                if (i.sep !== "/") {
                    t = t.split(i.sep).join("/");
                }
                t = t.split(l);
                this.debug(this.pattern, "split", t);
                var r;
                var n;
                var o = this.set;
                this.debug(this.pattern, "set", o);
                n = t.length - 1;
                for (; n >= 0 && !(r = t[n]); n--);
                for (n = 0; n < o.length; n++) {
                    var a = o[n];
                    var h = t;
                    if (s.matchBase && a.length === 1) {
                        h = [r];
                    }
                    if (this.matchOne(h, a, e)) {
                        return !!s.flipNegate || !this.negate;
                    }
                }
                return !s.flipNegate && this.negate;
            };
            d.prototype.matchOne = function (t, e, s) {
                var i = this.options;
                this.debug("matchOne", {
                    this: this,
                    file: t,
                    pattern: e
                });
                this.debug("matchOne", t.length, e.length);
                for (var n = 0, o = 0, a = t.length, h = e.length; n < a && o < h; n++, o++) {
                    this.debug("matchOne loop");
                    var c;
                    var l = e[o];
                    var u = t[n];
                    this.debug(e, l, u);
                    if (l === false) {
                        return false;
                    }
                    if (l === r) {
                        this.debug("GLOBSTAR", [e, l, u]);
                        var p = n;
                        var d = o + 1;
                        if (d === h) {
                            for (this.debug("** at the end"); n < a; n++) {
                                if (t[n] === "." || t[n] === ".." || !i.dot && t[n].charAt(0) === ".") {
                                    return false;
                                }
                            }
                            return true;
                        }
                        for (; p < a;) {
                            var f = t[p];
                            this.debug("\nglobstar while", t, p, e, d, f);
                            if (this.matchOne(t.slice(p), e.slice(d), s)) {
                                this.debug("globstar found match!", p, a, f);
                                return true;
                            }
                            if (f === "." || f === ".." || !i.dot && f.charAt(0) === ".") {
                                this.debug("dot detected!", t, p, e, d);
                                break;
                            }
                            this.debug("globstar swallow a segment, and continue");
                            p++;
                        }
                        return !(!s || (this.debug("\n>>> no match, partial?", t, p, e, d), p !== a));
                    }
                    if (typeof l == "string") {
                        c = u === l;
                        this.debug("string match", l, u, c);
                    } else {
                        c = u.match(l);
                        this.debug("pattern match", l, u, c);
                    }
                    if (!c) {
                        return false;
                    }
                }
                if (n === a && o === h) {
                    return true;
                }
                if (n === a) {
                    return s;
                }
                if (o === h) {
                    return n === a - 1 && t[n] === "";
                }
                throw new Error("wtf?");
            };
        },
        46: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.hasMagic = undefined;
            const i = s(144);
            e.hasMagic = (t, e = {}) => {
                if (!Array.isArray(t)) {
                    t = [t];
                }
                for (const s of t) {
                    if (new i.Minimatch(s, e).hasMagic()) {
                        return true;
                    }
                }
                return false;
            };
        },
        75: t => {
            "use strict";

            t.exports = require("node:stream");
        },
        96: (t, e) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.LRUCache = undefined;
            const s = typeof performance == "object" && performance && typeof performance.now == "function" ? performance : Date;
            const i = new Set();
            const r = typeof process == "object" && process ? process : {};
            const n = (t, e, s, i) => {
                if (typeof r.emitWarning == "function") {
                    r.emitWarning(t, e, s, i);
                } else {
                    console.error(`[${s}] ${e}: ${t}`);
                }
            };
            let o = globalThis.AbortController;
            let a = globalThis.AbortSignal;
            if (o === undefined) {
                a = class {
                    onabort;
                    _onabort = [];
                    reason;
                    aborted = false;
                    addEventListener(t, e) {
                        this._onabort.push(e);
                    }
                };
                o = class {
                    constructor() {
                        e();
                    }
                    signal = new a();
                    abort(t) {
                        if (!this.signal.aborted) {
                            this.signal.reason = t;
                            this.signal.aborted = true;
                            for (const e of this.signal._onabort) {
                                e(t);
                            }
                            this.signal.onabort?.(t);
                        }
                    }
                };
                let t = r.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
                const e = () => {
                    if (t) {
                        t = false;
                        n("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", e);
                    }
                };
            }
            Symbol("type");
            const h = t => t && t === Math.floor(t) && t > 0 && isFinite(t);
            const c = t => h(t) ? t <= Math.pow(2, 8) ? Uint8Array : t <= Math.pow(2, 16) ? Uint16Array : t <= Math.pow(2, 32) ? Uint32Array : t <= Number.MAX_SAFE_INTEGER ? l : null : null;
            class l extends Array {
                constructor(t) {
                    super(t);
                    this.fill(0);
                }
            }
            class u {
                heap;
                length;
                static #t = false;
                static create(t) {
                    const e = c(t);
                    if (!e) {
                        return [];
                    }
                    u.#t = true;
                    const s = new u(t, e);
                    u.#t = false;
                    return s;
                }
                constructor(t, e) {
                    if (!u.#t) {
                        throw new TypeError("instantiate Stack using Stack.create(n)");
                    }
                    this.heap = new e(t);
                    this.length = 0;
                }
                push(t) {
                    this.heap[this.length++] = t;
                }
                pop() {
                    return this.heap[--this.length];
                }
            }
            class p {
                #e;
                #s;
                #i;
                #r;
                #n;
                #o;
                ttl;
                ttlResolution;
                ttlAutopurge;
                updateAgeOnGet;
                updateAgeOnHas;
                allowStale;
                noDisposeOnSet;
                noUpdateTTL;
                maxEntrySize;
                sizeCalculation;
                noDeleteOnFetchRejection;
                noDeleteOnStaleGet;
                allowStaleOnFetchAbort;
                allowStaleOnFetchRejection;
                ignoreFetchAbort;
                #a;
                #h;
                #c;
                #l;
                #u;
                #p;
                #d;
                #f;
                #g;
                #m;
                #y;
                #w;
                #b;
                #v;
                #S;
                #k;
                #E;
                static unsafeExposeInternals(t) {
                    return {
                        starts: t.#b,
                        ttls: t.#v,
                        sizes: t.#w,
                        keyMap: t.#c,
                        keyList: t.#l,
                        valList: t.#u,
                        next: t.#p,
                        prev: t.#d,
                        get head() {
                            return t.#f;
                        },
                        get tail() {
                            return t.#g;
                        },
                        free: t.#m,
                        isBackgroundFetch: e => t.#x(e),
                        backgroundFetch: (e, s, i, r) => t.#O(e, s, i, r),
                        moveToTail: e => t.#_(e),
                        indexes: e => t.#T(e),
                        rindexes: e => t.#A(e),
                        isStale: e => t.#M(e)
                    };
                }
                get max() {
                    return this.#e;
                }
                get maxSize() {
                    return this.#s;
                }
                get calculatedSize() {
                    return this.#h;
                }
                get size() {
                    return this.#a;
                }
                get fetchMethod() {
                    return this.#n;
                }
                get memoMethod() {
                    return this.#o;
                }
                get dispose() {
                    return this.#i;
                }
                get disposeAfter() {
                    return this.#r;
                }
                constructor(t) {
                    const {
                        max: e = 0,
                        ttl: s,
                        ttlResolution: r = 1,
                        ttlAutopurge: o,
                        updateAgeOnGet: a,
                        updateAgeOnHas: l,
                        allowStale: d,
                        dispose: f,
                        disposeAfter: g,
                        noDisposeOnSet: m,
                        noUpdateTTL: y,
                        maxSize: w = 0,
                        maxEntrySize: b = 0,
                        sizeCalculation: v,
                        fetchMethod: S,
                        memoMethod: k,
                        noDeleteOnFetchRejection: E,
                        noDeleteOnStaleGet: x,
                        allowStaleOnFetchRejection: O,
                        allowStaleOnFetchAbort: _,
                        ignoreFetchAbort: T
                    } = t;
                    if (e !== 0 && !h(e)) {
                        throw new TypeError("max option must be a nonnegative integer");
                    }
                    const A = e ? c(e) : Array;
                    if (!A) {
                        throw new Error("invalid max value: " + e);
                    }
                    this.#e = e;
                    this.#s = w;
                    this.maxEntrySize = b || this.#s;
                    this.sizeCalculation = v;
                    if (this.sizeCalculation) {
                        if (!this.#s && !this.maxEntrySize) {
                            throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
                        }
                        if (typeof this.sizeCalculation != "function") {
                            throw new TypeError("sizeCalculation set to non-function");
                        }
                    }
                    if (k !== undefined && typeof k != "function") {
                        throw new TypeError("memoMethod must be a function if defined");
                    }
                    this.#o = k;
                    if (S !== undefined && typeof S != "function") {
                        throw new TypeError("fetchMethod must be a function if specified");
                    }
                    this.#n = S;
                    this.#k = !!S;
                    this.#c = new Map();
                    this.#l = new Array(e).fill(undefined);
                    this.#u = new Array(e).fill(undefined);
                    this.#p = new A(e);
                    this.#d = new A(e);
                    this.#f = 0;
                    this.#g = 0;
                    this.#m = u.create(e);
                    this.#a = 0;
                    this.#h = 0;
                    if (typeof f == "function") {
                        this.#i = f;
                    }
                    if (typeof g == "function") {
                        this.#r = g;
                        this.#y = [];
                    } else {
                        this.#r = undefined;
                        this.#y = undefined;
                    }
                    this.#S = !!this.#i;
                    this.#E = !!this.#r;
                    this.noDisposeOnSet = !!m;
                    this.noUpdateTTL = !!y;
                    this.noDeleteOnFetchRejection = !!E;
                    this.allowStaleOnFetchRejection = !!O;
                    this.allowStaleOnFetchAbort = !!_;
                    this.ignoreFetchAbort = !!T;
                    if (this.maxEntrySize !== 0) {
                        if (this.#s !== 0 && !h(this.#s)) {
                            throw new TypeError("maxSize must be a positive integer if specified");
                        }
                        if (!h(this.maxEntrySize)) {
                            throw new TypeError("maxEntrySize must be a positive integer if specified");
                        }
                        this.#L();
                    }
                    this.allowStale = !!d;
                    this.noDeleteOnStaleGet = !!x;
                    this.updateAgeOnGet = !!a;
                    this.updateAgeOnHas = !!l;
                    this.ttlResolution = h(r) || r === 0 ? r : 1;
                    this.ttlAutopurge = !!o;
                    this.ttl = s || 0;
                    if (this.ttl) {
                        if (!h(this.ttl)) {
                            throw new TypeError("ttl must be a positive integer if specified");
                        }
                        this.#C();
                    }
                    if (this.#e === 0 && this.ttl === 0 && this.#s === 0) {
                        throw new TypeError("At least one of max, maxSize, or ttl is required");
                    }
                    if (!this.ttlAutopurge && !this.#e && !this.#s) {
                        const t = "LRU_CACHE_UNBOUNDED";
                        if ((t => !i.has(t))(t)) {
                            i.add(t);
                            n("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", t, p);
                        }
                    }
                }
                getRemainingTTL(t) {
                    if (this.#c.has(t)) {
                        return Infinity;
                    } else {
                        return 0;
                    }
                }
                #C() {
                    const t = new l(this.#e);
                    const e = new l(this.#e);
                    this.#v = t;
                    this.#b = e;
                    this.#P = (i, r, n = s.now()) => {
                        e[i] = r !== 0 ? n : 0;
                        t[i] = r;
                        if (r !== 0 && this.ttlAutopurge) {
                            const t = // TOLOOK
                                setTimeout(() => {
                                    if (this.#M(i)) {
                                        this.#N(this.#l[i], "expire");
                                    }
                                }, r + 1);
                            if (t.unref) {
                                t.unref();
                            }
                        }
                    };
                    this.#j = i => {
                        e[i] = t[i] !== 0 ? s.now() : 0;
                    };
                    this.#R = (s, n) => {
                        if (t[n]) {
                            const o = t[n];
                            const a = e[n];
                            if (!o || !a) {
                                return;
                            }
                            s.ttl = o;
                            s.start = a;
                            s.now = i || r();
                            const h = s.now - a;
                            s.remainingTTL = o - h;
                        }
                    };
                    let i = 0;
                    const r = () => {
                        const t = s.now();
                        if (this.ttlResolution > 0) {
                            i = t;
                            const e = // TOLOOK
                                setTimeout(() => i = 0, this.ttlResolution);
                            if (e.unref) {
                                e.unref();
                            }
                        }
                        return t;
                    };
                    this.getRemainingTTL = s => {
                        const n = this.#c.get(s);
                        if (n === undefined) {
                            return 0;
                        }
                        const o = t[n];
                        const a = e[n];
                        if (o && a) {
                            return o - ((i || r()) - a);
                        } else {
                            return Infinity;
                        }
                    };
                    this.#M = s => {
                        const n = e[s];
                        const o = t[s];
                        return !!o && !!n && (i || r()) - n > o;
                    };
                }
                #j = () => { };
                #R = () => { };
                #P = () => { };
                #M = () => false;
                #L() {
                    const t = new l(this.#e);
                    this.#h = 0;
                    this.#w = t;
                    this.#F = e => {
                        this.#h -= t[e];
                        t[e] = 0;
                    };
                    this.#D = (t, e, s, i) => {
                        if (this.#x(e)) {
                            return 0;
                        }
                        if (!h(s)) {
                            if (!i) {
                                throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
                            }
                            if (typeof i != "function") {
                                throw new TypeError("sizeCalculation must be a function");
                            }
                            s = i(e, t);
                            if (!h(s)) {
                                throw new TypeError("sizeCalculation return invalid (expect positive integer)");
                            }
                        }
                        return s;
                    };
                    this.#I = (e, s, i) => {
                        t[e] = s;
                        if (this.#s) {
                            const s = this.#s - t[e];
                            for (; this.#h > s;) {
                                this.#z(true);
                            }
                        }
                        this.#h += t[e];
                        if (i) {
                            i.entrySize = s;
                            i.totalCalculatedSize = this.#h;
                        }
                    };
                }
                #F = t => { };
                #I = (t, e, s) => { };
                #D = (t, e, s, i) => {
                    if (s || i) {
                        throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
                    }
                    return 0;
                };
                *#T({
                    allowStale: t = this.allowStale
                } = {}) {
                    if (this.#a) {
                        for (let e = this.#g; this.#B(e) && (!t && this.#M(e) || (yield e), e !== this.#f);) {
                            e = this.#d[e];
                        }
                    }
                }
                *#A({
                    allowStale: t = this.allowStale
                } = {}) {
                    if (this.#a) {
                        for (let e = this.#f; this.#B(e) && (!t && this.#M(e) || (yield e), e !== this.#g);) {
                            e = this.#p[e];
                        }
                    }
                }
                #B(t) {
                    return t !== undefined && this.#c.get(this.#l[t]) === t;
                }
                *entries() {
                    for (const t of this.#T()) {
                        if (!(this.#u[t] === undefined || this.#l[t] === undefined || this.#x(this.#u[t]))) {
                            yield [this.#l[t], this.#u[t]];
                        }
                    }
                }
                *rentries() {
                    for (const t of this.#A()) {
                        if (!(this.#u[t] === undefined || this.#l[t] === undefined || this.#x(this.#u[t]))) {
                            yield [this.#l[t], this.#u[t]];
                        }
                    }
                }
                *keys() {
                    for (const t of this.#T()) {
                        const e = this.#l[t];
                        if (!(e === undefined || this.#x(this.#u[t]))) {
                            yield e;
                        }
                    }
                }
                *rkeys() {
                    for (const t of this.#A()) {
                        const e = this.#l[t];
                        if (!(e === undefined || this.#x(this.#u[t]))) {
                            yield e;
                        }
                    }
                }
                *values() {
                    for (const t of this.#T()) {
                        if (!(this.#u[t] === undefined || this.#x(this.#u[t]))) {
                            yield this.#u[t];
                        }
                    }
                }
                *rvalues() {
                    for (const t of this.#A()) {
                        if (!(this.#u[t] === undefined || this.#x(this.#u[t]))) {
                            yield this.#u[t];
                        }
                    }
                }
                [Symbol.iterator]() {
                    return this.entries();
                }
                [Symbol.toStringTag] = "LRUCache";
                find(t, e = {}) {
                    for (const s of this.#T()) {
                        const i = this.#u[s];
                        const r = this.#x(i) ? i.__staleWhileFetching : i;
                        if (r !== undefined && t(r, this.#l[s], this)) {
                            return this.get(this.#l[s], e);
                        }
                    }
                }
                forEach(t, e = this) {
                    for (const s of this.#T()) {
                        const i = this.#u[s];
                        const r = this.#x(i) ? i.__staleWhileFetching : i;
                        if (r !== undefined) {
                            t.call(e, r, this.#l[s], this);
                        }
                    }
                }
                rforEach(t, e = this) {
                    for (const s of this.#A()) {
                        const i = this.#u[s];
                        const r = this.#x(i) ? i.__staleWhileFetching : i;
                        if (r !== undefined) {
                            t.call(e, r, this.#l[s], this);
                        }
                    }
                }
                purgeStale() {
                    let t = false;
                    for (const e of this.#A({
                        allowStale: true
                    })) {
                        if (this.#M(e)) {
                            this.#N(this.#l[e], "expire");
                            t = true;
                        }
                    }
                    return t;
                }
                info(t) {
                    const e = this.#c.get(t);
                    if (e === undefined) {
                        return;
                    }
                    const i = this.#u[e];
                    const r = this.#x(i) ? i.__staleWhileFetching : i;
                    if (r === undefined) {
                        return;
                    }
                    const n = {
                        value: r
                    };
                    if (this.#v && this.#b) {
                        const t = this.#v[e];
                        const i = this.#b[e];
                        if (t && i) {
                            const e = t - (s.now() - i);
                            n.ttl = e;
                            n.start = Date.now();
                        }
                    }
                    if (this.#w) {
                        n.size = this.#w[e];
                    }
                    return n;
                }
                dump() {
                    const t = [];
                    for (const e of this.#T({
                        allowStale: true
                    })) {
                        const i = this.#l[e];
                        const r = this.#u[e];
                        const n = this.#x(r) ? r.__staleWhileFetching : r;
                        if (n === undefined || i === undefined) {
                            continue;
                        }
                        const o = {
                            value: n
                        };
                        if (this.#v && this.#b) {
                            o.ttl = this.#v[e];
                            const t = s.now() - this.#b[e];
                            o.start = Math.floor(Date.now() - t);
                        }
                        if (this.#w) {
                            o.size = this.#w[e];
                        }
                        t.unshift([i, o]);
                    }
                    return t;
                }
                load(t) {
                    this.clear();
                    for (const [e, i] of t) {
                        if (i.start) {
                            const t = Date.now() - i.start;
                            i.start = s.now() - t;
                        }
                        this.set(e, i.value, i);
                    }
                }
                set(t, e, s = {}) {
                    if (e === undefined) {
                        this.delete(t);
                        return this;
                    }
                    const {
                        ttl: i = this.ttl,
                        start: r,
                        noDisposeOnSet: n = this.noDisposeOnSet,
                        sizeCalculation: o = this.sizeCalculation,
                        status: a
                    } = s;
                    let {
                        noUpdateTTL: h = this.noUpdateTTL
                    } = s;
                    const c = this.#D(t, e, s.size || 0, o);
                    if (this.maxEntrySize && c > this.maxEntrySize) {
                        if (a) {
                            a.set = "miss";
                            a.maxEntrySizeExceeded = true;
                        }
                        this.#N(t, "set");
                        return this;
                    }
                    let l = this.#a === 0 ? undefined : this.#c.get(t);
                    if (l === undefined) {
                        l = this.#a === 0 ? this.#g : this.#m.length !== 0 ? this.#m.pop() : this.#a === this.#e ? this.#z(false) : this.#a;
                        this.#l[l] = t;
                        this.#u[l] = e;
                        this.#c.set(t, l);
                        this.#p[this.#g] = l;
                        this.#d[l] = this.#g;
                        this.#g = l;
                        this.#a++;
                        this.#I(l, c, a);
                        if (a) {
                            a.set = "add";
                        }
                        h = false;
                    } else {
                        this.#_(l);
                        const s = this.#u[l];
                        if (e !== s) {
                            if (this.#k && this.#x(s)) {
                                s.__abortController.abort(new Error("replaced"));
                                const {
                                    __staleWhileFetching: e
                                } = s;
                                if (!(e === undefined || n)) {
                                    if (this.#S) {
                                        this.#i?.(e, t, "set");
                                    }
                                    if (this.#E) {
                                        this.#y?.push([e, t, "set"]);
                                    }
                                }
                            } else if (!n) {
                                if (this.#S) {
                                    this.#i?.(s, t, "set");
                                }
                                if (this.#E) {
                                    this.#y?.push([s, t, "set"]);
                                }
                            }
                            this.#F(l);
                            this.#I(l, c, a);
                            this.#u[l] = e;
                            if (a) {
                                a.set = "replace";
                                const t = s && this.#x(s) ? s.__staleWhileFetching : s;
                                if (t !== undefined) {
                                    a.oldValue = t;
                                }
                            }
                        } else if (a) {
                            a.set = "update";
                        }
                    }
                    if (!(i === 0 || this.#v)) {
                        this.#C();
                    }
                    if (this.#v) {
                        if (!h) {
                            this.#P(l, i, r);
                        }
                        if (a) {
                            this.#R(a, l);
                        }
                    }
                    if (!n && this.#E && this.#y) {
                        const t = this.#y;
                        let e;
                        for (; e = t?.shift();) {
                            this.#r?.(...e);
                        }
                    }
                    return this;
                }
                pop() {
                    try {
                        for (; this.#a;) {
                            const t = this.#u[this.#f];
                            this.#z(true);
                            if (this.#x(t)) {
                                if (t.__staleWhileFetching) {
                                    return t.__staleWhileFetching;
                                }
                            } else if (t !== undefined) {
                                return t;
                            }
                        }
                    } finally {
                        if (this.#E && this.#y) {
                            const t = this.#y;
                            let e;
                            for (; e = t?.shift();) {
                                this.#r?.(...e);
                            }
                        }
                    }
                }
                #z(t) {
                    const e = this.#f;
                    const s = this.#l[e];
                    const i = this.#u[e];
                    if (this.#k && this.#x(i)) {
                        i.__abortController.abort(new Error("evicted"));
                    } else if (this.#S || this.#E) {
                        if (this.#S) {
                            this.#i?.(i, s, "evict");
                        }
                        if (this.#E) {
                            this.#y?.push([i, s, "evict"]);
                        }
                    }
                    this.#F(e);
                    if (t) {
                        this.#l[e] = undefined;
                        this.#u[e] = undefined;
                        this.#m.push(e);
                    }
                    if (this.#a === 1) {
                        this.#f = this.#g = 0;
                        this.#m.length = 0;
                    } else {
                        this.#f = this.#p[e];
                    }
                    this.#c.delete(s);
                    this.#a--;
                    return e;
                }
                has(t, e = {}) {
                    const {
                        updateAgeOnHas: s = this.updateAgeOnHas,
                        status: i
                    } = e;
                    const r = this.#c.get(t);
                    if (r !== undefined) {
                        const t = this.#u[r];
                        if (this.#x(t) && t.__staleWhileFetching === undefined) {
                            return false;
                        }
                        if (!this.#M(r)) {
                            if (s) {
                                this.#j(r);
                            }
                            if (i) {
                                i.has = "hit";
                                this.#R(i, r);
                            }
                            return true;
                        }
                        if (i) {
                            i.has = "stale";
                            this.#R(i, r);
                        }
                    } else if (i) {
                        i.has = "miss";
                    }
                    return false;
                }
                peek(t, e = {}) {
                    const {
                        allowStale: s = this.allowStale
                    } = e;
                    const i = this.#c.get(t);
                    if (i === undefined || !s && this.#M(i)) {
                        return;
                    }
                    const r = this.#u[i];
                    if (this.#x(r)) {
                        return r.__staleWhileFetching;
                    } else {
                        return r;
                    }
                }
                #O(t, e, s, i) {
                    const r = e === undefined ? undefined : this.#u[e];
                    if (this.#x(r)) {
                        return r;
                    }
                    const n = new o();
                    const {
                        signal: a
                    } = s;
                    a?.addEventListener("abort", () => n.abort(a.reason), {
                        signal: n.signal
                    });
                    const h = {
                        signal: n.signal,
                        options: s,
                        context: i
                    };
                    const c = (i, r = false) => {
                        const {
                            aborted: o
                        } = n.signal;
                        const a = s.ignoreFetchAbort && i !== undefined;
                        if (s.status) {
                            if (o && !r) {
                                s.status.fetchAborted = true;
                                s.status.fetchError = n.signal.reason;
                                if (a) {
                                    s.status.fetchAbortIgnored = true;
                                }
                            } else {
                                s.status.fetchResolved = true;
                            }
                        }
                        if (o && !a && !r) {
                            return l(n.signal.reason);
                        }
                        const c = u;
                        if (this.#u[e] === u) {
                            if (i === undefined) {
                                if (c.__staleWhileFetching) {
                                    this.#u[e] = c.__staleWhileFetching;
                                } else {
                                    this.#N(t, "fetch");
                                }
                            } else {
                                if (s.status) {
                                    s.status.fetchUpdated = true;
                                }
                                this.set(t, i, h.options);
                            }
                        }
                        return i;
                    };
                    const l = i => {
                        const {
                            aborted: r
                        } = n.signal;
                        const o = r && s.allowStaleOnFetchAbort;
                        const a = o || s.allowStaleOnFetchRejection;
                        const h = a || s.noDeleteOnFetchRejection;
                        const c = u;
                        if (this.#u[e] === u) {
                            if (h && c.__staleWhileFetching !== undefined) {
                                if (!o) {
                                    this.#u[e] = c.__staleWhileFetching;
                                }
                            } else {
                                this.#N(t, "fetch");
                            }
                        }
                        if (a) {
                            if (s.status && c.__staleWhileFetching !== undefined) {
                                s.status.returnedStale = true;
                            }
                            return c.__staleWhileFetching;
                        }
                        if (c.__returned === c) {
                            throw i;
                        }
                    };
                    if (s.status) {
                        s.status.fetchDispatched = true;
                    }
                    const u = new Promise((e, i) => {
                        const o = this.#n?.(t, r, h);
                        if (o && o instanceof Promise) {
                            o.then(t => e(t === undefined ? undefined : t), i);
                        }
                        n.signal.addEventListener("abort", () => {
                            if (!(s.ignoreFetchAbort && !s.allowStaleOnFetchAbort)) {
                                e(undefined);
                                if (s.allowStaleOnFetchAbort) {
                                    e = t => c(t, true);
                                }
                            }
                        });
                    }).then(c, t => {
                        if (s.status) {
                            s.status.fetchRejected = true;
                            s.status.fetchError = t;
                        }
                        return l(t);
                    });
                    const p = Object.assign(u, {
                        __abortController: n,
                        __staleWhileFetching: r,
                        __returned: undefined
                    });
                    if (e === undefined) {
                        this.set(t, p, {
                            ...h.options,
                            status: undefined
                        });
                        e = this.#c.get(t);
                    } else {
                        this.#u[e] = p;
                    }
                    return p;
                }
                #x(t) {
                    if (!this.#k) {
                        return false;
                    }
                    const e = t;
                    return !!e && e instanceof Promise && e.hasOwnProperty("__staleWhileFetching") && e.__abortController instanceof o;
                }
                async fetch(t, e = {}) {
                    const {
                        allowStale: s = this.allowStale,
                        updateAgeOnGet: i = this.updateAgeOnGet,
                        noDeleteOnStaleGet: r = this.noDeleteOnStaleGet,
                        ttl: n = this.ttl,
                        noDisposeOnSet: o = this.noDisposeOnSet,
                        size: a = 0,
                        sizeCalculation: h = this.sizeCalculation,
                        noUpdateTTL: c = this.noUpdateTTL,
                        noDeleteOnFetchRejection: l = this.noDeleteOnFetchRejection,
                        allowStaleOnFetchRejection: u = this.allowStaleOnFetchRejection,
                        ignoreFetchAbort: p = this.ignoreFetchAbort,
                        allowStaleOnFetchAbort: d = this.allowStaleOnFetchAbort,
                        context: f,
                        forceRefresh: g = false,
                        status: m,
                        signal: y
                    } = e;
                    if (!this.#k) {
                        if (m) {
                            m.fetch = "get";
                        }
                        return this.get(t, {
                            allowStale: s,
                            updateAgeOnGet: i,
                            noDeleteOnStaleGet: r,
                            status: m
                        });
                    }
                    const w = {
                        allowStale: s,
                        updateAgeOnGet: i,
                        noDeleteOnStaleGet: r,
                        ttl: n,
                        noDisposeOnSet: o,
                        size: a,
                        sizeCalculation: h,
                        noUpdateTTL: c,
                        noDeleteOnFetchRejection: l,
                        allowStaleOnFetchRejection: u,
                        allowStaleOnFetchAbort: d,
                        ignoreFetchAbort: p,
                        status: m,
                        signal: y
                    };
                    let b = this.#c.get(t);
                    if (b === undefined) {
                        if (m) {
                            m.fetch = "miss";
                        }
                        const e = this.#O(t, b, w, f);
                        return e.__returned = e;
                    }
                    {
                        const e = this.#u[b];
                        if (this.#x(e)) {
                            const t = s && e.__staleWhileFetching !== undefined;
                            if (m) {
                                m.fetch = "inflight";
                                if (t) {
                                    m.returnedStale = true;
                                }
                            }
                            if (t) {
                                return e.__staleWhileFetching;
                            } else {
                                return e.__returned = e;
                            }
                        }
                        const r = this.#M(b);
                        if (!g && !r) {
                            if (m) {
                                m.fetch = "hit";
                            }
                            this.#_(b);
                            if (i) {
                                this.#j(b);
                            }
                            if (m) {
                                this.#R(m, b);
                            }
                            return e;
                        }
                        const n = this.#O(t, b, w, f);
                        const o = n.__staleWhileFetching !== undefined && s;
                        if (m) {
                            m.fetch = r ? "stale" : "refresh";
                            if (o && r) {
                                m.returnedStale = true;
                            }
                        }
                        if (o) {
                            return n.__staleWhileFetching;
                        } else {
                            return n.__returned = n;
                        }
                    }
                }
                async forceFetch(t, e = {}) {
                    const s = await this.fetch(t, e);
                    if (s === undefined) {
                        throw new Error("fetch() returned undefined");
                    }
                    return s;
                }
                memo(t, e = {}) {
                    const s = this.#o;
                    if (!s) {
                        throw new Error("no memoMethod provided to constructor");
                    }
                    const {
                        context: i,
                        forceRefresh: r,
                        ...n
                    } = e;
                    const o = this.get(t, n);
                    if (!r && o !== undefined) {
                        return o;
                    }
                    const a = s(t, o, {
                        options: n,
                        context: i
                    });
                    this.set(t, a, n);
                    return a;
                }
                get(t, e = {}) {
                    const {
                        allowStale: s = this.allowStale,
                        updateAgeOnGet: i = this.updateAgeOnGet,
                        noDeleteOnStaleGet: r = this.noDeleteOnStaleGet,
                        status: n
                    } = e;
                    const o = this.#c.get(t);
                    if (o !== undefined) {
                        const e = this.#u[o];
                        const a = this.#x(e);
                        if (n) {
                            this.#R(n, o);
                        }
                        if (this.#M(o)) {
                            if (n) {
                                n.get = "stale";
                            }
                            if (a) {
                                if (n && s && e.__staleWhileFetching !== undefined) {
                                    n.returnedStale = true;
                                }
                                if (s) {
                                    return e.__staleWhileFetching;
                                } else {
                                    return undefined;
                                }
                            } else {
                                if (!r) {
                                    this.#N(t, "expire");
                                }
                                if (n && s) {
                                    n.returnedStale = true;
                                }
                                if (s) {
                                    return e;
                                } else {
                                    return undefined;
                                }
                            }
                        } else {
                            if (n) {
                                n.get = "hit";
                            }
                            if (a) {
                                return e.__staleWhileFetching;
                            } else {
                                this.#_(o);
                                if (i) {
                                    this.#j(o);
                                }
                                return e;
                            }
                        }
                    }
                    if (n) {
                        n.get = "miss";
                    }
                }
                #W(t, e) {
                    this.#d[e] = t;
                    this.#p[t] = e;
                }
                #_(t) {
                    if (t !== this.#g) {
                        if (t === this.#f) {
                            this.#f = this.#p[t];
                        } else {
                            this.#W(this.#d[t], this.#p[t]);
                        }
                        this.#W(this.#g, t);
                        this.#g = t;
                    }
                }
                delete(t) {
                    return this.#N(t, "delete");
                }
                #N(t, e) {
                    let s = false;
                    if (this.#a !== 0) {
                        const i = this.#c.get(t);
                        if (i !== undefined) {
                            s = true;
                            if (this.#a === 1) {
                                this.#G(e);
                            } else {
                                this.#F(i);
                                const s = this.#u[i];
                                if (this.#x(s)) {
                                    s.__abortController.abort(new Error("deleted"));
                                } else if (this.#S || this.#E) {
                                    if (this.#S) {
                                        this.#i?.(s, t, e);
                                    }
                                    if (this.#E) {
                                        this.#y?.push([s, t, e]);
                                    }
                                }
                                this.#c.delete(t);
                                this.#l[i] = undefined;
                                this.#u[i] = undefined;
                                if (i === this.#g) {
                                    this.#g = this.#d[i];
                                } else if (i === this.#f) {
                                    this.#f = this.#p[i];
                                } else {
                                    const t = this.#d[i];
                                    this.#p[t] = this.#p[i];
                                    const e = this.#p[i];
                                    this.#d[e] = this.#d[i];
                                }
                                this.#a--;
                                this.#m.push(i);
                            }
                        }
                    }
                    if (this.#E && this.#y?.length) {
                        const t = this.#y;
                        let e;
                        for (; e = t?.shift();) {
                            this.#r?.(...e);
                        }
                    }
                    return s;
                }
                clear() {
                    return this.#G("delete");
                }
                #G(t) {
                    for (const e of this.#A({
                        allowStale: true
                    })) {
                        const s = this.#u[e];
                        if (this.#x(s)) {
                            s.__abortController.abort(new Error("deleted"));
                        } else {
                            const i = this.#l[e];
                            if (this.#S) {
                                this.#i?.(s, i, t);
                            }
                            if (this.#E) {
                                this.#y?.push([s, i, t]);
                            }
                        }
                    }
                    this.#c.clear();
                    this.#u.fill(undefined);
                    this.#l.fill(undefined);
                    if (this.#v && this.#b) {
                        this.#v.fill(0);
                        this.#b.fill(0);
                    }
                    if (this.#w) {
                        this.#w.fill(0);
                    }
                    this.#f = 0;
                    this.#g = 0;
                    this.#m.length = 0;
                    this.#h = 0;
                    this.#a = 0;
                    if (this.#E && this.#y) {
                        const t = this.#y;
                        let e;
                        for (; e = t?.shift();) {
                            this.#r?.(...e);
                        }
                    }
                }
            }
            e.LRUCache = p;
        },
        136: t => {
            "use strict";

            t.exports = require("node:url");
        },
        144: function (t, e, s) {
            "use strict";

            var i = this && this.__importDefault || function (t) {
                if (t && t.__esModule) {
                    return t;
                } else {
                    return {
                        default: t
                    };
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.unescape = e.escape = e.AST = e.Minimatch = e.match = e.makeRe = e.braceExpand = e.defaults = e.filter = e.GLOBSTAR = e.sep = e.minimatch = undefined;
            const r = i(s(422));
            const n = s(496);
            const o = s(280);
            const a = s(577);
            const h = s(718);
            e.minimatch = (t, e, s = {}) => {
                (0, n.assertValidPattern)(e);
                return !(!s.nocomment && e.charAt(0) === "#") && new P(e, s).match(t);
            };
            const c = /^\*+([^+@!?\*\[\(]*)$/;
            const l = t => e => !e.startsWith(".") && e.endsWith(t);
            const u = t => e => e.endsWith(t);
            const p = t => {
                t = t.toLowerCase();
                return e => !e.startsWith(".") && e.toLowerCase().endsWith(t);
            };
            const d = t => {
                t = t.toLowerCase();
                return e => e.toLowerCase().endsWith(t);
            };
            const f = /^\*+\.\*+$/;
            const g = t => !t.startsWith(".") && t.includes(".");
            const m = t => t !== "." && t !== ".." && t.includes(".");
            const y = /^\.\*+$/;
            const w = t => t !== "." && t !== ".." && t.startsWith(".");
            const b = /^\*+$/;
            const v = t => t.length !== 0 && !t.startsWith(".");
            const S = t => t.length !== 0 && t !== "." && t !== "..";
            const k = /^\?+([^+@!?\*\[\(]*)?$/;
            const E = ([t, e = ""]) => {
                const s = T([t]);
                if (e) {
                    e = e.toLowerCase();
                    return t => s(t) && t.toLowerCase().endsWith(e);
                } else {
                    return s;
                }
            };
            const x = ([t, e = ""]) => {
                const s = A([t]);
                if (e) {
                    e = e.toLowerCase();
                    return t => s(t) && t.toLowerCase().endsWith(e);
                } else {
                    return s;
                }
            };
            const O = ([t, e = ""]) => {
                const s = A([t]);
                if (e) {
                    return t => s(t) && t.endsWith(e);
                } else {
                    return s;
                }
            };
            const _ = ([t, e = ""]) => {
                const s = T([t]);
                if (e) {
                    return t => s(t) && t.endsWith(e);
                } else {
                    return s;
                }
            };
            const T = ([t]) => {
                const e = t.length;
                return t => t.length === e && !t.startsWith(".");
            };
            const A = ([t]) => {
                const e = t.length;
                return t => t.length === e && t !== "." && t !== "..";
            };
            const M = typeof process == "object" && process ? typeof process.env == "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
            e.sep = M === "win32" ? "\\" : "/";
            e.minimatch.sep = e.sep;
            e.GLOBSTAR = Symbol("globstar **");
            e.minimatch.GLOBSTAR = e.GLOBSTAR;
            e.filter = (t, s = {}) => i => (0, e.minimatch)(i, t, s);
            e.minimatch.filter = e.filter;
            const L = (t, e = {}) => Object.assign({}, t, e);
            e.defaults = t => {
                if (!t || typeof t != "object" || !Object.keys(t).length) {
                    return e.minimatch;
                }
                const s = e.minimatch;
                return Object.assign((e, i, r = {}) => s(e, i, L(t, r)), {
                    Minimatch: class extends s.Minimatch {
                        constructor(e, s = {}) {
                            super(e, L(t, s));
                        }
                        static defaults(e) {
                            return s.defaults(L(t, e)).Minimatch;
                        }
                    },
                    AST: class extends s.AST {
                        constructor(e, s, i = {}) {
                            super(e, s, L(t, i));
                        }
                        static fromGlob(e, i = {}) {
                            return s.AST.fromGlob(e, L(t, i));
                        }
                    },
                    unescape: (e, i = {}) => s.unescape(e, L(t, i)),
                    escape: (e, i = {}) => s.escape(e, L(t, i)),
                    filter: (e, i = {}) => s.filter(e, L(t, i)),
                    defaults: e => s.defaults(L(t, e)),
                    makeRe: (e, i = {}) => s.makeRe(e, L(t, i)),
                    braceExpand: (e, i = {}) => s.braceExpand(e, L(t, i)),
                    match: (e, i, r = {}) => s.match(e, i, L(t, r)),
                    sep: s.sep,
                    GLOBSTAR: e.GLOBSTAR
                });
            };
            e.minimatch.defaults = e.defaults;
            e.braceExpand = (t, e = {}) => {
                (0, n.assertValidPattern)(t);
                if (e.nobrace || !/\{(?:(?!\{).)*\}/.test(t)) {
                    return [t];
                } else {
                    return (0, r.default)(t);
                }
            };
            e.minimatch.braceExpand = e.braceExpand;
            e.makeRe = (t, e = {}) => new P(t, e).makeRe();
            e.minimatch.makeRe = e.makeRe;
            e.match = (t, e, s = {}) => {
                const i = new P(e, s);
                t = t.filter(t => i.match(t));
                if (i.options.nonull && !t.length) {
                    t.push(e);
                }
                return t;
            };
            e.minimatch.match = e.match;
            const C = /[?*]|[+@!]\(.*?\)|\[|\]/;
            class P {
                options;
                set;
                pattern;
                windowsPathsNoEscape;
                nonegate;
                negate;
                comment;
                empty;
                preserveMultipleSlashes;
                partial;
                globSet;
                globParts;
                nocase;
                isWindows;
                platform;
                windowsNoMagicRoot;
                regexp;
                constructor(t, e = {}) {
                    (0, n.assertValidPattern)(t);
                    e = e || {};
                    this.options = e;
                    this.pattern = t;
                    this.platform = e.platform || M;
                    this.isWindows = this.platform === "win32";
                    this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === false;
                    if (this.windowsPathsNoEscape) {
                        this.pattern = this.pattern.replace(/\\/g, "/");
                    }
                    this.preserveMultipleSlashes = !!e.preserveMultipleSlashes;
                    this.regexp = null;
                    this.negate = false;
                    this.nonegate = !!e.nonegate;
                    this.comment = false;
                    this.empty = false;
                    this.partial = !!e.partial;
                    this.nocase = !!this.options.nocase;
                    this.windowsNoMagicRoot = e.windowsNoMagicRoot !== undefined ? e.windowsNoMagicRoot : !(!this.isWindows || !this.nocase);
                    this.globSet = [];
                    this.globParts = [];
                    this.set = [];
                    this.make();
                }
                hasMagic() {
                    if (this.options.magicalBraces && this.set.length > 1) {
                        return true;
                    }
                    for (const t of this.set) {
                        for (const e of t) {
                            if (typeof e != "string") {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                debug(...t) { }
                make() {
                    const t = this.pattern;
                    const e = this.options;
                    if (!e.nocomment && t.charAt(0) === "#") {
                        this.comment = true;
                        return;
                    }
                    if (!t) {
                        this.empty = true;
                        return;
                    }
                    this.parseNegate();
                    this.globSet = [...new Set(this.braceExpand())];
                    if (e.debug) {
                        this.debug = (...t) => console.error(...t);
                    }
                    this.debug(this.pattern, this.globSet);
                    const s = this.globSet.map(t => this.slashSplit(t));
                    this.globParts = this.preprocess(s);
                    this.debug(this.pattern, this.globParts);
                    let i = this.globParts.map((t, e, s) => {
                        if (this.isWindows && this.windowsNoMagicRoot) {
                            const e = !(t[0] !== "" || t[1] !== "" || t[2] !== "?" && C.test(t[2]) || C.test(t[3]));
                            const s = /^[a-z]:/i.test(t[0]);
                            if (e) {
                                return [...t.slice(0, 4), ...t.slice(4).map(t => this.parse(t))];
                            }
                            if (s) {
                                return [t[0], ...t.slice(1).map(t => this.parse(t))];
                            }
                        }
                        return t.map(t => this.parse(t));
                    });
                    this.debug(this.pattern, i);
                    this.set = i.filter(t => t.indexOf(false) === -1);
                    if (this.isWindows) {
                        for (let t = 0; t < this.set.length; t++) {
                            const e = this.set[t];
                            if (e[0] === "" && e[1] === "" && this.globParts[t][2] === "?" && typeof e[3] == "string" && /^[a-z]:$/i.test(e[3])) {
                                e[2] = "?";
                            }
                        }
                    }
                    this.debug(this.pattern, this.set);
                }
                preprocess(t) {
                    if (this.options.noglobstar) {
                        for (let e = 0; e < t.length; e++) {
                            for (let s = 0; s < t[e].length; s++) {
                                if (t[e][s] === "**") {
                                    t[e][s] = "*";
                                }
                            }
                        }
                    }
                    const {
                        optimizationLevel: e = 1
                    } = this.options;
                    if (e >= 2) {
                        t = this.firstPhasePreProcess(t);
                        t = this.secondPhasePreProcess(t);
                    } else {
                        t = e >= 1 ? this.levelOneOptimize(t) : this.adjascentGlobstarOptimize(t);
                    }
                    return t;
                }
                adjascentGlobstarOptimize(t) {
                    return t.map(t => {
                        let e = -1;
                        for (; (e = t.indexOf("**", e + 1)) !== -1;) {
                            let s = e;
                            for (; t[s + 1] === "**";) {
                                s++;
                            }
                            if (s !== e) {
                                t.splice(e, s - e);
                            }
                        }
                        return t;
                    });
                }
                levelOneOptimize(t) {
                    return t.map(t => (t = t.reduce((t, e) => {
                        const s = t[t.length - 1];
                        if (e === "**" && s === "**") {
                            return t;
                        } else if (e === ".." && s && s !== ".." && s !== "." && s !== "**") {
                            t.pop();
                            return t;
                        } else {
                            t.push(e);
                            return t;
                        }
                    }, [])).length === 0 ? [""] : t);
                }
                levelTwoFileOptimize(t) {
                    if (!Array.isArray(t)) {
                        t = this.slashSplit(t);
                    }
                    let e = false;
                    do {
                        e = false;
                        if (!this.preserveMultipleSlashes) {
                            for (let s = 1; s < t.length - 1; s++) {
                                const i = t[s];
                                if (!(s === 1 && i === "" && t[0] === "" || i !== "." && i !== "")) {
                                    e = true;
                                    t.splice(s, 1);
                                    s--;
                                }
                            }
                            if (!(t[0] !== "." || t.length !== 2 || t[1] !== "." && t[1] !== "")) {
                                e = true;
                                t.pop();
                            }
                        }
                        let s = 0;
                        for (; (s = t.indexOf("..", s + 1)) !== -1;) {
                            const i = t[s - 1];
                            if (i && i !== "." && i !== ".." && i !== "**") {
                                e = true;
                                t.splice(s - 1, 2);
                                s -= 2;
                            }
                        }
                    } while (e);
                    if (t.length === 0) {
                        return [""];
                    } else {
                        return t;
                    }
                }
                firstPhasePreProcess(t) {
                    let e = false;
                    do {
                        e = false;
                        for (let s of t) {
                            let i = -1;
                            for (; (i = s.indexOf("**", i + 1)) !== -1;) {
                                let r = i;
                                for (; s[r + 1] === "**";) {
                                    r++;
                                }
                                if (r > i) {
                                    s.splice(i + 1, r - i);
                                }
                                let n = s[i + 1];
                                const o = s[i + 2];
                                const a = s[i + 3];
                                if (n !== "..") {
                                    continue;
                                }
                                if (!o || o === "." || o === ".." || !a || a === "." || a === "..") {
                                    continue;
                                }
                                e = true;
                                s.splice(i, 1);
                                const h = s.slice(0);
                                h[i] = "**";
                                t.push(h);
                                i--;
                            }
                            if (!this.preserveMultipleSlashes) {
                                for (let t = 1; t < s.length - 1; t++) {
                                    const i = s[t];
                                    if (!(t === 1 && i === "" && s[0] === "" || i !== "." && i !== "")) {
                                        e = true;
                                        s.splice(t, 1);
                                        t--;
                                    }
                                }
                                if (!(s[0] !== "." || s.length !== 2 || s[1] !== "." && s[1] !== "")) {
                                    e = true;
                                    s.pop();
                                }
                            }
                            let r = 0;
                            for (; (r = s.indexOf("..", r + 1)) !== -1;) {
                                const t = s[r - 1];
                                if (t && t !== "." && t !== ".." && t !== "**") {
                                    e = true;
                                    const t = r === 1 && s[r + 1] === "**" ? ["."] : [];
                                    s.splice(r - 1, 2, ...t);
                                    if (s.length === 0) {
                                        s.push("");
                                    }
                                    r -= 2;
                                }
                            }
                        }
                    } while (e);
                    return t;
                }
                secondPhasePreProcess(t) {
                    for (let e = 0; e < t.length - 1; e++) {
                        for (let s = e + 1; s < t.length; s++) {
                            const i = this.partsMatch(t[e], t[s], !this.preserveMultipleSlashes);
                            if (i) {
                                t[e] = [];
                                t[s] = i;
                                break;
                            }
                        }
                    }
                    return t.filter(t => t.length);
                }
                partsMatch(t, e, s = false) {
                    let i = 0;
                    let r = 0;
                    let n = [];
                    let o = "";
                    for (; i < t.length && r < e.length;) {
                        if (t[i] === e[r]) {
                            n.push(o === "b" ? e[r] : t[i]);
                            i++;
                            r++;
                        } else if (s && t[i] === "**" && e[r] === t[i + 1]) {
                            n.push(t[i]);
                            i++;
                        } else if (s && e[r] === "**" && t[i] === e[r + 1]) {
                            n.push(e[r]);
                            r++;
                        } else if (t[i] !== "*" || !e[r] || !this.options.dot && e[r].startsWith(".") || e[r] === "**") {
                            if (e[r] !== "*" || !t[i] || !this.options.dot && t[i].startsWith(".") || t[i] === "**") {
                                return false;
                            }
                            if (o === "a") {
                                return false;
                            }
                            o = "b";
                            n.push(e[r]);
                            i++;
                            r++;
                        } else {
                            if (o === "b") {
                                return false;
                            }
                            o = "a";
                            n.push(t[i]);
                            i++;
                            r++;
                        }
                    }
                    return t.length === e.length && n;
                }
                parseNegate() {
                    if (this.nonegate) {
                        return;
                    }
                    const t = this.pattern;
                    let e = false;
                    let s = 0;
                    for (let i = 0; i < t.length && t.charAt(i) === "!"; i++) {
                        e = !e;
                        s++;
                    }
                    if (s) {
                        this.pattern = t.slice(s);
                    }
                    this.negate = e;
                }
                matchOne(t, s, i = false) {
                    const r = this.options;
                    if (this.isWindows) {
                        const e = typeof t[0] == "string" && /^[a-z]:$/i.test(t[0]);
                        const i = !e && t[0] === "" && t[1] === "" && t[2] === "?" && /^[a-z]:$/i.test(t[3]);
                        const r = typeof s[0] == "string" && /^[a-z]:$/i.test(s[0]);
                        const n = i ? 3 : e ? 0 : undefined;
                        const o = !r && s[0] === "" && s[1] === "" && s[2] === "?" && typeof s[3] == "string" && /^[a-z]:$/i.test(s[3]) ? 3 : r ? 0 : undefined;
                        if (typeof n == "number" && typeof o == "number") {
                            const [e, i] = [t[n], s[o]];
                            if (e.toLowerCase() === i.toLowerCase()) {
                                s[o] = e;
                                if (o > n) {
                                    s = s.slice(o);
                                } else if (n > o) {
                                    t = t.slice(n);
                                }
                            }
                        }
                    }
                    const {
                        optimizationLevel: n = 1
                    } = this.options;
                    if (n >= 2) {
                        t = this.levelTwoFileOptimize(t);
                    }
                    this.debug("matchOne", this, {
                        file: t,
                        pattern: s
                    });
                    this.debug("matchOne", t.length, s.length);
                    for (var o = 0, a = 0, h = t.length, c = s.length; o < h && a < c; o++, a++) {
                        this.debug("matchOne loop");
                        var l = s[a];
                        var u = t[o];
                        this.debug(s, l, u);
                        if (l === false) {
                            return false;
                        }
                        if (l === e.GLOBSTAR) {
                            this.debug("GLOBSTAR", [s, l, u]);
                            var p = o;
                            var d = a + 1;
                            if (d === c) {
                                for (this.debug("** at the end"); o < h; o++) {
                                    if (t[o] === "." || t[o] === ".." || !r.dot && t[o].charAt(0) === ".") {
                                        return false;
                                    }
                                }
                                return true;
                            }
                            for (; p < h;) {
                                var f = t[p];
                                this.debug("\nglobstar while", t, p, s, d, f);
                                if (this.matchOne(t.slice(p), s.slice(d), i)) {
                                    this.debug("globstar found match!", p, h, f);
                                    return true;
                                }
                                if (f === "." || f === ".." || !r.dot && f.charAt(0) === ".") {
                                    this.debug("dot detected!", t, p, s, d);
                                    break;
                                }
                                this.debug("globstar swallow a segment, and continue");
                                p++;
                            }
                            return !(!i || (this.debug("\n>>> no match, partial?", t, p, s, d), p !== h));
                        }
                        let n;
                        if (typeof l == "string") {
                            n = u === l;
                            this.debug("string match", l, u, n);
                        } else {
                            n = l.test(u);
                            this.debug("pattern match", l, u, n);
                        }
                        if (!n) {
                            return false;
                        }
                    }
                    if (o === h && a === c) {
                        return true;
                    }
                    if (o === h) {
                        return i;
                    }
                    if (a === c) {
                        return o === h - 1 && t[o] === "";
                    }
                    throw new Error("wtf?");
                }
                braceExpand() {
                    return (0, e.braceExpand)(this.pattern, this.options);
                }
                parse(t) {
                    (0, n.assertValidPattern)(t);
                    const s = this.options;
                    if (t === "**") {
                        return e.GLOBSTAR;
                    }
                    if (t === "") {
                        return "";
                    }
                    let i;
                    let r = null;
                    if (i = t.match(b)) {
                        r = s.dot ? S : v;
                    } else if (i = t.match(c)) {
                        r = (s.nocase ? s.dot ? d : p : s.dot ? u : l)(i[1]);
                    } else if (i = t.match(k)) {
                        r = (s.nocase ? s.dot ? x : E : s.dot ? O : _)(i);
                    } else if (i = t.match(f)) {
                        r = s.dot ? m : g;
                    } else if (i = t.match(y)) {
                        r = w;
                    }
                    const a = o.AST.fromGlob(t, this.options).toMMPattern();
                    if (r && typeof a == "object") {
                        Reflect.defineProperty(a, "test", {
                            value: r
                        });
                    }
                    return a;
                }
                makeRe() {
                    if (this.regexp || this.regexp === false) {
                        return this.regexp;
                    }
                    const t = this.set;
                    if (!t.length) {
                        this.regexp = false;
                        return this.regexp;
                    }
                    const s = this.options;
                    const i = s.noglobstar ? "[^/]*?" : s.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?";
                    const r = new Set(s.nocase ? ["i"] : []);
                    let n = t.map(t => {
                        const s = t.map(t => {
                            if (t instanceof RegExp) {
                                for (const e of t.flags.split("")) {
                                    r.add(e);
                                }
                            }
                            if (typeof t == "string") {
                                return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                            } else if (t === e.GLOBSTAR) {
                                return e.GLOBSTAR;
                            } else {
                                return t._src;
                            }
                        });
                        s.forEach((t, r) => {
                            const n = s[r + 1];
                            const o = s[r - 1];
                            if (t === e.GLOBSTAR && o !== e.GLOBSTAR) {
                                if (o === undefined) {
                                    if (n !== undefined && n !== e.GLOBSTAR) {
                                        s[r + 1] = "(?:\\/|" + i + "\\/)?" + n;
                                    } else {
                                        s[r] = i;
                                    }
                                } else if (n === undefined) {
                                    s[r - 1] = o + "(?:\\/|" + i + ")?";
                                } else if (n !== e.GLOBSTAR) {
                                    s[r - 1] = o + "(?:\\/|\\/" + i + "\\/)" + n;
                                    s[r + 1] = e.GLOBSTAR;
                                }
                            }
                        });
                        return s.filter(t => t !== e.GLOBSTAR).join("/");
                    }).join("|");
                    const [o, a] = t.length > 1 ? ["(?:", ")"] : ["", ""];
                    n = "^" + o + n + a + "$";
                    if (this.negate) {
                        n = "^(?!" + n + ").+$";
                    }
                    try {
                        this.regexp = new RegExp(n, [...r].join(""));
                    } catch (t) {
                        this.regexp = false;
                    }
                    return this.regexp;
                }
                slashSplit(t) {
                    if (this.preserveMultipleSlashes) {
                        return t.split("/");
                    } else if (this.isWindows && /^\/\/[^\/]+/.test(t)) {
                        return ["", ...t.split(/\/+/)];
                    } else {
                        return t.split(/\/+/);
                    }
                }
                match(t, e = this.partial) {
                    this.debug("match", t, this.pattern);
                    if (this.comment) {
                        return false;
                    }
                    if (this.empty) {
                        return t === "";
                    }
                    if (t === "/" && e) {
                        return true;
                    }
                    const s = this.options;
                    if (this.isWindows) {
                        t = t.split("\\").join("/");
                    }
                    const i = this.slashSplit(t);
                    this.debug(this.pattern, "split", i);
                    const r = this.set;
                    this.debug(this.pattern, "set", r);
                    let n = i[i.length - 1];
                    if (!n) {
                        for (let t = i.length - 2; !n && t >= 0; t--) {
                            n = i[t];
                        }
                    }
                    for (let t = 0; t < r.length; t++) {
                        const o = r[t];
                        let a = i;
                        if (s.matchBase && o.length === 1) {
                            a = [n];
                        }
                        if (this.matchOne(a, o, e)) {
                            return !!s.flipNegate || !this.negate;
                        }
                    }
                    return !s.flipNegate && this.negate;
                }
                static defaults(t) {
                    return e.minimatch.defaults(t).Minimatch;
                }
            }
            e.Minimatch = P;
            var N = s(280);
            Object.defineProperty(e, "AST", {
                enumerable: true,
                get: function () {
                    return N.AST;
                }
            });
            var j = s(577);
            Object.defineProperty(e, "escape", {
                enumerable: true,
                get: function () {
                    return j.escape;
                }
            });
            var R = s(718);
            Object.defineProperty(e, "unescape", {
                enumerable: true,
                get: function () {
                    return R.unescape;
                }
            });
            e.minimatch.AST = o.AST;
            e.minimatch.Minimatch = P;
            e.minimatch.escape = a.escape;
            e.minimatch.unescape = h.unescape;
        },
        193: t => {
            "use strict";

            t.exports = require("node:string_decoder");
        },
        239: (t, e, s) => {
            const i = s(613);
            const r = s(928);
            const n = s(896);
            let o;
            try {
                o = s(734);
            } catch (t) { }
            const a = {
                nosort: true,
                silent: true
            };
            let h = 0;
            const c = process.platform === "win32";
            const l = t => {
                ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach(e => {
                    t[e] = t[e] || n[e];
                    t[e += "Sync"] = t[e] || n[e];
                });
                t.maxBusyTries = t.maxBusyTries || 3;
                t.emfileWait = t.emfileWait || 1000;
                if (t.glob === false) {
                    t.disableGlob = true;
                }
                if (t.disableGlob !== true && o === undefined) {
                    throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
                }
                t.disableGlob = t.disableGlob || false;
                t.glob = t.glob || a;
            };
            const u = (t, e, s) => {
                if (typeof e == "function") {
                    s = e;
                    e = {};
                }
                i(t, "rimraf: missing path");
                i.equal(typeof t, "string", "rimraf: path should be a string");
                i.equal(typeof s, "function", "rimraf: callback function required");
                i(e, "rimraf: invalid options argument provided");
                i.equal(typeof e, "object", "rimraf: options should be object");
                l(e);
                let r = 0;
                let n = null;
                let a = 0;
                const c = (t, i) => t ? s(t) : (a = i.length, a === 0 ? s() : void i.forEach(t => {
                    const i = o => {
                        if (o) {
                            if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < e.maxBusyTries) {
                                r++;
                                return (// TOLOOK
                                    setTimeout(() => p(t, e, i), r * 100)
                                );
                            }
                            if (o.code === "EMFILE" && h < e.emfileWait) {
                                return (// TOLOOK
                                    setTimeout(() => p(t, e, i), h++)
                                );
                            }
                            if (o.code === "ENOENT") {
                                o = null;
                            }
                        }
                        h = 0;
                        (t => {
                            n = n || t;
                            if (--a == 0) {
                                s(n);
                            }
                        })(o);
                    };
                    p(t, e, i);
                }));
                if (e.disableGlob || !o.hasMagic(t)) {
                    return c(null, [t]);
                }
                e.lstat(t, (s, i) => {
                    if (!s) {
                        return c(null, [t]);
                    }
                    o(t, e.glob, c);
                });
            };
            const p = (t, e, s) => {
                i(t);
                i(e);
                i(typeof s == "function");
                e.lstat(t, (i, r) => i && i.code === "ENOENT" ? s(null) : (i && i.code === "EPERM" && c && d(t, e, i, s), r && r.isDirectory() ? g(t, e, i, s) : void e.unlink(t, i => {
                    if (i) {
                        if (i.code === "ENOENT") {
                            return s(null);
                        }
                        if (i.code === "EPERM") {
                            if (c) {
                                return d(t, e, i, s);
                            } else {
                                return g(t, e, i, s);
                            }
                        }
                        if (i.code === "EISDIR") {
                            return g(t, e, i, s);
                        }
                    }
                    return s(i);
                })));
            };
            const d = (t, e, s, r) => {
                i(t);
                i(e);
                i(typeof r == "function");
                e.chmod(t, 438, i => {
                    if (i) {
                        r(i.code === "ENOENT" ? null : s);
                    } else {
                        e.stat(t, (i, n) => {
                            if (i) {
                                r(i.code === "ENOENT" ? null : s);
                            } else if (n.isDirectory()) {
                                g(t, e, s, r);
                            } else {
                                e.unlink(t, r);
                            }
                        });
                    }
                });
            };
            const f = (t, e, s) => {
                i(t);
                i(e);
                try {
                    e.chmodSync(t, 438);
                } catch (t) {
                    if (t.code === "ENOENT") {
                        return;
                    }
                    throw s;
                }
                let r;
                try {
                    r = e.statSync(t);
                } catch (t) {
                    if (t.code === "ENOENT") {
                        return;
                    }
                    throw s;
                }
                if (r.isDirectory()) {
                    w(t, e, s);
                } else {
                    e.unlinkSync(t);
                }
            };
            const g = (t, e, s, r) => {
                i(t);
                i(e);
                i(typeof r == "function");
                e.rmdir(t, i => {
                    if (!i || i.code !== "ENOTEMPTY" && i.code !== "EEXIST" && i.code !== "EPERM") {
                        if (i && i.code === "ENOTDIR") {
                            r(s);
                        } else {
                            r(i);
                        }
                    } else {
                        m(t, e, r);
                    }
                });
            };
            const m = (t, e, s) => {
                i(t);
                i(e);
                i(typeof s == "function");
                e.readdir(t, (i, n) => {
                    if (i) {
                        return s(i);
                    }
                    let o;
                    let a = n.length;
                    if (a === 0) {
                        return e.rmdir(t, s);
                    }
                    n.forEach(i => {
                        u(r.join(t, i), e, i => {
                            if (!o) {
                                if (i) {
                                    return s(o = i);
                                } else {
                                    if (--a == 0) {
                                        e.rmdir(t, s);
                                    }
                                    return;
                                }
                            }
                        });
                    });
                });
            };
            const y = (t, e) => {
                let s;
                l(e = e || {});
                i(t, "rimraf: missing path");
                i.equal(typeof t, "string", "rimraf: path should be a string");
                i(e, "rimraf: missing options");
                i.equal(typeof e, "object", "rimraf: options should be object");
                if (e.disableGlob || !o.hasMagic(t)) {
                    s = [t];
                } else {
                    try {
                        e.lstatSync(t);
                        s = [t];
                    } catch (i) {
                        s = o.sync(t, e.glob);
                    }
                }
                if (s.length) {
                    for (let t = 0; t < s.length; t++) {
                        const i = s[t];
                        let r;
                        try {
                            r = e.lstatSync(i);
                        } catch (t) {
                            if (t.code === "ENOENT") {
                                return;
                            }
                            if (t.code === "EPERM" && c) {
                                f(i, e, t);
                            }
                        }
                        try {
                            if (r && r.isDirectory()) {
                                w(i, e, null);
                            } else {
                                e.unlinkSync(i);
                            }
                        } catch (t) {
                            if (t.code === "ENOENT") {
                                return;
                            }
                            if (t.code === "EPERM") {
                                if (c) {
                                    return f(i, e, t);
                                } else {
                                    return w(i, e, t);
                                }
                            }
                            if (t.code !== "EISDIR") {
                                throw t;
                            }
                            w(i, e, t);
                        }
                    }
                }
            };
            const w = (t, e, s) => {
                i(t);
                i(e);
                try {
                    e.rmdirSync(t);
                } catch (i) {
                    if (i.code === "ENOENT") {
                        return;
                    }
                    if (i.code === "ENOTDIR") {
                        throw s;
                    }
                    if (!(i.code !== "ENOTEMPTY" && i.code !== "EEXIST" && i.code !== "EPERM")) {
                        b(t, e);
                    }
                }
            };
            const b = (t, e) => {
                i(t);
                i(e);
                e.readdirSync(t).forEach(s => y(r.join(t, s), e));
                const s = c ? 100 : 1;
                let n = 0;
                for (; ;) {
                    let i = true;
                    try {
                        const s = e.rmdirSync(t, e);
                        i = false;
                        return s;
                    } finally {
                        if (++n < s && i) {
                            continue;
                        }
                    }
                }
            };
            t.exports = u;
            u.sync = y;
        },
        265: function (t, e, s) {
            "use strict";

            var i;
            var r = this && this.__createBinding || (Object.create ? function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                var r = Object.getOwnPropertyDescriptor(e, s);
                if (!(r && !("get" in r ? !e.__esModule : r.writable || r.configurable))) {
                    r = {
                        enumerable: true,
                        get: function () {
                            return e[s];
                        }
                    };
                }
                Object.defineProperty(t, i, r);
            } : function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                t[i] = e[s];
            });
            var n = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                });
            } : function (t, e) {
                t.default = e;
            });
            var o = this && this.__importStar || (i = function (t) {
                i = Object.getOwnPropertyNames || function (t) {
                    var e = [];
                    for (var s in t) {
                        if (Object.prototype.hasOwnProperty.call(t, s)) {
                            e[e.length] = s;
                        }
                    }
                    return e;
                };
                return i(t);
            }, function (t) {
                if (t && t.__esModule) {
                    return t;
                }
                var e = {};
                if (t != null) {
                    for (var s = i(t), o = 0; o < s.length; o++) {
                        if (s[o] !== "default") {
                            r(e, t, s[o]);
                        }
                    }
                }
                n(e, t);
                return e;
            });
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Notes = undefined;
            e.activate = function (t) {
                console.log("\"vscode-notes\" is active.");
                let e = new l.NotesViewProvider(String(u.getNotesLocation()), String(u.getNotesExtensions()));
                a.window.registerTreeDataProvider("notes", e.init());
                t.subscriptions.push(a.workspace.onDidChangeConfiguration(t => {
                    if (t.affectsConfiguration("notes.notesLocation")) {
                        a.window.showWarningMessage("The Notes extension detected a change in the storage location. You must reload the window for the change to take effect.", "Reload").then(t => {
                            if (t === "Reload") {
                                a.commands.executeCommand("workbench.action.reloadWindow");
                            }
                        });
                    }
                }));
                let s = a.commands.registerCommand("Notes.deleteNote", t => {
                    u.deleteNote(t, e);
                });
                t.subscriptions.push(s);
                let i = a.commands.registerCommand("Notes.deleteFolder", t => {
                    u.deleteFolder(t, e);
                });
                t.subscriptions.push(i);
                let r = a.commands.registerCommand("Notes.listNotes", () => {
                    u.listNotes();
                });
                t.subscriptions.push(r);
                let n = a.commands.registerCommand("Notes.newNote", t => {
                    u.newNote(e, t);
                });
                t.subscriptions.push(n);

                // ! register cmd
                let n2 = a.commands.registerCommand("Notes.newNoteWithDate", t => {
                    u.newNoteWithDate(e, t);
                });
                t.subscriptions.push(n2);

                let o = a.commands.registerCommand("Notes.newFolder", t => {
                    u.newFolder(e, t);
                });
                t.subscriptions.push(o);
                let h = a.commands.registerCommand("Notes.openNote", t => {
                    u.openNote(t);
                });
                t.subscriptions.push(h);
                let c = a.commands.registerCommand("Notes.refreshNotes", () => {
                    u.refreshNotes(e);
                });
                t.subscriptions.push(c);
                let p = a.commands.registerCommand("Notes.renameNote", t => {
                    u.renameNote(t, e);
                });
                t.subscriptions.push(p);
                let d = a.commands.registerCommand("Notes.renameFolder", t => {
                    u.renameFolder(t, e);
                });
                t.subscriptions.push(d);
                let f = a.commands.registerCommand("Notes.setupNotes", () => {
                    u.setupNotes();
                });
                t.subscriptions.push(f);
            };
            e.deactivate = function () { };
            const a = o(s(398));
            const h = o(s(896));
            const c = o(s(928));
            const l = s(949);
            class u {
                constructor(t) {
                    this.settings = t;
                    this.settings = a.workspace.getConfiguration("vscode-notes");
                }
                static getNotesLocation() {
                    return a.workspace.getConfiguration("notes").get("notesLocation");
                }
                static getNotesDefaultNoteExtension() {
                    return a.workspace.getConfiguration("notes").get("notesDefaultNoteExtension");
                }
                static getNotesExtensions() {
                    return a.workspace.getConfiguration("notes").get("notesExtensions");
                }
                static deleteNote(t, e) {
                    // ! original code to remove file with msg
                    // a.window.showWarningMessage(`Are you sure you want to delete '${t.name}'? This action is permanent and can not be reversed.`, "Yes", "No").then(s => {
                    //     if (s === "Yes") {
                    //         h.unlink(c.join(String(t.location), String(t.name)), e => {
                    //             if (e) {
                    //                 console.error(e);
                    //                 return a.window.showErrorMessage(`Failed to delete ${t.name}.`);
                    //             }
                    //             a.window.showInformationMessage(`Successfully deleted ${t.name}.`);
                    //         });
                    //         e.refresh();
                    //     }
                    // });

                    // ! mod code to remove file directly
                    h.unlink(c.join(String(t.location), String(t.name)), e => {
                        if (e) {
                            console.error(e);
                            return a.window.showErrorMessage(`Failed to delete ${t.name}.`);
                        }
                        a.window.showInformationMessage(`Successfully deleted ${t.name}.`);
                    });
                    e.refresh();
                }
                static deleteFolder(t, e) {
                    if (t.isFolder) {
                        a.window.showWarningMessage(`Are you sure you want to delete folder '${t.name}' and all its contents? This action is permanent and can not be reversed.`, "Yes", "No").then(i => {
                            if (i === "Yes") {
                                const i = c.join(t.location, t.name);
                                s(239)(i, s => {
                                    if (s) {
                                        console.error(s);
                                        a.window.showErrorMessage(`Failed to delete folder ${t.name}.`);
                                        return;
                                    }
                                    a.window.showInformationMessage(`Successfully deleted folder ${t.name}.`);
                                    e.refresh();
                                });
                            }
                        });
                    } else {
                        a.window.showErrorMessage("Selected item is not a folder.");
                    }
                }
                static listNotes() {
                    let t = String(u.getNotesLocation());
                    String(u.getNotesExtensions());
                    h.readdir(String(t), (e, s) => {
                        if (e) {
                            console.error(e);
                            return a.window.showErrorMessage("Failed to read the notes folder.");
                        }
                        a.window.showQuickPick(s).then(e => {
                            a.window.showTextDocument(a.Uri.file(c.join(String(t), String(e))));
                        });
                    });
                }
                static newNote(t, e) {
                    let s = e ? c.join(e.location, e.name) : String(u.getNotesLocation());
                    let i = String(u.getNotesDefaultNoteExtension());
                    a.window.showInputBox({
                        prompt: "Note name?",
                        value: ""
                    }).then(e => {
                        if (!e) {
                            return;
                        }
                        let r = `${e}`;
                        let n = c.join(s, `${r.replace(/\:/gi, "")}.${i}`);
                        let o = "# " + r + `

`;
                        if (h.existsSync(String(n))) {
                            return a.window.showWarningMessage("A note with that name already exists.");
                        }
                        h.writeFile(n, o, t => {
                            if (t) {
                                console.error(t);
                                return a.window.showErrorMessage("Failed to create the new note.");
                            }
                            {
                                let t = a.Uri.file(n);
                                a.window.showTextDocument(t).then(() => {
                                    a.commands.executeCommand("cursorMove", {
                                        to: "viewPortBottom"
                                    });
                                });
                            }
                        });
                        t.refresh();
                    });
                }
                // ! new btn to create a md file with current date
                static newNoteWithDate(t, e) {
                    // Generate current date as filename
                    let date = new Date();
                    let formattedDate = date.getFullYear() + "年" +
                        (date.getMonth() + 1).toString().padStart(2, '0') + "月" +
                        date.getDate().toString().padStart(2, '0') + "日 ";
                    let dayOfWeek = date.toLocaleString('zh-US', { weekday: 'long' });
                    formattedDate += dayOfWeek;

                    let s = e ? c.join(e.location, e.name) : String(u.getNotesLocation());
                    let i = String(u.getNotesDefaultNoteExtension());
                    
                    // Use generated date as filename directly
                    let r = formattedDate;
                    let n = c.join(s, `${r.replace(/\:/gi, "")}.${i}`);

                    // remove the default file content
                    let o = ``;

                    if (h.existsSync(String(n))) {
                        return a.window.showWarningMessage("A note with that name already exists.");
                    }
                    h.writeFile(n, o, t => {
                        if (t) {
                            console.error(t);
                            return a.window.showErrorMessage("Failed to create the new note.");
                        }
                        {
                            let t = a.Uri.file(n);
                            a.window.showTextDocument(t).then(() => {
                                a.commands.executeCommand("cursorMove", {
                                    to: "viewPortBottom"
                                });
                            });
                        }
                    });
                    t.refresh();
                }
                static newFolder(t, e) {
                    let s = e ? c.join(e.location, e.name) : String(u.getNotesLocation());
                    a.window.showInputBox({
                        prompt: "Folder name?",
                        value: ""
                    }).then(e => {
                        if (!e) {
                            return;
                        }
                        let i = c.join(s, e);
                        if (h.existsSync(String(i))) {
                            return a.window.showWarningMessage("A folder with that name already exists.");
                        }
                        h.mkdir(i, {
                            recursive: true
                        }, t => {
                            if (t) {
                                console.error(t);
                                return a.window.showErrorMessage("Failed to create the new folder.");
                            }
                            a.window.showInformationMessage(`Successfully created folder ${e}.`);
                        });
                        t.refresh();
                    });
                }
                static openNote(t) {
                    if (typeof t != "string" && t.isFolder) {
                        return;
                    }
                    let e;
                    e = typeof t == "string" ? t : c.join(String(t.location), String(t.name));
                    a.window.showTextDocument(a.Uri.file(e));
                }
                static refreshNotes(t) {
                    t.refresh();
                }
                static renameNote(t, e) {
                    if (t.isFolder) {
                        return;
                    }
                    let s = t.name.split(".").pop();
                    a.window.showInputBox({
                        prompt: "New note name?",
                        value: t.name
                    }).then(i => {
                        if (!i || i === t.name) {
                            return;
                        }
                        let r = c.extname(i).replace(".", "");
                        let n = "";
                        n = String(u.getNotesExtensions()).split(",").includes(r) ? i : c.extname(i) === "" ? i + "." + s : c.basename(i, c.extname(i)) + "." + s;
                        let o = c.join(t.location, n);
                        if (h.existsSync(o)) {
                            a.window.showWarningMessage(`'${n}' already exists.`);
                        } else {
                            a.window.showInformationMessage(`'${t.name}' renamed to '${n}'.`);
                            h.renameSync(c.join(t.location, t.name), o);
                            e.refresh();
                        }
                    });
                }
                static renameFolder(t, e) {
                    if (t.isFolder) {
                        a.window.showInputBox({
                            prompt: "New folder name?",
                            value: t.name
                        }).then(s => {
                            if (!s || s === t.name) {
                                return;
                            }
                            let i = c.join(t.location, s);
                            if (h.existsSync(i)) {
                                a.window.showWarningMessage(`'${s}' already exists.`);
                            } else {
                                a.window.showInformationMessage(`'${t.name}' renamed to '${s}'.`);
                                h.renameSync(c.join(t.location, t.name), i);
                                e.refresh();
                            }
                        });
                    }
                }
                static setupNotes(t) {
                    if (u.getNotesLocation()) {
                        a.commands.executeCommand("workbench.action.openSettings", "@ext:dionmunk.vscode-notes");
                    } else {
                        a.window.showOpenDialog({
                            canSelectFiles: false,
                            canSelectFolders: true,
                            canSelectMany: false,
                            openLabel: "Select"
                        }).then(t => {
                            if (t && t[0]) {
                                a.workspace.getConfiguration("notes").update("notesLocation", c.normalize(t[0].fsPath), true).then(() => {
                                    a.window.showWarningMessage("The Notes extension detected a change in the storage location. You must reload the window for the change to take effect.", "Reload").then(t => {
                                        if (t === "Reload") {
                                            a.commands.executeCommand("workbench.action.reloadWindow");
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            }
            e.Notes = u;
        },
        280: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.AST = undefined;
            const i = s(897);
            const r = s(718);
            const n = new Set(["!", "?", "+", "*", "@"]);
            const o = t => n.has(t);
            const a = "(?!\\.)";
            const h = new Set(["[", "."]);
            const c = new Set(["..", "."]);
            const l = new Set("().*{}+?[]^$\\!");
            const u = "[^/]";
            const p = u + "*?";
            const d = u + "+?";
            class f {
                type;
                #$;
                #U;
                #q = false;
                #H = [];
                #V;
                #Y;
                #Q;
                #Z = false;
                #K;
                #J;
                #X = false;
                constructor(t, e, s = {}) {
                    this.type = t;
                    if (t) {
                        this.#U = true;
                    }
                    this.#V = e;
                    this.#$ = this.#V ? this.#V.#$ : this;
                    this.#K = this.#$ === this ? s : this.#$.#K;
                    this.#Q = this.#$ === this ? [] : this.#$.#Q;
                    if (!(t !== "!" || this.#$.#Z)) {
                        this.#Q.push(this);
                    }
                    this.#Y = this.#V ? this.#V.#H.length : 0;
                }
                get hasMagic() {
                    if (this.#U !== undefined) {
                        return this.#U;
                    }
                    for (const t of this.#H) {
                        if (typeof t != "string" && (t.type || t.hasMagic)) {
                            return this.#U = true;
                        }
                    }
                    return this.#U;
                }
                toString() {
                    if (this.#J !== undefined) {
                        return this.#J;
                    } else if (this.type) {
                        return this.#J = this.type + "(" + this.#H.map(t => String(t)).join("|") + ")";
                    } else {
                        return this.#J = this.#H.map(t => String(t)).join("");
                    }
                }
                #tt() {
                    if (this !== this.#$) {
                        throw new Error("should only call on root");
                    }
                    if (this.#Z) {
                        return this;
                    }
                    let t;
                    this.toString();
                    this.#Z = true;
                    for (; t = this.#Q.pop();) {
                        if (t.type !== "!") {
                            continue;
                        }
                        let e = t;
                        let s = e.#V;
                        for (; s;) {
                            for (let i = e.#Y + 1; !s.type && i < s.#H.length; i++) {
                                for (const e of t.#H) {
                                    if (typeof e == "string") {
                                        throw new Error("string part in extglob AST??");
                                    }
                                    e.copyIn(s.#H[i]);
                                }
                            }
                            e = s;
                            s = e.#V;
                        }
                    }
                    return this;
                }
                push(...t) {
                    for (const e of t) {
                        if (e !== "") {
                            if (typeof e != "string" && !(e instanceof f && e.#V === this)) {
                                throw new Error("invalid part: " + e);
                            }
                            this.#H.push(e);
                        }
                    }
                }
                toJSON() {
                    const t = this.type === null ? this.#H.slice().map(t => typeof t == "string" ? t : t.toJSON()) : [this.type, ...this.#H.map(t => t.toJSON())];
                    if (this.isStart() && !this.type) {
                        t.unshift([]);
                    }
                    if (this.isEnd() && (this === this.#$ || this.#$.#Z && this.#V?.type === "!")) {
                        t.push({});
                    }
                    return t;
                }
                isStart() {
                    if (this.#$ === this) {
                        return true;
                    }
                    if (!this.#V?.isStart()) {
                        return false;
                    }
                    if (this.#Y === 0) {
                        return true;
                    }
                    const t = this.#V;
                    for (let e = 0; e < this.#Y; e++) {
                        const s = t.#H[e];
                        if (!(s instanceof f && s.type === "!")) {
                            return false;
                        }
                    }
                    return true;
                }
                isEnd() {
                    if (this.#$ === this) {
                        return true;
                    }
                    if (this.#V?.type === "!") {
                        return true;
                    }
                    if (!this.#V?.isEnd()) {
                        return false;
                    }
                    if (!this.type) {
                        return this.#V?.isEnd();
                    }
                    const t = this.#V ? this.#V.#H.length : 0;
                    return this.#Y === t - 1;
                }
                copyIn(t) {
                    if (typeof t == "string") {
                        this.push(t);
                    } else {
                        this.push(t.clone(this));
                    }
                }
                clone(t) {
                    const e = new f(this.type, t);
                    for (const t of this.#H) {
                        e.copyIn(t);
                    }
                    return e;
                }
                static #et(t, e, s, i) {
                    let r = false;
                    let n = false;
                    let a = -1;
                    let h = false;
                    if (e.type === null) {
                        let c = s;
                        let l = "";
                        for (; c < t.length;) {
                            const s = t.charAt(c++);
                            if (r || s === "\\") {
                                r = !r;
                                l += s;
                            } else if (n) {
                                if (c === a + 1) {
                                    if (!(s !== "^" && s !== "!")) {
                                        h = true;
                                    }
                                } else if (!(s !== "]" || c === a + 2 && h)) {
                                    n = false;
                                }
                                l += s;
                            } else if (s !== "[") {
                                if (i.noext || !o(s) || t.charAt(c) !== "(") {
                                    l += s;
                                } else {
                                    e.push(l);
                                    l = "";
                                    const r = new f(s, e);
                                    c = f.#et(t, r, c, i);
                                    e.push(r);
                                }
                            } else {
                                n = true;
                                a = c;
                                h = false;
                                l += s;
                            }
                        }
                        e.push(l);
                        return c;
                    }
                    let c = s + 1;
                    let l = new f(null, e);
                    const u = [];
                    let p = "";
                    for (; c < t.length;) {
                        const s = t.charAt(c++);
                        if (r || s === "\\") {
                            r = !r;
                            p += s;
                        } else if (n) {
                            if (c === a + 1) {
                                if (!(s !== "^" && s !== "!")) {
                                    h = true;
                                }
                            } else if (!(s !== "]" || c === a + 2 && h)) {
                                n = false;
                            }
                            p += s;
                        } else if (s !== "[") {
                            if (o(s) && t.charAt(c) === "(") {
                                l.push(p);
                                p = "";
                                const e = new f(s, l);
                                l.push(e);
                                c = f.#et(t, e, c, i);
                            } else if (s !== "|") {
                                if (s === ")") {
                                    if (p === "" && e.#H.length === 0) {
                                        e.#X = true;
                                    }
                                    l.push(p);
                                    p = "";
                                    e.push(...u, l);
                                    return c;
                                }
                                p += s;
                            } else {
                                l.push(p);
                                p = "";
                                u.push(l);
                                l = new f(null, e);
                            }
                        } else {
                            n = true;
                            a = c;
                            h = false;
                            p += s;
                        }
                    }
                    e.type = null;
                    e.#U = undefined;
                    e.#H = [t.substring(s - 1)];
                    return c;
                }
                static fromGlob(t, e = {}) {
                    const s = new f(null, undefined, e);
                    f.#et(t, s, 0, e);
                    return s;
                }
                toMMPattern() {
                    if (this !== this.#$) {
                        return this.#$.toMMPattern();
                    }
                    const t = this.toString();
                    const [e, s, i, r] = this.toRegExpSource();
                    if (!(i || this.#U || this.#K.nocase && !this.#K.nocaseMagicOnly && t.toUpperCase() !== t.toLowerCase())) {
                        return s;
                    }
                    const n = (this.#K.nocase ? "i" : "") + (r ? "u" : "");
                    return Object.assign(new RegExp(`^${e}$`, n), {
                        _src: e,
                        _glob: t
                    });
                }
                get options() {
                    return this.#K;
                }
                toRegExpSource(t) {
                    const e = t ?? !!this.#K.dot;
                    if (this.#$ === this) {
                        this.#tt();
                    }
                    if (!this.type) {
                        const s = this.isStart() && this.isEnd();
                        const i = this.#H.map(e => {
                            const [i, r, n, o] = typeof e == "string" ? f.#st(e, this.#U, s) : e.toRegExpSource(t);
                            this.#U = this.#U || n;
                            this.#q = this.#q || o;
                            return i;
                        }).join("");
                        let n = "";
                        if (this.isStart() && typeof this.#H[0] == "string" && (this.#H.length !== 1 || !c.has(this.#H[0]))) {
                            const s = h;
                            const r = e && s.has(i.charAt(0)) || i.startsWith("\\.") && s.has(i.charAt(2)) || i.startsWith("\\.\\.") && s.has(i.charAt(4));
                            const o = !e && !t && s.has(i.charAt(0));
                            n = r ? "(?!(?:^|/)\\.\\.?(?:$|/))" : o ? a : "";
                        }
                        let o = "";
                        if (this.isEnd() && this.#$.#Z && this.#V?.type === "!") {
                            o = "(?:$|\\/)";
                        }
                        return [n + i + o, (0, r.unescape)(i), this.#U = !!this.#U, this.#q];
                    }
                    const s = this.type === "*" || this.type === "+";
                    const i = this.type === "!" ? "(?:(?!(?:" : "(?:";
                    let n = this.#it(e);
                    if (this.isStart() && this.isEnd() && !n && this.type !== "!") {
                        const t = this.toString();
                        this.#H = [t];
                        this.type = null;
                        this.#U = undefined;
                        return [t, (0, r.unescape)(this.toString()), false, false];
                    }
                    let o = !s || t || e ? "" : this.#it(true);
                    if (o === n) {
                        o = "";
                    }
                    if (o) {
                        n = `(?:${n})(?:${o})*?`;
                    }
                    let l = "";
                    l = this.type === "!" && this.#X ? (this.isStart() && !e ? a : "") + d : i + n + (this.type === "!" ? "))" + (!this.isStart() || e || t ? "" : a) + p + ")" : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && o ? ")" : this.type === "*" && o ? ")?" : `)${this.type}`);
                    return [l, (0, r.unescape)(n), this.#U = !!this.#U, this.#q];
                }
                #it(t) {
                    return this.#H.map(e => {
                        if (typeof e == "string") {
                            throw new Error("string type in extglob ast??");
                        }
                        const [s, i, r, n] = e.toRegExpSource(t);
                        this.#q = this.#q || n;
                        return s;
                    }).filter(t => !(this.isStart() && this.isEnd() && !t)).join("|");
                }
                static #st(t, e, s = false) {
                    let n = false;
                    let o = "";
                    let a = false;
                    for (let r = 0; r < t.length; r++) {
                        const h = t.charAt(r);
                        if (n) {
                            n = false;
                            o += (l.has(h) ? "\\" : "") + h;
                        } else if (h !== "\\") {
                            if (h === "[") {
                                const [s, n, h, c] = (0, i.parseClass)(t, r);
                                if (h) {
                                    o += s;
                                    a = a || n;
                                    r += h - 1;
                                    e = e || c;
                                    continue;
                                }
                            }
                            if (h !== "*") {
                                if (h !== "?") {
                                    o += h.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                                } else {
                                    o += u;
                                    e = true;
                                }
                            } else {
                                o += s && t === "*" ? d : p;
                                e = true;
                            }
                        } else if (r === t.length - 1) {
                            o += "\\\\";
                        } else {
                            n = true;
                        }
                    }
                    return [o, (0, r.unescape)(t), !!e, a];
                }
            }
            e.AST = f;
        },
        293: (t, e, s) => {
            function i(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
            }
            e.setopts = function (t, e, s) {
                if (!s) {
                    s = {};
                }
                if (s.matchBase && e.indexOf("/") === -1) {
                    if (s.noglobstar) {
                        throw new Error("base matching requires globstar");
                    }
                    e = "**/" + e;
                }
                t.silent = !!s.silent;
                t.pattern = e;
                t.strict = s.strict !== false;
                t.realpath = !!s.realpath;
                t.realpathCache = s.realpathCache || Object.create(null);
                t.follow = !!s.follow;
                t.dot = !!s.dot;
                t.mark = !!s.mark;
                t.nodir = !!s.nodir;
                if (t.nodir) {
                    t.mark = true;
                }
                t.sync = !!s.sync;
                t.nounique = !!s.nounique;
                t.nonull = !!s.nonull;
                t.nosort = !!s.nosort;
                t.nocase = !!s.nocase;
                t.stat = !!s.stat;
                t.noprocess = !!s.noprocess;
                t.absolute = !!s.absolute;
                t.fs = s.fs || r;
                t.maxLength = s.maxLength || Infinity;
                t.cache = s.cache || Object.create(null);
                t.statCache = s.statCache || Object.create(null);
                t.symlinks = s.symlinks || Object.create(null);
                (function (t, e) {
                    t.ignore = e.ignore || [];
                    if (!Array.isArray(t.ignore)) {
                        t.ignore = [t.ignore];
                    }
                    if (t.ignore.length) {
                        t.ignore = t.ignore.map(l);
                    }
                })(t, s);
                t.changedCwd = false;
                var o = process.cwd();
                if (i(s, "cwd")) {
                    t.cwd = n.resolve(s.cwd);
                    t.changedCwd = t.cwd !== o;
                } else {
                    t.cwd = o;
                }
                t.root = s.root || n.resolve(t.cwd, "/");
                t.root = n.resolve(t.root);
                if (process.platform === "win32") {
                    t.root = t.root.replace(/\\/g, "/");
                }
                t.cwdAbs = a(t.cwd) ? t.cwd : u(t, t.cwd);
                if (process.platform === "win32") {
                    t.cwdAbs = t.cwdAbs.replace(/\\/g, "/");
                }
                t.nomount = !!s.nomount;
                s.nonegate = true;
                s.nocomment = true;
                s.allowWindowsEscape = false;
                t.minimatch = new h(e, s);
                t.options = t.minimatch.options;
            };
            e.ownProp = i;
            e.makeAbs = u;
            e.finish = function (t) {
                for (var e = t.nounique, s = e ? [] : Object.create(null), i = 0, r = t.matches.length; i < r; i++) {
                    var n = t.matches[i];
                    if (n && Object.keys(n).length !== 0) {
                        var o = Object.keys(n);
                        if (e) {
                            s.push.apply(s, o);
                        } else {
                            o.forEach(function (t) {
                                s[t] = true;
                            });
                        }
                    } else if (t.nonull) {
                        var a = t.minimatch.globSet[i];
                        if (e) {
                            s.push(a);
                        } else {
                            s[a] = true;
                        }
                    }
                }
                if (!e) {
                    s = Object.keys(s);
                }
                if (!t.nosort) {
                    s = s.sort(c);
                }
                if (t.mark) {
                    for (i = 0; i < s.length; i++) {
                        s[i] = t._mark(s[i]);
                    }
                    if (t.nodir) {
                        s = s.filter(function (e) {
                            var s = !/\/$/.test(e);
                            var i = t.cache[e] || t.cache[u(t, e)];
                            if (s && i) {
                                s = i !== "DIR" && !Array.isArray(i);
                            }
                            return s;
                        });
                    }
                }
                if (t.ignore.length) {
                    s = s.filter(function (e) {
                        return !p(t, e);
                    });
                }
                t.found = s;
            };
            e.mark = function (t, e) {
                var s = u(t, e);
                var i = t.cache[s];
                var r = e;
                if (i) {
                    var n = i === "DIR" || Array.isArray(i);
                    var o = e.slice(-1) === "/";
                    if (n && !o) {
                        r += "/";
                    } else if (!n && o) {
                        r = r.slice(0, -1);
                    }
                    if (r !== e) {
                        var a = u(t, r);
                        t.statCache[a] = t.statCache[s];
                        t.cache[a] = t.cache[s];
                    }
                }
                return r;
            };
            e.isIgnored = p;
            e.childrenIgnored = function (t, e) {
                return !!t.ignore.length && t.ignore.some(function (t) {
                    return !(!t.gmatcher || !t.gmatcher.match(e));
                });
            };
            var r = s(896);
            var n = s(928);
            var o = s(27);
            var a = s(641);
            var h = o.Minimatch;
            function c(t, e) {
                return t.localeCompare(e, "en");
            }
            function l(t) {
                var e = null;
                if (t.slice(-3) === "/**") {
                    var s = t.replace(/(\/\*\*)+$/, "");
                    e = new h(s, {
                        dot: true
                    });
                }
                return {
                    matcher: new h(t, {
                        dot: true
                    }),
                    gmatcher: e
                };
            }
            function u(t, e) {
                var s = e;
                s = e.charAt(0) === "/" ? n.join(t.root, e) : a(e) || e === "" ? e : t.changedCwd ? n.resolve(t.cwd, e) : n.resolve(e);
                if (process.platform === "win32") {
                    s = s.replace(/\\/g, "/");
                }
                return s;
            }
            function p(t, e) {
                return !!t.ignore.length && t.ignore.some(function (t) {
                    return t.matcher.match(e) || !(!t.gmatcher || !t.gmatcher.match(e));
                });
            }
        },
        331: (t, e, s) => {
            t.exports = d;
            d.GlobSync = f;
            var i = s(836);
            var r = s(27);
            r.Minimatch;
            s(734).Glob;
            s(23);
            var n = s(928);
            var o = s(613);
            var a = s(641);
            var h = s(293);
            var c = h.setopts;
            var l = h.ownProp;
            var u = h.childrenIgnored;
            var p = h.isIgnored;
            function d(t, e) {
                if (typeof e == "function" || arguments.length === 3) {
                    throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
                }
                return new f(t, e).found;
            }
            function f(t, e) {
                if (!t) {
                    throw new Error("must provide pattern");
                }
                if (typeof e == "function" || arguments.length === 3) {
                    throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
                }
                if (!(this instanceof f)) {
                    return new f(t, e);
                }
                c(this, t, e);
                if (this.noprocess) {
                    return this;
                }
                var s = this.minimatch.set.length;
                this.matches = new Array(s);
                for (var i = 0; i < s; i++) {
                    this._process(this.minimatch.set[i], i, false);
                }
                this._finish();
            }
            f.prototype._finish = function () {
                o.ok(this instanceof f);
                if (this.realpath) {
                    var t = this;
                    this.matches.forEach(function (e, s) {
                        var r = t.matches[s] = Object.create(null);
                        for (var n in e) {
                            try {
                                n = t._makeAbs(n);
                                r[i.realpathSync(n, t.realpathCache)] = true;
                            } catch (e) {
                                if (e.syscall !== "stat") {
                                    throw e;
                                }
                                r[t._makeAbs(n)] = true;
                            }
                        }
                    });
                }
                h.finish(this);
            };
            f.prototype._process = function (t, e, s) {
                o.ok(this instanceof f);
                for (var i, n = 0; typeof t[n] == "string";) {
                    n++;
                }
                switch (n) {
                    case t.length:
                        this._processSimple(t.join("/"), e);
                        return;
                    case 0:
                        i = null;
                        break;
                    default:
                        i = t.slice(0, n).join("/");
                }
                var h;
                var c = t.slice(n);
                if (i === null) {
                    h = ".";
                } else if (a(i) || a(t.map(function (t) {
                    if (typeof t == "string") {
                        return t;
                    } else {
                        return "[*]";
                    }
                }).join("/"))) {
                    if (!(i && a(i))) {
                        i = "/" + i;
                    }
                    h = i;
                } else {
                    h = i;
                }
                var l = this._makeAbs(h);
                if (!u(this, h)) {
                    if (c[0] === r.GLOBSTAR) {
                        this._processGlobStar(i, h, l, c, e, s);
                    } else {
                        this._processReaddir(i, h, l, c, e, s);
                    }
                }
            };
            f.prototype._processReaddir = function (t, e, s, i, r, o) {
                var a = this._readdir(s, o);
                if (a) {
                    for (var h = i[0], c = !!this.minimatch.negate, l = h._glob, u = this.dot || l.charAt(0) === ".", p = [], d = 0; d < a.length; d++) {
                        if (((m = a[d]).charAt(0) !== "." || u) && (c && !t ? !m.match(h) : m.match(h))) {
                            p.push(m);
                        }
                    }
                    var f = p.length;
                    if (f !== 0) {
                        if (i.length !== 1 || this.mark || this.stat) {
                            i.shift();
                            d = 0;
                            i.shift();
                            d = 0;
                            for (; d < f; d++) {
                                var g;
                                m = p[d];
                                g = t ? [t, m] : [m];
                                this._process(g.concat(i), r, o);
                            }
                        } else {
                            if (!this.matches[r]) {
                                this.matches[r] = Object.create(null);
                            }
                            for (d = 0; d < f; d++) {
                                var m = p[d];
                                if (t) {
                                    m = t.slice(-1) !== "/" ? t + "/" + m : t + m;
                                }
                                if (!(m.charAt(0) !== "/" || this.nomount)) {
                                    m = n.join(this.root, m);
                                }
                                this._emitMatch(r, m);
                            }
                        }
                    }
                }
            };
            f.prototype._emitMatch = function (t, e) {
                if (!p(this, e)) {
                    var s = this._makeAbs(e);
                    if (this.mark) {
                        e = this._mark(e);
                    }
                    if (this.absolute) {
                        e = s;
                    }
                    if (!this.matches[t][e]) {
                        if (this.nodir) {
                            var i = this.cache[s];
                            if (i === "DIR" || Array.isArray(i)) {
                                return;
                            }
                        }
                        this.matches[t][e] = true;
                        if (this.stat) {
                            this._stat(e);
                        }
                    }
                }
            };
            f.prototype._readdirInGlobStar = function (t) {
                if (this.follow) {
                    return this._readdir(t, false);
                }
                var e;
                var s;
                try {
                    s = this.fs.lstatSync(t);
                } catch (t) {
                    if (t.code === "ENOENT") {
                        return null;
                    }
                }
                var i = s && s.isSymbolicLink();
                this.symlinks[t] = i;
                if (i || !s || s.isDirectory()) {
                    e = this._readdir(t, false);
                } else {
                    this.cache[t] = "FILE";
                }
                return e;
            };
            f.prototype._readdir = function (t, e) {
                if (e && !l(this.symlinks, t)) {
                    return this._readdirInGlobStar(t);
                }
                if (l(this.cache, t)) {
                    var s = this.cache[t];
                    if (!s || s === "FILE") {
                        return null;
                    }
                    if (Array.isArray(s)) {
                        return s;
                    }
                }
                try {
                    return this._readdirEntries(t, this.fs.readdirSync(t));
                } catch (e) {
                    this._readdirError(t, e);
                    return null;
                }
            };
            f.prototype._readdirEntries = function (t, e) {
                if (!this.mark && !this.stat) {
                    for (var s = 0; s < e.length; s++) {
                        var i = e[s];
                        i = t === "/" ? t + i : t + "/" + i;
                        this.cache[i] = true;
                    }
                }
                this.cache[t] = e;
                return e;
            };
            f.prototype._readdirError = function (t, e) {
                switch (e.code) {
                    case "ENOTSUP":
                    case "ENOTDIR":
                        var s = this._makeAbs(t);
                        this.cache[s] = "FILE";
                        if (s === this.cwdAbs) {
                            var i = new Error(e.code + " invalid cwd " + this.cwd);
                            i.path = this.cwd;
                            i.code = e.code;
                            throw i;
                        }
                        break;
                    case "ENOENT":
                    case "ELOOP":
                    case "ENAMETOOLONG":
                    case "UNKNOWN":
                        this.cache[this._makeAbs(t)] = false;
                        break;
                    default:
                        this.cache[this._makeAbs(t)] = false;
                        if (this.strict) {
                            throw e;
                        }
                        if (!this.silent) {
                            console.error("glob error", e);
                        }
                }
            };
            f.prototype._processGlobStar = function (t, e, s, i, r, n) {
                var o = this._readdir(s, n);
                if (o) {
                    var a = i.slice(1);
                    var h = t ? [t] : [];
                    var c = h.concat(a);
                    this._process(c, r, false);
                    var l = o.length;
                    if (!this.symlinks[s] || !n) {
                        for (var u = 0; u < l; u++) {
                            if (o[u].charAt(0) !== "." || this.dot) {
                                var p = h.concat(o[u], a);
                                this._process(p, r, true);
                                var d = h.concat(o[u], i);
                                this._process(d, r, true);
                            }
                        }
                    }
                }
            };
            f.prototype._processSimple = function (t, e) {
                var s = this._stat(t);
                if (!this.matches[e]) {
                    this.matches[e] = Object.create(null);
                }
                if (s) {
                    if (t && a(t) && !this.nomount) {
                        var i = /[\/\\]$/.test(t);
                        if (t.charAt(0) === "/") {
                            t = n.join(this.root, t);
                        } else {
                            t = n.resolve(this.root, t);
                            if (i) {
                                t += "/";
                            }
                        }
                    }
                    if (process.platform === "win32") {
                        t = t.replace(/\\/g, "/");
                    }
                    this._emitMatch(e, t);
                }
            };
            f.prototype._stat = function (t) {
                var e = this._makeAbs(t);
                var s = t.slice(-1) === "/";
                if (t.length > this.maxLength) {
                    return false;
                }
                if (!this.stat && l(this.cache, e)) {
                    var i = this.cache[e];
                    if (Array.isArray(i)) {
                        i = "DIR";
                    }
                    if (!s || i === "DIR") {
                        return i;
                    }
                    if (s && i === "FILE") {
                        return false;
                    }
                }
                var r = this.statCache[e];
                if (!r) {
                    var n;
                    try {
                        n = this.fs.lstatSync(e);
                    } catch (t) {
                        if (t && (t.code === "ENOENT" || t.code === "ENOTDIR")) {
                            this.statCache[e] = false;
                            return false;
                        }
                    }
                    if (n && n.isSymbolicLink()) {
                        try {
                            r = this.fs.statSync(e);
                        } catch (t) {
                            r = n;
                        }
                    } else {
                        r = n;
                    }
                }
                this.statCache[e] = r;
                i = true;
                if (r) {
                    i = r.isDirectory() ? "DIR" : "FILE";
                }
                this.cache[e] = this.cache[e] || i;
                return (!s || i !== "FILE") && i;
            };
            f.prototype._mark = function (t) {
                return h.mark(this, t);
            };
            f.prototype._makeAbs = function (t) {
                return h.makeAbs(this, t);
            };
        },
        398: t => {
            "use strict";

            t.exports = require("vscode");
        },
        420: function (t, e, s) {
            "use strict";

            var i = this && this.__importDefault || function (t) {
                if (t && t.__esModule) {
                    return t;
                } else {
                    return {
                        default: t
                    };
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Minipass = e.isWritable = e.isReadable = e.isStream = undefined;
            const r = typeof process == "object" && process ? process : {
                stdout: null,
                stderr: null
            };
            const n = s(474);
            const o = i(s(75));
            const a = s(193);
            e.isStream = t => !!t && typeof t == "object" && (t instanceof $ || t instanceof o.default || (0, e.isReadable)(t) || (0, e.isWritable)(t));
            e.isReadable = t => !!t && typeof t == "object" && t instanceof n.EventEmitter && typeof t.pipe == "function" && t.pipe !== o.default.Writable.prototype.pipe;
            e.isWritable = t => !!t && typeof t == "object" && t instanceof n.EventEmitter && typeof t.write == "function" && typeof t.end == "function";
            const h = Symbol("EOF");
            const c = Symbol("maybeEmitEnd");
            const l = Symbol("emittedEnd");
            const u = Symbol("emittingEnd");
            const p = Symbol("emittedError");
            const d = Symbol("closed");
            const f = Symbol("read");
            const g = Symbol("flush");
            const m = Symbol("flushChunk");
            const y = Symbol("encoding");
            const w = Symbol("decoder");
            const b = Symbol("flowing");
            const v = Symbol("paused");
            const S = Symbol("resume");
            const k = Symbol("buffer");
            const E = Symbol("pipes");
            const x = Symbol("bufferLength");
            const O = Symbol("bufferPush");
            const _ = Symbol("bufferShift");
            const T = Symbol("objectMode");
            const A = Symbol("destroyed");
            const M = Symbol("error");
            const L = Symbol("emitData");
            const C = Symbol("emitEnd");
            const P = Symbol("emitEnd2");
            const N = Symbol("async");
            const j = Symbol("abort");
            const R = Symbol("aborted");
            const F = Symbol("signal");
            const D = Symbol("dataListeners");
            const I = Symbol("discarded");
            const z = t => Promise.resolve().then(t);
            const B = t => t();
            class W {
                src;
                dest;
                opts;
                ondrain;
                constructor(t, e, s) {
                    this.src = t;
                    this.dest = e;
                    this.opts = s;
                    this.ondrain = () => t[S]();
                    this.dest.on("drain", this.ondrain);
                }
                unpipe() {
                    this.dest.removeListener("drain", this.ondrain);
                }
                proxyErrors(t) { }
                end() {
                    this.unpipe();
                    if (this.opts.end) {
                        this.dest.end();
                    }
                }
            }
            class G extends W {
                unpipe() {
                    this.src.removeListener("error", this.proxyErrors);
                    super.unpipe();
                }
                constructor(t, e, s) {
                    super(t, e, s);
                    this.proxyErrors = t => e.emit("error", t);
                    t.on("error", this.proxyErrors);
                }
            }
            class $ extends n.EventEmitter {
                [b] = false;
                [v] = false;
                [E] = [];
                [k] = [];
                [T];
                [y];
                [N];
                [w];
                [h] = false;
                [l] = false;
                [u] = false;
                [d] = false;
                [p] = null;
                [x] = 0;
                [A] = false;
                [F];
                [R] = false;
                [D] = 0;
                [I] = false;
                writable = true;
                readable = true;
                constructor(...t) {
                    const e = t[0] || {};
                    super();
                    if (e.objectMode && typeof e.encoding == "string") {
                        throw new TypeError("Encoding and objectMode may not be used together");
                    }
                    var s;
                    if (e.objectMode) {
                        this[T] = true;
                        this[y] = null;
                    } else if (!(s = e).objectMode && s.encoding && s.encoding !== "buffer") {
                        this[y] = e.encoding;
                        this[T] = false;
                    } else {
                        this[T] = false;
                        this[y] = null;
                    }
                    this[N] = !!e.async;
                    this[w] = this[y] ? new a.StringDecoder(this[y]) : null;
                    if (e && e.debugExposeBuffer === true) {
                        Object.defineProperty(this, "buffer", {
                            get: () => this[k]
                        });
                    }
                    if (e && e.debugExposePipes === true) {
                        Object.defineProperty(this, "pipes", {
                            get: () => this[E]
                        });
                    }
                    const {
                        signal: i
                    } = e;
                    if (i) {
                        this[F] = i;
                        if (i.aborted) {
                            this[j]();
                        } else {
                            i.addEventListener("abort", () => this[j]());
                        }
                    }
                }
                get bufferLength() {
                    return this[x];
                }
                get encoding() {
                    return this[y];
                }
                set encoding(t) {
                    throw new Error("Encoding must be set at instantiation time");
                }
                setEncoding(t) {
                    throw new Error("Encoding must be set at instantiation time");
                }
                get objectMode() {
                    return this[T];
                }
                set objectMode(t) {
                    throw new Error("objectMode must be set at instantiation time");
                }
                get async() {
                    return this[N];
                }
                set async(t) {
                    this[N] = this[N] || !!t;
                }
                [j]() {
                    this[R] = true;
                    this.emit("abort", this[F]?.reason);
                    this.destroy(this[F]?.reason);
                }
                get aborted() {
                    return this[R];
                }
                set aborted(t) { }
                write(t, e, s) {
                    if (this[R]) {
                        return false;
                    }
                    if (this[h]) {
                        throw new Error("write after end");
                    }
                    if (this[A]) {
                        this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), {
                            code: "ERR_STREAM_DESTROYED"
                        }));
                        return true;
                    }
                    if (typeof e == "function") {
                        s = e;
                        e = "utf8";
                    }
                    if (!e) {
                        e = "utf8";
                    }
                    const i = this[N] ? z : B;
                    if (!this[T] && !Buffer.isBuffer(t)) {
                        r = t;
                        if (!Buffer.isBuffer(r) && ArrayBuffer.isView(r)) {
                            t = Buffer.from(t.buffer, t.byteOffset, t.byteLength);
                        } else if ((t => t instanceof ArrayBuffer || !!t && typeof t == "object" && t.constructor && t.constructor.name === "ArrayBuffer" && t.byteLength >= 0)(t)) {
                            t = Buffer.from(t);
                        } else if (typeof t != "string") {
                            throw new Error("Non-contiguous data written to non-objectMode stream");
                        }
                    }
                    var r;
                    if (this[T]) {
                        if (this[b] && this[x] !== 0) {
                            this[g](true);
                        }
                        if (this[b]) {
                            this.emit("data", t);
                        } else {
                            this[O](t);
                        }
                        if (this[x] !== 0) {
                            this.emit("readable");
                        }
                        if (s) {
                            i(s);
                        }
                        return this[b];
                    } else if (t.length) {
                        if (!(typeof t != "string" || e === this[y] && !this[w]?.lastNeed)) {
                            t = Buffer.from(t, e);
                        }
                        if (Buffer.isBuffer(t) && this[y]) {
                            t = this[w].write(t);
                        }
                        if (this[b] && this[x] !== 0) {
                            this[g](true);
                        }
                        if (this[b]) {
                            this.emit("data", t);
                        } else {
                            this[O](t);
                        }
                        if (this[x] !== 0) {
                            this.emit("readable");
                        }
                        if (s) {
                            i(s);
                        }
                        return this[b];
                    } else {
                        if (this[x] !== 0) {
                            this.emit("readable");
                        }
                        if (s) {
                            i(s);
                        }
                        return this[b];
                    }
                }
                read(t) {
                    if (this[A]) {
                        return null;
                    }
                    this[I] = false;
                    if (this[x] === 0 || t === 0 || t && t > this[x]) {
                        this[c]();
                        return null;
                    }
                    if (this[T]) {
                        t = null;
                    }
                    if (this[k].length > 1 && !this[T]) {
                        this[k] = [this[y] ? this[k].join("") : Buffer.concat(this[k], this[x])];
                    }
                    const e = this[f](t || null, this[k][0]);
                    this[c]();
                    return e;
                }
                [f](t, e) {
                    if (this[T]) {
                        this[_]();
                    } else {
                        const s = e;
                        if (t === s.length || t === null) {
                            this[_]();
                        } else if (typeof s == "string") {
                            this[k][0] = s.slice(t);
                            e = s.slice(0, t);
                            this[x] -= t;
                        } else {
                            this[k][0] = s.subarray(t);
                            e = s.subarray(0, t);
                            this[x] -= t;
                        }
                    }
                    this.emit("data", e);
                    if (!(this[k].length || this[h])) {
                        this.emit("drain");
                    }
                    return e;
                }
                end(t, e, s) {
                    if (typeof t == "function") {
                        s = t;
                        t = undefined;
                    }
                    if (typeof e == "function") {
                        s = e;
                        e = "utf8";
                    }
                    if (t !== undefined) {
                        this.write(t, e);
                    }
                    if (s) {
                        this.once("end", s);
                    }
                    this[h] = true;
                    this.writable = false;
                    if (!(!this[b] && this[v])) {
                        this[c]();
                    }
                    return this;
                }
                [S]() {
                    if (!this[A]) {
                        if (!(this[D] || this[E].length)) {
                            this[I] = true;
                        }
                        this[v] = false;
                        this[b] = true;
                        this.emit("resume");
                        if (this[k].length) {
                            this[g]();
                        } else if (this[h]) {
                            this[c]();
                        } else {
                            this.emit("drain");
                        }
                    }
                }
                resume() {
                    return this[S]();
                }
                pause() {
                    this[b] = false;
                    this[v] = true;
                    this[I] = false;
                }
                get destroyed() {
                    return this[A];
                }
                get flowing() {
                    return this[b];
                }
                get paused() {
                    return this[v];
                }
                [O](t) {
                    if (this[T]) {
                        this[x] += 1;
                    } else {
                        this[x] += t.length;
                    }
                    this[k].push(t);
                }
                [_]() {
                    if (this[T]) {
                        this[x] -= 1;
                    } else {
                        this[x] -= this[k][0].length;
                    }
                    return this[k].shift();
                }
                [g](t = false) {
                    do { } while (this[m](this[_]()) && this[k].length);
                    if (!(t || this[k].length || this[h])) {
                        this.emit("drain");
                    }
                }
                [m](t) {
                    this.emit("data", t);
                    return this[b];
                }
                pipe(t, e) {
                    if (this[A]) {
                        return t;
                    }
                    this[I] = false;
                    const s = this[l];
                    e = e || {};
                    if (t === r.stdout || t === r.stderr) {
                        e.end = false;
                    } else {
                        e.end = e.end !== false;
                    }
                    e.proxyErrors = !!e.proxyErrors;
                    if (s) {
                        if (e.end) {
                            t.end();
                        }
                    } else {
                        this[E].push(e.proxyErrors ? new G(this, t, e) : new W(this, t, e));
                        if (this[N]) {
                            z(() => this[S]());
                        } else {
                            this[S]();
                        }
                    }
                    return t;
                }
                unpipe(t) {
                    const e = this[E].find(e => e.dest === t);
                    if (e) {
                        if (this[E].length === 1) {
                            if (this[b] && this[D] === 0) {
                                this[b] = false;
                            }
                            this[E] = [];
                        } else {
                            this[E].splice(this[E].indexOf(e), 1);
                        }
                        e.unpipe();
                    }
                }
                addListener(t, e) {
                    return this.on(t, e);
                }
                on(t, e) {
                    const s = super.on(t, e);
                    if (t === "data") {
                        this[I] = false;
                        this[D]++;
                        if (!(this[E].length || this[b])) {
                            this[S]();
                        }
                    } else if (t === "readable" && this[x] !== 0) {
                        super.emit("readable");
                    } else if ((t => t === "end" || t === "finish" || t === "prefinish")(t) && this[l]) {
                        super.emit(t);
                        this.removeAllListeners(t);
                    } else if (t === "error" && this[p]) {
                        const t = e;
                        if (this[N]) {
                            z(() => t.call(this, this[p]));
                        } else {
                            t.call(this, this[p]);
                        }
                    }
                    return s;
                }
                removeListener(t, e) {
                    return this.off(t, e);
                }
                off(t, e) {
                    const s = super.off(t, e);
                    if (t === "data") {
                        this[D] = this.listeners("data").length;
                        if (!(this[D] !== 0 || this[I] || this[E].length)) {
                            this[b] = false;
                        }
                    }
                    return s;
                }
                removeAllListeners(t) {
                    const e = super.removeAllListeners(t);
                    if (!(t !== "data" && t !== undefined)) {
                        this[D] = 0;
                        if (!(this[I] || this[E].length)) {
                            this[b] = false;
                        }
                    }
                    return e;
                }
                get emittedEnd() {
                    return this[l];
                }
                [c]() {
                    if (!(this[u] || this[l] || this[A] || this[k].length !== 0 || !this[h])) {
                        this[u] = true;
                        this.emit("end");
                        this.emit("prefinish");
                        this.emit("finish");
                        if (this[d]) {
                            this.emit("close");
                        }
                        this[u] = false;
                    }
                }
                emit(t, ...e) {
                    const s = e[0];
                    if (t !== "error" && t !== "close" && t !== A && this[A]) {
                        return false;
                    }
                    if (t === "data") {
                        return !(!this[T] && !s) && (this[N] ? (z(() => this[L](s)), true) : this[L](s));
                    }
                    if (t === "end") {
                        return this[C]();
                    }
                    if (t === "close") {
                        this[d] = true;
                        if (!this[l] && !this[A]) {
                            return false;
                        }
                        const t = super.emit("close");
                        this.removeAllListeners("close");
                        return t;
                    }
                    if (t === "error") {
                        this[p] = s;
                        super.emit(M, s);
                        const t = !(this[F] && !this.listeners("error").length) && super.emit("error", s);
                        this[c]();
                        return t;
                    }
                    if (t === "resume") {
                        const t = super.emit("resume");
                        this[c]();
                        return t;
                    }
                    if (t === "finish" || t === "prefinish") {
                        const e = super.emit(t);
                        this.removeAllListeners(t);
                        return e;
                    }
                    const i = super.emit(t, ...e);
                    this[c]();
                    return i;
                }
                [L](t) {
                    for (const e of this[E]) {
                        if (e.dest.write(t) === false) {
                            this.pause();
                        }
                    }
                    const e = !this[I] && super.emit("data", t);
                    this[c]();
                    return e;
                }
                [C]() {
                    return !this[l] && (this[l] = true, this.readable = false, this[N] ? (z(() => this[P]()), true) : this[P]());
                }
                [P]() {
                    if (this[w]) {
                        const t = this[w].end();
                        if (t) {
                            for (const e of this[E]) {
                                e.dest.write(t);
                            }
                            if (!this[I]) {
                                super.emit("data", t);
                            }
                        }
                    }
                    for (const t of this[E]) {
                        t.end();
                    }
                    const t = super.emit("end");
                    this.removeAllListeners("end");
                    return t;
                }
                async collect() {
                    const t = Object.assign([], {
                        dataLength: 0
                    });
                    if (!this[T]) {
                        t.dataLength = 0;
                    }
                    const e = this.promise();
                    this.on("data", e => {
                        t.push(e);
                        if (!this[T]) {
                            t.dataLength += e.length;
                        }
                    });
                    await e;
                    return t;
                }
                async concat() {
                    if (this[T]) {
                        throw new Error("cannot concat in objectMode");
                    }
                    const t = await this.collect();
                    if (this[y]) {
                        return t.join("");
                    } else {
                        return Buffer.concat(t, t.dataLength);
                    }
                }
                async promise() {
                    return new Promise((t, e) => {
                        this.on(A, () => e(new Error("stream destroyed")));
                        this.on("error", t => e(t));
                        this.on("end", () => t());
                    });
                }
                [Symbol.asyncIterator]() {
                    this[I] = false;
                    let t = false;
                    const e = async () => {
                        this.pause();
                        t = true;
                        return {
                            value: undefined,
                            done: true
                        };
                    };
                    return {
                        next: () => {
                            if (t) {
                                return e();
                            }
                            const s = this.read();
                            if (s !== null) {
                                return Promise.resolve({
                                    done: false,
                                    value: s
                                });
                            }
                            if (this[h]) {
                                return e();
                            }
                            let i;
                            let r;
                            const n = t => {
                                this.off("data", o);
                                this.off("end", a);
                                this.off(A, c);
                                e();
                                r(t);
                            };
                            const o = t => {
                                this.off("error", n);
                                this.off("end", a);
                                this.off(A, c);
                                this.pause();
                                i({
                                    value: t,
                                    done: !!this[h]
                                });
                            };
                            const a = () => {
                                this.off("error", n);
                                this.off("data", o);
                                this.off(A, c);
                                e();
                                i({
                                    done: true,
                                    value: undefined
                                });
                            };
                            const c = () => n(new Error("stream destroyed"));
                            return new Promise((t, e) => {
                                r = e;
                                i = t;
                                this.once(A, c);
                                this.once("error", n);
                                this.once("end", a);
                                this.once("data", o);
                            });
                        },
                        throw: e,
                        return: e,
                        [Symbol.asyncIterator]() {
                            return this;
                        }
                    };
                }
                [Symbol.iterator]() {
                    this[I] = false;
                    let t = false;
                    const e = () => {
                        this.pause();
                        this.off(M, e);
                        this.off(A, e);
                        this.off("end", e);
                        t = true;
                        return {
                            done: true,
                            value: undefined
                        };
                    };
                    this.once("end", e);
                    this.once(M, e);
                    this.once(A, e);
                    return {
                        next: () => {
                            if (t) {
                                return e();
                            }
                            const s = this.read();
                            if (s === null) {
                                return e();
                            } else {
                                return {
                                    done: false,
                                    value: s
                                };
                            }
                        },
                        throw: e,
                        return: e,
                        [Symbol.iterator]() {
                            return this;
                        }
                    };
                }
                destroy(t) {
                    if (this[A]) {
                        if (t) {
                            this.emit("error", t);
                        } else {
                            this.emit(A);
                        }
                        return this;
                    } else {
                        this[A] = true;
                        this[I] = true;
                        this[k].length = 0;
                        this[x] = 0;
                        if (!(typeof this.close != "function" || this[d])) {
                            this.close();
                        }
                        if (t) {
                            this.emit("error", t);
                        } else {
                            this.emit(A);
                        }
                        return this;
                    }
                }
                static get isStream() {
                    return e.isStream;
                }
            }
            e.Minipass = $;
        },
        422: (t, e, s) => {
            var i = s(505);
            t.exports = function (t) {
                if (t) {
                    if (t.substr(0, 2) === "{}") {
                        t = "\\{\\}" + t.substr(2);
                    }
                    return m(function (t) {
                        return t.split("\\\\").join(r).split("\\{").join(n).split("\\}").join(o).split("\\,").join(a).split("\\.").join(h);
                    }(t), true).map(l);
                } else {
                    return [];
                }
            };
            var r = "\0SLASH" + Math.random() + "\0";
            var n = "\0OPEN" + Math.random() + "\0";
            var o = "\0CLOSE" + Math.random() + "\0";
            var a = "\0COMMA" + Math.random() + "\0";
            var h = "\0PERIOD" + Math.random() + "\0";
            function c(t) {
                if (parseInt(t, 10) == t) {
                    return parseInt(t, 10);
                } else {
                    return t.charCodeAt(0);
                }
            }
            function l(t) {
                return t.split(r).join("\\").split(n).join("{").split(o).join("}").split(a).join(",").split(h).join(".");
            }
            function u(t) {
                if (!t) {
                    return [""];
                }
                var e = [];
                var s = i("{", "}", t);
                if (!s) {
                    return t.split(",");
                }
                var r = s.pre;
                var n = s.body;
                var o = s.post;
                var a = r.split(",");
                a[a.length - 1] += "{" + n + "}";
                var h = u(o);
                if (o.length) {
                    a[a.length - 1] += h.shift();
                    a.push.apply(a, h);
                }
                e.push.apply(e, a);
                return e;
            }
            function p(t) {
                return "{" + t + "}";
            }
            function d(t) {
                return /^-?0\d/.test(t);
            }
            function f(t, e) {
                return t <= e;
            }
            function g(t, e) {
                return t >= e;
            }
            function m(t, e) {
                var s = [];
                var r = i("{", "}", t);
                if (!r) {
                    return [t];
                }
                var n = r.pre;
                var a = r.post.length ? m(r.post, false) : [""];
                if (/\$$/.test(r.pre)) {
                    for (var h = 0; h < a.length; h++) {
                        var l = n + "{" + r.body + "}" + a[h];
                        s.push(l);
                    }
                } else {
                    var y;
                    var w;
                    var b = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(r.body);
                    var v = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(r.body);
                    var S = b || v;
                    var k = r.body.indexOf(",") >= 0;
                    if (!S && !k) {
                        if (r.post.match(/,.*\}/)) {
                            return m(t = r.pre + "{" + r.body + o + r.post);
                        } else {
                            return [t];
                        }
                    }
                    if (S) {
                        y = r.body.split(/\.\./);
                    } else if ((y = u(r.body)).length === 1 && (y = m(y[0], false).map(p)).length === 1) {
                        return a.map(function (t) {
                            return r.pre + y[0] + t;
                        });
                    }
                    if (S) {
                        var E = c(y[0]);
                        var x = c(y[1]);
                        var O = Math.max(y[0].length, y[1].length);
                        var _ = y.length == 3 ? Math.abs(c(y[2])) : 1;
                        var T = f;
                        if (x < E) {
                            _ *= -1;
                            T = g;
                        }
                        var A = y.some(d);
                        w = [];
                        for (var M = E; T(M, x); M += _) {
                            var L;
                            if (v) {
                                if ((L = String.fromCharCode(M)) === "\\") {
                                    L = "";
                                }
                            } else {
                                L = String(M);
                                if (A) {
                                    var C = O - L.length;
                                    if (C > 0) {
                                        var P = new Array(C + 1).join("0");
                                        L = M < 0 ? "-" + P + L.slice(1) : P + L;
                                    }
                                }
                            }
                            w.push(L);
                        }
                    } else {
                        w = [];
                        for (var N = 0; N < y.length; N++) {
                            w.push.apply(w, m(y[N], false));
                        }
                    }
                    for (N = 0; N < w.length; N++) {
                        for (h = 0; h < a.length; h++) {
                            l = n + w[N] + a[h];
                            if (!e || S || l) {
                                s.push(l);
                            }
                        }
                    }
                }
                return s;
            }
        },
        423: (t, e, s) => {
            var i = s(587);
            var r = Object.create(null);
            var n = s(519);
            t.exports = i(function (t, e) {
                if (r[t]) {
                    r[t].push(e);
                    return null;
                } else {
                    r[t] = [e];
                    return function (t) {
                        return n(function e() {
                            var s = r[t];
                            var i = s.length;
                            var n = function (t) {
                                for (var e = t.length, s = [], i = 0; i < e; i++) {
                                    s[i] = t[i];
                                }
                                return s;
                            }(arguments);
                            try {
                                for (var o = 0; o < i; o++) {
                                    s[o].apply(null, n);
                                }
                            } finally {
                                if (s.length > i) {
                                    s.splice(0, i);
                                    process.nextTick(function () {
                                        e.apply(null, n);
                                    });
                                } else {
                                    delete r[t];
                                }
                            }
                        });
                    }(t);
                }
            });
        },
        434: t => {
            "use strict";

            t.exports = require("events");
        },
        455: t => {
            "use strict";

            t.exports = require("node:fs/promises");
        },
        474: t => {
            "use strict";

            t.exports = require("node:events");
        },
        478: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Pattern = undefined;
            const i = s(144);
            class r {
                #rt;
                #nt;
                #ot;
                length;
                #at;
                #ht;
                #ct;
                #lt;
                #ut;
                #pt;
                #dt = true;
                constructor(t, e, s, i) {
                    if (!(t.length >= 1)) {
                        throw new TypeError("empty pattern list");
                    }
                    if (!(e.length >= 1)) {
                        throw new TypeError("empty glob list");
                    }
                    if (e.length !== t.length) {
                        throw new TypeError("mismatched pattern list and glob list lengths");
                    }
                    this.length = t.length;
                    if (s < 0 || s >= this.length) {
                        throw new TypeError("index out of range");
                    }
                    this.#rt = t;
                    this.#nt = e;
                    this.#ot = s;
                    this.#at = i;
                    if (this.#ot === 0) {
                        if (this.isUNC()) {
                            const [t, e, s, i, ...r] = this.#rt;
                            const [n, o, a, h, ...c] = this.#nt;
                            if (r[0] === "") {
                                r.shift();
                                c.shift();
                            }
                            const l = [t, e, s, i, ""].join("/");
                            const u = [n, o, a, h, ""].join("/");
                            this.#rt = [l, ...r];
                            this.#nt = [u, ...c];
                            this.length = this.#rt.length;
                        } else if (this.isDrive() || this.isAbsolute()) {
                            const [t, ...e] = this.#rt;
                            const [s, ...i] = this.#nt;
                            if (e[0] === "") {
                                e.shift();
                                i.shift();
                            }
                            const r = t + "/";
                            const n = s + "/";
                            this.#rt = [r, ...e];
                            this.#nt = [n, ...i];
                            this.length = this.#rt.length;
                        }
                    }
                }
                pattern() {
                    return this.#rt[this.#ot];
                }
                isString() {
                    return typeof this.#rt[this.#ot] == "string";
                }
                isGlobstar() {
                    return this.#rt[this.#ot] === i.GLOBSTAR;
                }
                isRegExp() {
                    return this.#rt[this.#ot] instanceof RegExp;
                }
                globString() {
                    return this.#ct = this.#ct || (this.#ot === 0 ? this.isAbsolute() ? this.#nt[0] + this.#nt.slice(1).join("/") : this.#nt.join("/") : this.#nt.slice(this.#ot).join("/"));
                }
                hasMore() {
                    return this.length > this.#ot + 1;
                }
                rest() {
                    if (this.#ht !== undefined) {
                        return this.#ht;
                    } else if (this.hasMore()) {
                        this.#ht = new r(this.#rt, this.#nt, this.#ot + 1, this.#at);
                        this.#ht.#pt = this.#pt;
                        this.#ht.#ut = this.#ut;
                        this.#ht.#lt = this.#lt;
                        return this.#ht;
                    } else {
                        return this.#ht = null;
                    }
                }
                isUNC() {
                    const t = this.#rt;
                    if (this.#ut !== undefined) {
                        return this.#ut;
                    } else {
                        return this.#ut = this.#at === "win32" && this.#ot === 0 && t[0] === "" && t[1] === "" && typeof t[2] == "string" && !!t[2] && typeof t[3] == "string" && !!t[3];
                    }
                }
                isDrive() {
                    const t = this.#rt;
                    if (this.#lt !== undefined) {
                        return this.#lt;
                    } else {
                        return this.#lt = this.#at === "win32" && this.#ot === 0 && this.length > 1 && typeof t[0] == "string" && /^[a-z]:$/i.test(t[0]);
                    }
                }
                isAbsolute() {
                    const t = this.#rt;
                    if (this.#pt !== undefined) {
                        return this.#pt;
                    } else {
                        return this.#pt = t[0] === "" && t.length > 1 || this.isDrive() || this.isUNC();
                    }
                }
                root() {
                    const t = this.#rt[0];
                    if (typeof t == "string" && this.isAbsolute() && this.#ot === 0) {
                        return t;
                    } else {
                        return "";
                    }
                }
                checkFollowGlobstar() {
                    return !(this.#ot === 0 || !this.isGlobstar() || !this.#dt);
                }
                markFollowGlobstar() {
                    return !(this.#ot === 0 || !this.isGlobstar() || !this.#dt || (this.#dt = false, 0));
                }
            }
            e.Pattern = r;
        },
        496: (t, e) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.assertValidPattern = undefined;
            e.assertValidPattern = t => {
                if (typeof t != "string") {
                    throw new TypeError("invalid pattern");
                }
                if (t.length > 65536) {
                    throw new TypeError("pattern is too long");
                }
            };
        },
        505: t => {
            "use strict";

            function e(t, e, r) {
                if (t instanceof RegExp) {
                    t = s(t, r);
                }
                if (e instanceof RegExp) {
                    e = s(e, r);
                }
                var n = i(t, e, r);
                return n && {
                    start: n[0],
                    end: n[1],
                    pre: r.slice(0, n[0]),
                    body: r.slice(n[0] + t.length, n[1]),
                    post: r.slice(n[1] + e.length)
                };
            }
            function s(t, e) {
                var s = e.match(t);
                if (s) {
                    return s[0];
                } else {
                    return null;
                }
            }
            function i(t, e, s) {
                var i;
                var r;
                var n;
                var o;
                var a;
                var h = s.indexOf(t);
                var c = s.indexOf(e, h + 1);
                var l = h;
                if (h >= 0 && c > 0) {
                    i = [];
                    n = s.length;
                    for (; l >= 0 && !a;) {
                        if (l == h) {
                            i.push(l);
                            h = s.indexOf(t, l + 1);
                        } else if (i.length == 1) {
                            a = [i.pop(), c];
                        } else {
                            if ((r = i.pop()) < n) {
                                n = r;
                                o = c;
                            }
                            c = s.indexOf(e, l + 1);
                        }
                        l = h < c && h >= 0 ? h : c;
                    }
                    if (i.length) {
                        a = [n, o];
                    }
                }
                return a;
            }
            t.exports = e;
            e.range = i;
        },
        519: (t, e, s) => {
            var i = s(587);
            function r(t) {
                function e() {
                    if (e.called) {
                        return e.value;
                    } else {
                        e.called = true;
                        return e.value = t.apply(this, arguments);
                    }
                }
                e.called = false;
                return e;
            }
            function n(t) {
                function e() {
                    if (e.called) {
                        throw new Error(e.onceError);
                    }
                    e.called = true;
                    return e.value = t.apply(this, arguments);
                }
                var s = t.name || "Function wrapped with `once`";
                e.onceError = s + " shouldn't be called more than once";
                e.called = false;
                return e;
            }
            t.exports = i(r);
            t.exports.strict = i(n);
            r.proto = r(function () {
                Object.defineProperty(Function.prototype, "once", {
                    value: function () {
                        return r(this);
                    },
                    configurable: true
                });
                Object.defineProperty(Function.prototype, "onceStrict", {
                    value: function () {
                        return n(this);
                    },
                    configurable: true
                });
            });
        },
        547: (t, e, s) => {
            var i = s(818);
            var r = s(505);
            t.exports = function (t) {
                if (t) {
                    if (t.substr(0, 2) === "{}") {
                        t = "\\{\\}" + t.substr(2);
                    }
                    return y(function (t) {
                        return t.split("\\\\").join(n).split("\\{").join(o).split("\\}").join(a).split("\\,").join(h).split("\\.").join(c);
                    }(t), true).map(u);
                } else {
                    return [];
                }
            };
            var n = "\0SLASH" + Math.random() + "\0";
            var o = "\0OPEN" + Math.random() + "\0";
            var a = "\0CLOSE" + Math.random() + "\0";
            var h = "\0COMMA" + Math.random() + "\0";
            var c = "\0PERIOD" + Math.random() + "\0";
            function l(t) {
                if (parseInt(t, 10) == t) {
                    return parseInt(t, 10);
                } else {
                    return t.charCodeAt(0);
                }
            }
            function u(t) {
                return t.split(n).join("\\").split(o).join("{").split(a).join("}").split(h).join(",").split(c).join(".");
            }
            function p(t) {
                if (!t) {
                    return [""];
                }
                var e = [];
                var s = r("{", "}", t);
                if (!s) {
                    return t.split(",");
                }
                var i = s.pre;
                var n = s.body;
                var o = s.post;
                var a = i.split(",");
                a[a.length - 1] += "{" + n + "}";
                var h = p(o);
                if (o.length) {
                    a[a.length - 1] += h.shift();
                    a.push.apply(a, h);
                }
                e.push.apply(e, a);
                return e;
            }
            function d(t) {
                return "{" + t + "}";
            }
            function f(t) {
                return /^-?0\d/.test(t);
            }
            function g(t, e) {
                return t <= e;
            }
            function m(t, e) {
                return t >= e;
            }
            function y(t, e) {
                var s = [];
                var n = r("{", "}", t);
                if (!n || /\$$/.test(n.pre)) {
                    return [t];
                }
                var o;
                var h = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(n.body);
                var c = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(n.body);
                var u = h || c;
                var w = n.body.indexOf(",") >= 0;
                if (!u && !w) {
                    if (n.post.match(/,.*\}/)) {
                        return y(t = n.pre + "{" + n.body + a + n.post);
                    } else {
                        return [t];
                    }
                }
                if (u) {
                    o = n.body.split(/\.\./);
                } else if ((o = p(n.body)).length === 1 && (o = y(o[0], false).map(d)).length === 1) {
                    return (S = n.post.length ? y(n.post, false) : [""]).map(function (t) {
                        return n.pre + o[0] + t;
                    });
                }
                var b;
                var v = n.pre;
                var S = n.post.length ? y(n.post, false) : [""];
                if (u) {
                    var k = l(o[0]);
                    var E = l(o[1]);
                    var x = Math.max(o[0].length, o[1].length);
                    var O = o.length == 3 ? Math.abs(l(o[2])) : 1;
                    var _ = g;
                    if (E < k) {
                        O *= -1;
                        _ = m;
                    }
                    var T = o.some(f);
                    b = [];
                    for (var A = k; _(A, E); A += O) {
                        var M;
                        if (c) {
                            if ((M = String.fromCharCode(A)) === "\\") {
                                M = "";
                            }
                        } else {
                            M = String(A);
                            if (T) {
                                var L = x - M.length;
                                if (L > 0) {
                                    var C = new Array(L + 1).join("0");
                                    M = A < 0 ? "-" + C + M.slice(1) : C + M;
                                }
                            }
                        }
                        b.push(M);
                    }
                } else {
                    b = i(o, function (t) {
                        return y(t, false);
                    });
                }
                for (var P = 0; P < b.length; P++) {
                    for (var N = 0; N < S.length; N++) {
                        var j = v + b[P] + S[N];
                        if (!e || u || j) {
                            s.push(j);
                        }
                    }
                }
                return s;
            }
        },
        576: function (t, e, s) {
            "use strict";

            var i = this && this.__createBinding || (Object.create ? function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                var r = Object.getOwnPropertyDescriptor(e, s);
                if (!(r && !("get" in r ? !e.__esModule : r.writable || r.configurable))) {
                    r = {
                        enumerable: true,
                        get: function () {
                            return e[s];
                        }
                    };
                }
                Object.defineProperty(t, i, r);
            } : function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                t[i] = e[s];
            });
            var r = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                });
            } : function (t, e) {
                t.default = e;
            });
            var n = this && this.__importStar || function (t) {
                if (t && t.__esModule) {
                    return t;
                }
                var e = {};
                if (t != null) {
                    for (var s in t) {
                        if (s !== "default" && Object.prototype.hasOwnProperty.call(t, s)) {
                            i(e, t, s);
                        }
                    }
                }
                r(e, t);
                return e;
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.PathScurry = e.Path = e.PathScurryDarwin = e.PathScurryPosix = e.PathScurryWin32 = e.PathScurryBase = e.PathPosix = e.PathWin32 = e.PathBase = e.ChildrenCache = e.ResolveCache = undefined;
            const o = s(96);
            const a = s(760);
            const h = s(136);
            const c = s(896);
            const l = n(s(24));
            const u = c.realpathSync.native;
            const p = s(455);
            const d = s(420);
            const f = {
                lstatSync: c.lstatSync,
                readdir: c.readdir,
                readdirSync: c.readdirSync,
                readlinkSync: c.readlinkSync,
                realpathSync: u,
                promises: {
                    lstat: p.lstat,
                    readdir: p.readdir,
                    readlink: p.readlink,
                    realpath: p.realpath
                }
            };
            const g = t => t && t !== f && t !== l ? {
                ...f,
                ...t,
                promises: {
                    ...f.promises,
                    ...(t.promises || {})
                }
            } : f;
            const m = /^\\\\\?\\([a-z]:)\\?$/i;
            const y = /[\\\/]/;
            const w = 10;
            const b = 15;
            const v = -16;
            const S = 128;
            const k = t => t.isFile() ? 8 : t.isDirectory() ? 4 : t.isSymbolicLink() ? w : t.isCharacterDevice() ? 2 : t.isBlockDevice() ? 6 : t.isSocket() ? 12 : t.isFIFO() ? 1 : 0;
            const E = new Map();
            const x = t => {
                const e = E.get(t);
                if (e) {
                    return e;
                }
                const s = t.normalize("NFKD");
                E.set(t, s);
                return s;
            };
            const O = new Map();
            const _ = t => {
                const e = O.get(t);
                if (e) {
                    return e;
                }
                const s = x(t.toLowerCase());
                O.set(t, s);
                return s;
            };
            class T extends o.LRUCache {
                constructor() {
                    super({
                        max: 256
                    });
                }
            }
            e.ResolveCache = T;
            class A extends o.LRUCache {
                constructor(t = 16384) {
                    super({
                        maxSize: t,
                        sizeCalculation: t => t.length + 1
                    });
                }
            }
            e.ChildrenCache = A;
            const M = Symbol("PathScurry setAsCwd");
            class L {
                name;
                root;
                roots;
                parent;
                nocase;
                isCWD = false;
                #ft;
                #gt;
                get dev() {
                    return this.#gt;
                }
                #mt;
                get mode() {
                    return this.#mt;
                }
                #yt;
                get nlink() {
                    return this.#yt;
                }
                #wt;
                get uid() {
                    return this.#wt;
                }
                #bt;
                get gid() {
                    return this.#bt;
                }
                #vt;
                get rdev() {
                    return this.#vt;
                }
                #St;
                get blksize() {
                    return this.#St;
                }
                #kt;
                get ino() {
                    return this.#kt;
                }
                #a;
                get size() {
                    return this.#a;
                }
                #Et;
                get blocks() {
                    return this.#Et;
                }
                #xt;
                get atimeMs() {
                    return this.#xt;
                }
                #Ot;
                get mtimeMs() {
                    return this.#Ot;
                }
                #_t;
                get ctimeMs() {
                    return this.#_t;
                }
                #Tt;
                get birthtimeMs() {
                    return this.#Tt;
                }
                #At;
                get atime() {
                    return this.#At;
                }
                #Mt;
                get mtime() {
                    return this.#Mt;
                }
                #Lt;
                get ctime() {
                    return this.#Lt;
                }
                #Ct;
                get birthtime() {
                    return this.#Ct;
                }
                #Pt;
                #Nt;
                #jt;
                #Rt;
                #Ft;
                #Dt;
                #It;
                #zt;
                #Bt;
                #Wt;
                get parentPath() {
                    return (this.parent || this).fullpath();
                }
                get path() {
                    return this.parentPath;
                }
                constructor(t, e = 0, s, i, r, n, o) {
                    this.name = t;
                    this.#Pt = r ? _(t) : x(t);
                    this.#It = e & 1023;
                    this.nocase = r;
                    this.roots = i;
                    this.root = s || this;
                    this.#zt = n;
                    this.#jt = o.fullpath;
                    this.#Ft = o.relative;
                    this.#Dt = o.relativePosix;
                    this.parent = o.parent;
                    if (this.parent) {
                        this.#ft = this.parent.#ft;
                    } else {
                        this.#ft = g(o.fs);
                    }
                }
                depth() {
                    if (this.#Nt !== undefined) {
                        return this.#Nt;
                    } else if (this.parent) {
                        return this.#Nt = this.parent.depth() + 1;
                    } else {
                        return this.#Nt = 0;
                    }
                }
                childrenCache() {
                    return this.#zt;
                }
                resolve(t) {
                    if (!t) {
                        return this;
                    }
                    const e = this.getRootString(t);
                    const s = t.substring(e.length).split(this.splitSep);
                    if (e) {
                        return this.getRoot(e).#Gt(s);
                    } else {
                        return this.#Gt(s);
                    }
                }
                #Gt(t) {
                    let e = this;
                    for (const s of t) {
                        e = e.child(s);
                    }
                    return e;
                }
                children() {
                    const t = this.#zt.get(this);
                    if (t) {
                        return t;
                    }
                    const e = Object.assign([], {
                        provisional: 0
                    });
                    this.#zt.set(this, e);
                    this.#It &= -17;
                    return e;
                }
                child(t, e) {
                    if (t === "" || t === ".") {
                        return this;
                    }
                    if (t === "..") {
                        return this.parent || this;
                    }
                    const s = this.children();
                    const i = this.nocase ? _(t) : x(t);
                    for (const t of s) {
                        if (t.#Pt === i) {
                            return t;
                        }
                    }
                    const r = this.parent ? this.sep : "";
                    const n = this.#jt ? this.#jt + r + t : undefined;
                    const o = this.newChild(t, 0, {
                        ...e,
                        parent: this,
                        fullpath: n
                    });
                    if (!this.canReaddir()) {
                        o.#It |= S;
                    }
                    s.push(o);
                    return o;
                }
                relative() {
                    if (this.isCWD) {
                        return "";
                    }
                    if (this.#Ft !== undefined) {
                        return this.#Ft;
                    }
                    const t = this.name;
                    const e = this.parent;
                    if (!e) {
                        return this.#Ft = this.name;
                    }
                    const s = e.relative();
                    return s + (s && e.parent ? this.sep : "") + t;
                }
                relativePosix() {
                    if (this.sep === "/") {
                        return this.relative();
                    }
                    if (this.isCWD) {
                        return "";
                    }
                    if (this.#Dt !== undefined) {
                        return this.#Dt;
                    }
                    const t = this.name;
                    const e = this.parent;
                    if (!e) {
                        return this.#Dt = this.fullpathPosix();
                    }
                    const s = e.relativePosix();
                    return s + (s && e.parent ? "/" : "") + t;
                }
                fullpath() {
                    if (this.#jt !== undefined) {
                        return this.#jt;
                    }
                    const t = this.name;
                    const e = this.parent;
                    if (!e) {
                        return this.#jt = this.name;
                    }
                    const s = e.fullpath() + (e.parent ? this.sep : "") + t;
                    return this.#jt = s;
                }
                fullpathPosix() {
                    if (this.#Rt !== undefined) {
                        return this.#Rt;
                    }
                    if (this.sep === "/") {
                        return this.#Rt = this.fullpath();
                    }
                    if (!this.parent) {
                        const t = this.fullpath().replace(/\\/g, "/");
                        if (/^[a-z]:\//i.test(t)) {
                            return this.#Rt = `//?/${t}`;
                        } else {
                            return this.#Rt = t;
                        }
                    }
                    const t = this.parent;
                    const e = t.fullpathPosix();
                    const s = e + (e && t.parent ? "/" : "") + this.name;
                    return this.#Rt = s;
                }
                isUnknown() {
                    return !(this.#It & b);
                }
                isType(t) {
                    return this[`is${t}`]();
                }
                getType() {
                    if (this.isUnknown()) {
                        return "Unknown";
                    } else if (this.isDirectory()) {
                        return "Directory";
                    } else if (this.isFile()) {
                        return "File";
                    } else if (this.isSymbolicLink()) {
                        return "SymbolicLink";
                    } else if (this.isFIFO()) {
                        return "FIFO";
                    } else if (this.isCharacterDevice()) {
                        return "CharacterDevice";
                    } else if (this.isBlockDevice()) {
                        return "BlockDevice";
                    } else if (this.isSocket()) {
                        return "Socket";
                    } else {
                        return "Unknown";
                    }
                }
                isFile() {
                    return (this.#It & b) == 8;
                }
                isDirectory() {
                    return (this.#It & b) == 4;
                }
                isCharacterDevice() {
                    return (this.#It & b) == 2;
                }
                isBlockDevice() {
                    return (this.#It & b) == 6;
                }
                isFIFO() {
                    return (this.#It & b) == 1;
                }
                isSocket() {
                    return (this.#It & b) == 12;
                }
                isSymbolicLink() {
                    return (this.#It & w) === w;
                }
                lstatCached() {
                    if (this.#It & 32) {
                        return this;
                    } else {
                        return undefined;
                    }
                }
                readlinkCached() {
                    return this.#Bt;
                }
                realpathCached() {
                    return this.#Wt;
                }
                readdirCached() {
                    const t = this.children();
                    return t.slice(0, t.provisional);
                }
                canReadlink() {
                    if (this.#Bt) {
                        return true;
                    }
                    if (!this.parent) {
                        return false;
                    }
                    const t = this.#It & b;
                    return !(t !== 0 && t !== w || this.#It & 256 || this.#It & S);
                }
                calledReaddir() {
                    return !!(this.#It & 16);
                }
                isENOENT() {
                    return !!(this.#It & S);
                }
                isNamed(t) {
                    if (this.nocase) {
                        return this.#Pt === _(t);
                    } else {
                        return this.#Pt === x(t);
                    }
                }
                async readlink() {
                    const t = this.#Bt;
                    if (t) {
                        return t;
                    }
                    if (this.canReadlink() && this.parent) {
                        try {
                            const t = await this.#ft.promises.readlink(this.fullpath());
                            const e = (await this.parent.realpath())?.resolve(t);
                            if (e) {
                                return this.#Bt = e;
                            }
                        } catch (t) {
                            this.#$t(t.code);
                            return;
                        }
                    }
                }
                readlinkSync() {
                    const t = this.#Bt;
                    if (t) {
                        return t;
                    }
                    if (this.canReadlink() && this.parent) {
                        try {
                            const t = this.#ft.readlinkSync(this.fullpath());
                            const e = this.parent.realpathSync()?.resolve(t);
                            if (e) {
                                return this.#Bt = e;
                            }
                        } catch (t) {
                            this.#$t(t.code);
                            return;
                        }
                    }
                }
                #Ut(t) {
                    this.#It |= 16;
                    for (let e = t.provisional; e < t.length; e++) {
                        const s = t[e];
                        if (s) {
                            s.#qt();
                        }
                    }
                }
                #qt() {
                    if (!(this.#It & S)) {
                        this.#It = (this.#It | S) & v;
                        this.#Ht();
                    }
                }
                #Ht() {
                    const t = this.children();
                    t.provisional = 0;
                    for (const e of t) {
                        e.#qt();
                    }
                }
                #Vt() {
                    this.#It |= 512;
                    this.#Yt();
                }
                #Yt() {
                    if (this.#It & 64) {
                        return;
                    }
                    let t = this.#It;
                    if ((t & b) == 4) {
                        t &= v;
                    }
                    this.#It = t | 64;
                    this.#Ht();
                }
                #Qt(t = "") {
                    if (t === "ENOTDIR" || t === "EPERM") {
                        this.#Yt();
                    } else if (t === "ENOENT") {
                        this.#qt();
                    } else {
                        this.children().provisional = 0;
                    }
                }
                #Zt(t = "") {
                    if (t === "ENOTDIR") {
                        this.parent.#Yt();
                    } else if (t === "ENOENT") {
                        this.#qt();
                    }
                }
                #$t(t = "") {
                    let e = this.#It;
                    e |= 256;
                    if (t === "ENOENT") {
                        e |= S;
                    }
                    if (!(t !== "EINVAL" && t !== "UNKNOWN")) {
                        e &= v;
                    }
                    this.#It = e;
                    if (t === "ENOTDIR" && this.parent) {
                        this.parent.#Yt();
                    }
                }
                #Kt(t, e) {
                    return this.#Jt(t, e) || this.#Xt(t, e);
                }
                #Xt(t, e) {
                    const s = k(t);
                    const i = this.newChild(t.name, s, {
                        parent: this
                    });
                    const r = i.#It & b;
                    if (r !== 4 && r !== w && r !== 0) {
                        i.#It |= 64;
                    }
                    e.unshift(i);
                    e.provisional++;
                    return i;
                }
                #Jt(t, e) {
                    for (let s = e.provisional; s < e.length; s++) {
                        const i = e[s];
                        if ((this.nocase ? _(t.name) : x(t.name)) === i.#Pt) {
                            return this.#te(t, i, s, e);
                        }
                    }
                }
                #te(t, e, s, i) {
                    const r = e.name;
                    e.#It = e.#It & v | k(t);
                    if (r !== t.name) {
                        e.name = t.name;
                    }
                    if (s !== i.provisional) {
                        if (s === i.length - 1) {
                            i.pop();
                        } else {
                            i.splice(s, 1);
                        }
                        i.unshift(e);
                    }
                    i.provisional++;
                    return e;
                }
                async lstat() {
                    if (!(this.#It & S)) {
                        try {
                            this.#ee(await this.#ft.promises.lstat(this.fullpath()));
                            return this;
                        } catch (t) {
                            this.#Zt(t.code);
                        }
                    }
                }
                lstatSync() {
                    if (!(this.#It & S)) {
                        try {
                            this.#ee(this.#ft.lstatSync(this.fullpath()));
                            return this;
                        } catch (t) {
                            this.#Zt(t.code);
                        }
                    }
                }
                #ee(t) {
                    const {
                        atime: e,
                        atimeMs: s,
                        birthtime: i,
                        birthtimeMs: r,
                        blksize: n,
                        blocks: o,
                        ctime: a,
                        ctimeMs: h,
                        dev: c,
                        gid: l,
                        ino: u,
                        mode: p,
                        mtime: d,
                        mtimeMs: f,
                        nlink: g,
                        rdev: m,
                        size: y,
                        uid: b
                    } = t;
                    this.#At = e;
                    this.#xt = s;
                    this.#Ct = i;
                    this.#Tt = r;
                    this.#St = n;
                    this.#Et = o;
                    this.#Lt = a;
                    this.#_t = h;
                    this.#gt = c;
                    this.#bt = l;
                    this.#kt = u;
                    this.#mt = p;
                    this.#Mt = d;
                    this.#Ot = f;
                    this.#yt = g;
                    this.#vt = m;
                    this.#a = y;
                    this.#wt = b;
                    const S = k(t);
                    this.#It = this.#It & v | S | 32;
                    if (S !== 0 && S !== 4 && S !== w) {
                        this.#It |= 64;
                    }
                }
                #se = [];
                #ie = false;
                #re(t) {
                    this.#ie = false;
                    const e = this.#se.slice();
                    this.#se.length = 0;
                    e.forEach(e => e(null, t));
                }
                readdirCB(t, e = false) {
                    if (!this.canReaddir()) {
                        if (e) {
                            t(null, []);
                        } else {
                            queueMicrotask(() => t(null, []));
                        }
                        return;
                    }
                    const s = this.children();
                    if (this.calledReaddir()) {
                        const i = s.slice(0, s.provisional);
                        if (e) {
                            t(null, i);
                        } else {
                            queueMicrotask(() => t(null, i));
                        }
                        return;
                    }
                    this.#se.push(t);
                    if (this.#ie) {
                        return;
                    }
                    this.#ie = true;
                    const i = this.fullpath();
                    this.#ft.readdir(i, {
                        withFileTypes: true
                    }, (t, e) => {
                        if (t) {
                            this.#Qt(t.code);
                            s.provisional = 0;
                        } else {
                            for (const t of e) {
                                this.#Kt(t, s);
                            }
                            this.#Ut(s);
                        }
                        this.#re(s.slice(0, s.provisional));
                    });
                }
                #ne;
                async readdir() {
                    if (!this.canReaddir()) {
                        return [];
                    }
                    const t = this.children();
                    if (this.calledReaddir()) {
                        return t.slice(0, t.provisional);
                    }
                    const e = this.fullpath();
                    if (this.#ne) {
                        await this.#ne;
                    } else {
                        let s = () => { };
                        this.#ne = new Promise(t => s = t);
                        try {
                            for (const s of await this.#ft.promises.readdir(e, {
                                withFileTypes: true
                            })) {
                                this.#Kt(s, t);
                            }
                            this.#Ut(t);
                        } catch (e) {
                            this.#Qt(e.code);
                            t.provisional = 0;
                        }
                        this.#ne = undefined;
                        s();
                    }
                    return t.slice(0, t.provisional);
                }
                readdirSync() {
                    if (!this.canReaddir()) {
                        return [];
                    }
                    const t = this.children();
                    if (this.calledReaddir()) {
                        return t.slice(0, t.provisional);
                    }
                    const e = this.fullpath();
                    try {
                        for (const s of this.#ft.readdirSync(e, {
                            withFileTypes: true
                        })) {
                            this.#Kt(s, t);
                        }
                        this.#Ut(t);
                    } catch (e) {
                        this.#Qt(e.code);
                        t.provisional = 0;
                    }
                    return t.slice(0, t.provisional);
                }
                canReaddir() {
                    if (this.#It & 704) {
                        return false;
                    }
                    const t = b & this.#It;
                    return t === 0 || t === 4 || t === w;
                }
                shouldWalk(t, e) {
                    return !(~this.#It & 4) && !(this.#It & 704) && !t.has(this) && (!e || e(this));
                }
                async realpath() {
                    if (this.#Wt) {
                        return this.#Wt;
                    }
                    if (!(this.#It & 896)) {
                        try {
                            const t = await this.#ft.promises.realpath(this.fullpath());
                            return this.#Wt = this.resolve(t);
                        } catch (t) {
                            this.#Vt();
                        }
                    }
                }
                realpathSync() {
                    if (this.#Wt) {
                        return this.#Wt;
                    }
                    if (!(this.#It & 896)) {
                        try {
                            const t = this.#ft.realpathSync(this.fullpath());
                            return this.#Wt = this.resolve(t);
                        } catch (t) {
                            this.#Vt();
                        }
                    }
                }
                [M](t) {
                    if (t === this) {
                        return;
                    }
                    t.isCWD = false;
                    this.isCWD = true;
                    const e = new Set([]);
                    let s = [];
                    let i = this;
                    for (; i && i.parent;) {
                        e.add(i);
                        i.#Ft = s.join(this.sep);
                        i.#Dt = s.join("/");
                        i = i.parent;
                        s.push("..");
                    }
                    for (i = t; i && i.parent && !e.has(i);) {
                        i.#Ft = undefined;
                        i.#Dt = undefined;
                        i = i.parent;
                    }
                }
            }
            e.PathBase = L;
            class C extends L {
                sep = "\\";
                splitSep = y;
                constructor(t, e = 0, s, i, r, n, o) {
                    super(t, e, s, i, r, n, o);
                }
                newChild(t, e = 0, s = {}) {
                    return new C(t, e, this.root, this.roots, this.nocase, this.childrenCache(), s);
                }
                getRootString(t) {
                    return a.win32.parse(t).root;
                }
                getRoot(t) {
                    if ((t = (t => t.replace(/\//g, "\\").replace(m, "$1\\"))(t.toUpperCase())) === this.root.name) {
                        return this.root;
                    }
                    for (const [e, s] of Object.entries(this.roots)) {
                        if (this.sameRoot(t, e)) {
                            return this.roots[t] = s;
                        }
                    }
                    return this.roots[t] = new j(t, this).root;
                }
                sameRoot(t, e = this.root.name) {
                    return (t = t.toUpperCase().replace(/\//g, "\\").replace(m, "$1\\")) === e;
                }
            }
            e.PathWin32 = C;
            class P extends L {
                splitSep = "/";
                sep = "/";
                constructor(t, e = 0, s, i, r, n, o) {
                    super(t, e, s, i, r, n, o);
                }
                getRootString(t) {
                    if (t.startsWith("/")) {
                        return "/";
                    } else {
                        return "";
                    }
                }
                getRoot(t) {
                    return this.root;
                }
                newChild(t, e = 0, s = {}) {
                    return new P(t, e, this.root, this.roots, this.nocase, this.childrenCache(), s);
                }
            }
            e.PathPosix = P;
            class N {
                root;
                rootPath;
                roots;
                cwd;
                #oe;
                #ae;
                #zt;
                nocase;
                #ft;
                constructor(t = process.cwd(), e, s, {
                    nocase: i,
                    childrenCacheSize: r = 16384,
                    fs: n = f
                } = {}) {
                    this.#ft = g(n);
                    if (t instanceof URL || t.startsWith("file://")) {
                        t = (0, h.fileURLToPath)(t);
                    }
                    const o = e.resolve(t);
                    this.roots = Object.create(null);
                    this.rootPath = this.parseRootPath(o);
                    this.#oe = new T();
                    this.#ae = new T();
                    this.#zt = new A(r);
                    const a = o.substring(this.rootPath.length).split(s);
                    if (!(a.length !== 1 || a[0])) {
                        a.pop();
                    }
                    if (i === undefined) {
                        throw new TypeError("must provide nocase setting to PathScurryBase ctor");
                    }
                    this.nocase = i;
                    this.root = this.newRoot(this.#ft);
                    this.roots[this.rootPath] = this.root;
                    let c = this.root;
                    let l = a.length - 1;
                    const u = e.sep;
                    let p = this.rootPath;
                    let d = false;
                    for (const t of a) {
                        const e = l--;
                        c = c.child(t, {
                            relative: new Array(e).fill("..").join(u),
                            relativePosix: new Array(e).fill("..").join("/"),
                            fullpath: p += (d ? "" : u) + t
                        });
                        d = true;
                    }
                    this.cwd = c;
                }
                depth(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.depth();
                }
                childrenCache() {
                    return this.#zt;
                }
                resolve(...t) {
                    let e = "";
                    for (let s = t.length - 1; s >= 0; s--) {
                        const i = t[s];
                        if (i && i !== "." && (e = e ? `${i}/${e}` : i, this.isAbsolute(i))) {
                            break;
                        }
                    }
                    const s = this.#oe.get(e);
                    if (s !== undefined) {
                        return s;
                    }
                    const i = this.cwd.resolve(e).fullpath();
                    this.#oe.set(e, i);
                    return i;
                }
                resolvePosix(...t) {
                    let e = "";
                    for (let s = t.length - 1; s >= 0; s--) {
                        const i = t[s];
                        if (i && i !== "." && (e = e ? `${i}/${e}` : i, this.isAbsolute(i))) {
                            break;
                        }
                    }
                    const s = this.#ae.get(e);
                    if (s !== undefined) {
                        return s;
                    }
                    const i = this.cwd.resolve(e).fullpathPosix();
                    this.#ae.set(e, i);
                    return i;
                }
                relative(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.relative();
                }
                relativePosix(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.relativePosix();
                }
                basename(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.name;
                }
                dirname(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return (t.parent || t).fullpath();
                }
                async readdir(t = this.cwd, e = {
                    withFileTypes: true
                }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s
                    } = e;
                    if (t.canReaddir()) {
                        const e = await t.readdir();
                        if (s) {
                            return e;
                        } else {
                            return e.map(t => t.name);
                        }
                    }
                    return [];
                }
                readdirSync(t = this.cwd, e = {
                    withFileTypes: true
                }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true
                    } = e;
                    if (t.canReaddir()) {
                        if (s) {
                            return t.readdirSync();
                        } else {
                            return t.readdirSync().map(t => t.name);
                        }
                    } else {
                        return [];
                    }
                }
                async lstat(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.lstat();
                }
                lstatSync(t = this.cwd) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    }
                    return t.lstatSync();
                }
                async readlink(t = this.cwd, {
                    withFileTypes: e
                } = {
                        withFileTypes: false
                    }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t.withFileTypes;
                        t = this.cwd;
                    }
                    const s = await t.readlink();
                    if (e) {
                        return s;
                    } else {
                        return s?.fullpath();
                    }
                }
                readlinkSync(t = this.cwd, {
                    withFileTypes: e
                } = {
                        withFileTypes: false
                    }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t.withFileTypes;
                        t = this.cwd;
                    }
                    const s = t.readlinkSync();
                    if (e) {
                        return s;
                    } else {
                        return s?.fullpath();
                    }
                }
                async realpath(t = this.cwd, {
                    withFileTypes: e
                } = {
                        withFileTypes: false
                    }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t.withFileTypes;
                        t = this.cwd;
                    }
                    const s = await t.realpath();
                    if (e) {
                        return s;
                    } else {
                        return s?.fullpath();
                    }
                }
                realpathSync(t = this.cwd, {
                    withFileTypes: e
                } = {
                        withFileTypes: false
                    }) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t.withFileTypes;
                        t = this.cwd;
                    }
                    const s = t.realpathSync();
                    if (e) {
                        return s;
                    } else {
                        return s?.fullpath();
                    }
                }
                async walk(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true,
                        follow: i = false,
                        filter: r,
                        walkFilter: n
                    } = e;
                    const o = [];
                    if (!(r && !r(t))) {
                        o.push(s ? t : t.fullpath());
                    }
                    const a = new Set();
                    const h = (t, e) => {
                        a.add(t);
                        t.readdirCB((t, c) => {
                            if (t) {
                                return e(t);
                            }
                            let l = c.length;
                            if (!l) {
                                return e();
                            }
                            const u = () => {
                                if (--l == 0) {
                                    e();
                                }
                            };
                            for (const t of c) {
                                if (!(r && !r(t))) {
                                    o.push(s ? t : t.fullpath());
                                }
                                if (i && t.isSymbolicLink()) {
                                    t.realpath().then(t => t?.isUnknown() ? t.lstat() : t).then(t => t?.shouldWalk(a, n) ? h(t, u) : u());
                                } else if (t.shouldWalk(a, n)) {
                                    h(t, u);
                                } else {
                                    u();
                                }
                            }
                        }, true);
                    };
                    const c = t;
                    return new Promise((t, e) => {
                        h(c, s => {
                            if (s) {
                                return e(s);
                            }
                            t(o);
                        });
                    });
                }
                walkSync(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true,
                        follow: i = false,
                        filter: r,
                        walkFilter: n
                    } = e;
                    const o = [];
                    if (!(r && !r(t))) {
                        o.push(s ? t : t.fullpath());
                    }
                    const a = new Set([t]);
                    for (const t of a) {
                        const e = t.readdirSync();
                        for (const t of e) {
                            if (!(r && !r(t))) {
                                o.push(s ? t : t.fullpath());
                            }
                            let e = t;
                            if (t.isSymbolicLink()) {
                                if (!i || !(e = t.realpathSync())) {
                                    continue;
                                }
                                if (e.isUnknown()) {
                                    e.lstatSync();
                                }
                            }
                            if (e.shouldWalk(a, n)) {
                                a.add(e);
                            }
                        }
                    }
                    return o;
                }
                [Symbol.asyncIterator]() {
                    return this.iterate();
                }
                iterate(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    return this.stream(t, e)[Symbol.asyncIterator]();
                }
                [Symbol.iterator]() {
                    return this.iterateSync();
                }
                *iterateSync(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true,
                        follow: i = false,
                        filter: r,
                        walkFilter: n
                    } = e;
                    if (!(r && !r(t))) {
                        yield s ? t : t.fullpath();
                    }
                    const o = new Set([t]);
                    for (const t of o) {
                        const e = t.readdirSync();
                        for (const t of e) {
                            if (!(r && !r(t))) {
                                yield s ? t : t.fullpath();
                            }
                            let e = t;
                            if (t.isSymbolicLink()) {
                                if (!i || !(e = t.realpathSync())) {
                                    continue;
                                }
                                if (e.isUnknown()) {
                                    e.lstatSync();
                                }
                            }
                            if (e.shouldWalk(o, n)) {
                                o.add(e);
                            }
                        }
                    }
                }
                stream(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true,
                        follow: i = false,
                        filter: r,
                        walkFilter: n
                    } = e;
                    const o = new d.Minipass({
                        objectMode: true
                    });
                    if (!(r && !r(t))) {
                        o.write(s ? t : t.fullpath());
                    }
                    const a = new Set();
                    const h = [t];
                    let c = 0;
                    const l = () => {
                        let t = false;
                        for (; !t;) {
                            const e = h.shift();
                            if (!e) {
                                if (c === 0) {
                                    o.end();
                                }
                                return;
                            }
                            c++;
                            a.add(e);
                            const u = (e, d, f = false) => {
                                if (e) {
                                    return o.emit("error", e);
                                }
                                if (i && !f) {
                                    const t = [];
                                    for (const e of d) {
                                        if (e.isSymbolicLink()) {
                                            t.push(e.realpath().then(t => t?.isUnknown() ? t.lstat() : t));
                                        }
                                    }
                                    if (t.length) {
                                        Promise.all(t).then(() => u(null, d, true));
                                        return;
                                    }
                                }
                                for (const e of d) {
                                    if (!(!e || r && !r(e) || o.write(s ? e : e.fullpath()))) {
                                        t = true;
                                    }
                                }
                                c--;
                                for (const t of d) {
                                    const e = t.realpathCached() || t;
                                    if (e.shouldWalk(a, n)) {
                                        h.push(e);
                                    }
                                }
                                if (t && !o.flowing) {
                                    o.once("drain", l);
                                } else if (!p) {
                                    l();
                                }
                            };
                            let p = true;
                            e.readdirCB(u, true);
                            p = false;
                        }
                    };
                    l();
                    return o;
                }
                streamSync(t = this.cwd, e = {}) {
                    if (typeof t == "string") {
                        t = this.cwd.resolve(t);
                    } else if (!(t instanceof L)) {
                        e = t;
                        t = this.cwd;
                    }
                    const {
                        withFileTypes: s = true,
                        follow: i = false,
                        filter: r,
                        walkFilter: n
                    } = e;
                    const o = new d.Minipass({
                        objectMode: true
                    });
                    const a = new Set();
                    if (!(r && !r(t))) {
                        o.write(s ? t : t.fullpath());
                    }
                    const h = [t];
                    let c = 0;
                    const l = () => {
                        let t = false;
                        for (; !t;) {
                            const e = h.shift();
                            if (!e) {
                                if (c === 0) {
                                    o.end();
                                }
                                return;
                            }
                            c++;
                            a.add(e);
                            const l = e.readdirSync();
                            for (const e of l) {
                                if (!(r && !r(e) || o.write(s ? e : e.fullpath()))) {
                                    t = true;
                                }
                            }
                            c--;
                            for (const t of l) {
                                let e = t;
                                if (t.isSymbolicLink()) {
                                    if (!i || !(e = t.realpathSync())) {
                                        continue;
                                    }
                                    if (e.isUnknown()) {
                                        e.lstatSync();
                                    }
                                }
                                if (e.shouldWalk(a, n)) {
                                    h.push(e);
                                }
                            }
                        }
                        if (t && !o.flowing) {
                            o.once("drain", l);
                        }
                    };
                    l();
                    return o;
                }
                chdir(t = this.cwd) {
                    const e = this.cwd;
                    this.cwd = typeof t == "string" ? this.cwd.resolve(t) : t;
                    this.cwd[M](e);
                }
            }
            e.PathScurryBase = N;
            class j extends N {
                sep = "\\";
                constructor(t = process.cwd(), e = {}) {
                    const {
                        nocase: s = true
                    } = e;
                    super(t, a.win32, "\\", {
                        ...e,
                        nocase: s
                    });
                    this.nocase = s;
                    for (let t = this.cwd; t; t = t.parent) {
                        t.nocase = this.nocase;
                    }
                }
                parseRootPath(t) {
                    return a.win32.parse(t).root.toUpperCase();
                }
                newRoot(t) {
                    return new C(this.rootPath, 4, undefined, this.roots, this.nocase, this.childrenCache(), {
                        fs: t
                    });
                }
                isAbsolute(t) {
                    return t.startsWith("/") || t.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(t);
                }
            }
            e.PathScurryWin32 = j;
            class R extends N {
                sep = "/";
                constructor(t = process.cwd(), e = {}) {
                    const {
                        nocase: s = false
                    } = e;
                    super(t, a.posix, "/", {
                        ...e,
                        nocase: s
                    });
                    this.nocase = s;
                }
                parseRootPath(t) {
                    return "/";
                }
                newRoot(t) {
                    return new P(this.rootPath, 4, undefined, this.roots, this.nocase, this.childrenCache(), {
                        fs: t
                    });
                }
                isAbsolute(t) {
                    return t.startsWith("/");
                }
            }
            e.PathScurryPosix = R;
            class F extends R {
                constructor(t = process.cwd(), e = {}) {
                    const {
                        nocase: s = true
                    } = e;
                    super(t, {
                        ...e,
                        nocase: s
                    });
                }
            }
            e.PathScurryDarwin = F;
            e.Path = process.platform === "win32" ? C : P;
            e.PathScurry = process.platform === "win32" ? j : process.platform === "darwin" ? F : R;
        },
        577: (t, e) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.escape = undefined;
            e.escape = (t, {
                windowsPathsNoEscape: e = false
            } = {}) => e ? t.replace(/[?*()[\]]/g, "[$&]") : t.replace(/[?*()[\]\\]/g, "\\$&");
        },
        587: t => {
            t.exports = function t(e, s) {
                if (e && s) {
                    return t(e)(s);
                }
                if (typeof e != "function") {
                    throw new TypeError("need wrapper function");
                }
                Object.keys(e).forEach(function (t) {
                    i[t] = e[t];
                });
                return i;
                function i() {
                    for (var t = new Array(arguments.length), s = 0; s < t.length; s++) {
                        t[s] = arguments[s];
                    }
                    var i = e.apply(this, t);
                    var r = t[t.length - 1];
                    if (typeof i == "function" && i !== r) {
                        Object.keys(r).forEach(function (t) {
                            i[t] = r[t];
                        });
                    }
                    return i;
                }
            };
        },
        613: t => {
            "use strict";

            t.exports = require("assert");
        },
        641: t => {
            "use strict";

            function e(t) {
                return t.charAt(0) === "/";
            }
            function s(t) {
                var e = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(t);
                var s = e[1] || "";
                var i = Boolean(s && s.charAt(1) !== ":");
                return Boolean(e[2] || i);
            }
            t.exports = process.platform === "win32" ? s : e;
            t.exports.posix = e;
            t.exports.win32 = s;
        },
        674: (t, e, s) => {
            var i = s(928);
            var r = process.platform === "win32";
            var n = s(896);
            var o = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
            i.normalize;
            if (r) {
                var a = /(.*?)(?:[\/\\]+|$)/g;
            } else {
                a = /(.*?)(?:[\/]+|$)/g;
            }
            if (r) {
                var h = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
            } else {
                h = /^[\/]*/;
            }
            e.realpathSync = function (t, e) {
                t = i.resolve(t);
                if (e && Object.prototype.hasOwnProperty.call(e, t)) {
                    return e[t];
                }
                var s;
                var o;
                var c;
                var l;
                var u = t;
                var p = {};
                var d = {};
                function f() {
                    var e = h.exec(t);
                    s = e[0].length;
                    o = e[0];
                    c = e[0];
                    l = "";
                    if (r && !d[c]) {
                        n.lstatSync(c);
                        d[c] = true;
                    }
                }
                for (f(); s < t.length;) {
                    a.lastIndex = s;
                    var g = a.exec(t);
                    l = o;
                    o += g[0];
                    c = l + g[1];
                    s = a.lastIndex;
                    if (!(d[c] || e && e[c] === c)) {
                        var m;
                        if (e && Object.prototype.hasOwnProperty.call(e, c)) {
                            m = e[c];
                        } else {
                            var y = n.lstatSync(c);
                            if (!y.isSymbolicLink()) {
                                d[c] = true;
                                if (e) {
                                    e[c] = c;
                                }
                                continue;
                            }
                            var w = null;
                            if (!r) {
                                var b = y.dev.toString(32) + ":" + y.ino.toString(32);
                                if (p.hasOwnProperty(b)) {
                                    w = p[b];
                                }
                            }
                            if (w === null) {
                                n.statSync(c);
                                w = n.readlinkSync(c);
                            }
                            m = i.resolve(l, w);
                            if (e) {
                                e[c] = m;
                            }
                            if (!r) {
                                p[b] = w;
                            }
                        }
                        t = i.resolve(m, t.slice(s));
                        f();
                    }
                }
                if (e) {
                    e[u] = t;
                }
                return t;
            };
            e.realpath = function (t, e, s) {
                if (typeof s != "function") {
                    s = function (t) {
                        if (typeof t == "function") {
                            return t;
                        } else {
                            return function () {
                                var t;
                                if (o) {
                                    var e = new Error();
                                    t = function (t) {
                                        if (t) {
                                            e.message = t.message;
                                            s(t = e);
                                        }
                                    };
                                } else {
                                    t = s;
                                }
                                return t;
                                function s(t) {
                                    if (t) {
                                        if (process.throwDeprecation) {
                                            throw t;
                                        }
                                        if (!process.noDeprecation) {
                                            var e = "fs: missing callback " + (t.stack || t.message);
                                            if (process.traceDeprecation) {
                                                console.trace(e);
                                            } else {
                                                console.error(e);
                                            }
                                        }
                                    }
                                }
                            }();
                        }
                    }(e);
                    e = null;
                }
                t = i.resolve(t);
                if (e && Object.prototype.hasOwnProperty.call(e, t)) {
                    return process.nextTick(s.bind(null, null, e[t]));
                }
                var c;
                var l;
                var u;
                var p;
                var d = t;
                var f = {};
                var g = {};
                function m() {
                    var e = h.exec(t);
                    c = e[0].length;
                    l = e[0];
                    u = e[0];
                    p = "";
                    if (r && !g[u]) {
                        n.lstat(u, function (t) {
                            if (t) {
                                return s(t);
                            }
                            g[u] = true;
                            y();
                        });
                    } else {
                        process.nextTick(y);
                    }
                }
                function y() {
                    if (c >= t.length) {
                        if (e) {
                            e[d] = t;
                        }
                        return s(null, t);
                    }
                    a.lastIndex = c;
                    var i = a.exec(t);
                    p = l;
                    l += i[0];
                    u = p + i[1];
                    c = a.lastIndex;
                    if (g[u] || e && e[u] === u) {
                        return process.nextTick(y);
                    } else if (e && Object.prototype.hasOwnProperty.call(e, u)) {
                        return v(e[u]);
                    } else {
                        return n.lstat(u, w);
                    }
                }
                function w(t, i) {
                    if (t) {
                        return s(t);
                    }
                    if (!i.isSymbolicLink()) {
                        g[u] = true;
                        if (e) {
                            e[u] = u;
                        }
                        return process.nextTick(y);
                    }
                    if (!r) {
                        var o = i.dev.toString(32) + ":" + i.ino.toString(32);
                        if (f.hasOwnProperty(o)) {
                            return b(null, f[o], u);
                        }
                    }
                    n.stat(u, function (t) {
                        if (t) {
                            return s(t);
                        }
                        n.readlink(u, function (t, e) {
                            if (!r) {
                                f[o] = e;
                            }
                            b(t, e);
                        });
                    });
                }
                function b(t, r, n) {
                    if (t) {
                        return s(t);
                    }
                    var o = i.resolve(p, r);
                    if (e) {
                        e[n] = o;
                    }
                    v(o);
                }
                function v(e) {
                    t = i.resolve(e, t.slice(c));
                    m();
                }
                m();
            };
        },
        698: t => {
            if (typeof Object.create == "function") {
                t.exports = function (t, e) {
                    if (e) {
                        t.super_ = e;
                        t.prototype = Object.create(e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    }
                };
            } else {
                t.exports = function (t, e) {
                    if (e) {
                        t.super_ = e;
                        function s() { }
                        s.prototype = e.prototype;
                        t.prototype = new s();
                        t.prototype.constructor = t;
                    }
                };
            }
        },
        718: (t, e) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.unescape = undefined;
            e.unescape = (t, {
                windowsPathsNoEscape: e = false
            } = {}) => e ? t.replace(/\[([^\/\\])\]/g, "$1") : t.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
        },
        734: (t, e, s) => {
            t.exports = w;
            var i = s(836);
            var r = s(27);
            r.Minimatch;
            var n = s(17);
            var o = s(434).EventEmitter;
            var a = s(928);
            var h = s(613);
            var c = s(641);
            var l = s(331);
            var u = s(293);
            var p = u.setopts;
            var d = u.ownProp;
            var f = s(423);
            s(23);
            var g = u.childrenIgnored;
            var m = u.isIgnored;
            var y = s(519);
            function w(t, e, s) {
                if (typeof e == "function") {
                    s = e;
                    e = {};
                }
                if (!e) {
                    e = {};
                }
                if (e.sync) {
                    if (s) {
                        throw new TypeError("callback provided to sync glob");
                    }
                    return l(t, e);
                }
                return new v(t, e, s);
            }
            w.sync = l;
            var b = w.GlobSync = l.GlobSync;
            function v(t, e, s) {
                if (typeof e == "function") {
                    s = e;
                    e = null;
                }
                if (e && e.sync) {
                    if (s) {
                        throw new TypeError("callback provided to sync glob");
                    }
                    return new b(t, e);
                }
                if (!(this instanceof v)) {
                    return new v(t, e, s);
                }
                p(this, t, e);
                this._didRealPath = false;
                var i = this.minimatch.set.length;
                this.matches = new Array(i);
                if (typeof s == "function") {
                    s = y(s);
                    this.on("error", s);
                    this.on("end", function (t) {
                        s(null, t);
                    });
                }
                var r = this;
                this._processing = 0;
                this._emitQueue = [];
                this._processQueue = [];
                this.paused = false;
                if (this.noprocess) {
                    return this;
                }
                if (i === 0) {
                    return a();
                }
                for (var n = true, o = 0; o < i; o++) {
                    this._process(this.minimatch.set[o], o, false, a);
                }
                function a() {
                    --r._processing;
                    if (r._processing <= 0) {
                        if (n) {
                            process.nextTick(function () {
                                r._finish();
                            });
                        } else {
                            r._finish();
                        }
                    }
                }
                n = false;
            }
            w.glob = w;
            w.hasMagic = function (t, e) {
                var s = function (t, e) {
                    if (e === null || typeof e != "object") {
                        return t;
                    }
                    for (var s = Object.keys(e), i = s.length; i--;) {
                        t[s[i]] = e[s[i]];
                    }
                    return t;
                }({}, e);
                s.noprocess = true;
                var i = new v(t, s).minimatch.set;
                if (!t) {
                    return false;
                }
                if (i.length > 1) {
                    return true;
                }
                for (var r = 0; r < i[0].length; r++) {
                    if (typeof i[0][r] != "string") {
                        return true;
                    }
                }
                return false;
            };
            w.Glob = v;
            n(v, o);
            v.prototype._finish = function () {
                h(this instanceof v);
                if (!this.aborted) {
                    if (this.realpath && !this._didRealpath) {
                        return this._realpath();
                    }
                    u.finish(this);
                    this.emit("end", this.found);
                }
            };
            v.prototype._realpath = function () {
                if (!this._didRealpath) {
                    this._didRealpath = true;
                    var t = this.matches.length;
                    if (t === 0) {
                        return this._finish();
                    }
                    for (var e = this, s = 0; s < this.matches.length; s++) {
                        this._realpathSet(s, i);
                    }
                }
                function i() {
                    if (--t == 0) {
                        e._finish();
                    }
                }
            };
            v.prototype._realpathSet = function (t, e) {
                var s = this.matches[t];
                if (!s) {
                    return e();
                }
                var r = Object.keys(s);
                var n = this;
                var o = r.length;
                if (o === 0) {
                    return e();
                }
                var a = this.matches[t] = Object.create(null);
                r.forEach(function (s, r) {
                    s = n._makeAbs(s);
                    i.realpath(s, n.realpathCache, function (i, r) {
                        if (i) {
                            if (i.syscall === "stat") {
                                a[s] = true;
                            } else {
                                n.emit("error", i);
                            }
                        } else {
                            a[r] = true;
                        }
                        if (--o == 0) {
                            n.matches[t] = a;
                            e();
                        }
                    });
                });
            };
            v.prototype._mark = function (t) {
                return u.mark(this, t);
            };
            v.prototype._makeAbs = function (t) {
                return u.makeAbs(this, t);
            };
            v.prototype.abort = function () {
                this.aborted = true;
                this.emit("abort");
            };
            v.prototype.pause = function () {
                if (!this.paused) {
                    this.paused = true;
                    this.emit("pause");
                }
            };
            v.prototype.resume = function () {
                if (this.paused) {
                    this.emit("resume");
                    this.paused = false;
                    if (this._emitQueue.length) {
                        var t = this._emitQueue.slice(0);
                        this._emitQueue.length = 0;
                        for (var e = 0; e < t.length; e++) {
                            var s = t[e];
                            this._emitMatch(s[0], s[1]);
                        }
                    }
                    if (this._processQueue.length) {
                        var i = this._processQueue.slice(0);
                        this._processQueue.length = 0;
                        e = 0;
                        for (; e < i.length; e++) {
                            var r = i[e];
                            this._processing--;
                            this._process(r[0], r[1], r[2], r[3]);
                        }
                    }
                }
            };
            v.prototype._process = function (t, e, s, i) {
                h(this instanceof v);
                h(typeof i == "function");
                if (!this.aborted) {
                    this._processing++;
                    if (this.paused) {
                        this._processQueue.push([t, e, s, i]);
                    } else {
                        for (var n, o = 0; typeof t[o] == "string";) {
                            o++;
                        }
                        switch (o) {
                            case t.length:
                                this._processSimple(t.join("/"), e, i);
                                return;
                            case 0:
                                n = null;
                                break;
                            default:
                                n = t.slice(0, o).join("/");
                        }
                        var a;
                        var l = t.slice(o);
                        if (n === null) {
                            a = ".";
                        } else if (c(n) || c(t.map(function (t) {
                            if (typeof t == "string") {
                                return t;
                            } else {
                                return "[*]";
                            }
                        }).join("/"))) {
                            if (!(n && c(n))) {
                                n = "/" + n;
                            }
                            a = n;
                        } else {
                            a = n;
                        }
                        var u = this._makeAbs(a);
                        if (g(this, a)) {
                            return i();
                        }
                        if (l[0] === r.GLOBSTAR) {
                            this._processGlobStar(n, a, u, l, e, s, i);
                        } else {
                            this._processReaddir(n, a, u, l, e, s, i);
                        }
                    }
                }
            };
            v.prototype._processReaddir = function (t, e, s, i, r, n, o) {
                var a = this;
                this._readdir(s, n, function (h, c) {
                    return a._processReaddir2(t, e, s, i, r, n, c, o);
                });
            };
            v.prototype._processReaddir2 = function (t, e, s, i, r, n, o, h) {
                if (!o) {
                    return h();
                }
                for (var c = i[0], l = !!this.minimatch.negate, u = c._glob, p = this.dot || u.charAt(0) === ".", d = [], f = 0; f < o.length; f++) {
                    if (((m = o[f]).charAt(0) !== "." || p) && (l && !t ? !m.match(c) : m.match(c))) {
                        d.push(m);
                    }
                }
                var g = d.length;
                if (g === 0) {
                    return h();
                }
                if (i.length === 1 && !this.mark && !this.stat) {
                    if (!this.matches[r]) {
                        this.matches[r] = Object.create(null);
                    }
                    f = 0;
                    for (; f < g; f++) {
                        var m = d[f];
                        if (t) {
                            m = t !== "/" ? t + "/" + m : t + m;
                        }
                        if (!(m.charAt(0) !== "/" || this.nomount)) {
                            m = a.join(this.root, m);
                        }
                        this._emitMatch(r, m);
                    }
                    return h();
                }
                i.shift();
                f = 0;
                for (; f < g; f++) {
                    m = d[f];
                    if (t) {
                        m = t !== "/" ? t + "/" + m : t + m;
                    }
                    this._process([m].concat(i), r, n, h);
                }
                h();
            };
            v.prototype._emitMatch = function (t, e) {
                if (!this.aborted && !m(this, e)) {
                    if (this.paused) {
                        this._emitQueue.push([t, e]);
                    } else {
                        var s = c(e) ? e : this._makeAbs(e);
                        if (this.mark) {
                            e = this._mark(e);
                        }
                        if (this.absolute) {
                            e = s;
                        }
                        if (!this.matches[t][e]) {
                            if (this.nodir) {
                                var i = this.cache[s];
                                if (i === "DIR" || Array.isArray(i)) {
                                    return;
                                }
                            }
                            this.matches[t][e] = true;
                            var r = this.statCache[s];
                            if (r) {
                                this.emit("stat", e, r);
                            }
                            this.emit("match", e);
                        }
                    }
                }
            };
            v.prototype._readdirInGlobStar = function (t, e) {
                if (!this.aborted) {
                    if (this.follow) {
                        return this._readdir(t, false, e);
                    }
                    var s = this;
                    var i = f("lstat\0" + t, function (i, r) {
                        if (i && i.code === "ENOENT") {
                            return e();
                        }
                        var n = r && r.isSymbolicLink();
                        s.symlinks[t] = n;
                        if (n || !r || r.isDirectory()) {
                            s._readdir(t, false, e);
                        } else {
                            s.cache[t] = "FILE";
                            e();
                        }
                    });
                    if (i) {
                        s.fs.lstat(t, i);
                    }
                }
            };
            v.prototype._readdir = function (t, e, s) {
                if (!this.aborted && (s = f("readdir\0" + t + "\0" + e, s))) {
                    if (e && !d(this.symlinks, t)) {
                        return this._readdirInGlobStar(t, s);
                    }
                    if (d(this.cache, t)) {
                        var i = this.cache[t];
                        if (!i || i === "FILE") {
                            return s();
                        }
                        if (Array.isArray(i)) {
                            return s(null, i);
                        }
                    }
                    this.fs.readdir(t, function (t, e, s) {
                        return function (i, r) {
                            if (i) {
                                t._readdirError(e, i, s);
                            } else {
                                t._readdirEntries(e, r, s);
                            }
                        };
                    }(this, t, s));
                }
            };
            v.prototype._readdirEntries = function (t, e, s) {
                if (!this.aborted) {
                    if (!this.mark && !this.stat) {
                        for (var i = 0; i < e.length; i++) {
                            var r = e[i];
                            r = t === "/" ? t + r : t + "/" + r;
                            this.cache[r] = true;
                        }
                    }
                    this.cache[t] = e;
                    return s(null, e);
                }
            };
            v.prototype._readdirError = function (t, e, s) {
                if (!this.aborted) {
                    switch (e.code) {
                        case "ENOTSUP":
                        case "ENOTDIR":
                            var i = this._makeAbs(t);
                            this.cache[i] = "FILE";
                            if (i === this.cwdAbs) {
                                var r = new Error(e.code + " invalid cwd " + this.cwd);
                                r.path = this.cwd;
                                r.code = e.code;
                                this.emit("error", r);
                                this.abort();
                            }
                            break;
                        case "ENOENT":
                        case "ELOOP":
                        case "ENAMETOOLONG":
                        case "UNKNOWN":
                            this.cache[this._makeAbs(t)] = false;
                            break;
                        default:
                            this.cache[this._makeAbs(t)] = false;
                            if (this.strict) {
                                this.emit("error", e);
                                this.abort();
                            }
                            if (!this.silent) {
                                console.error("glob error", e);
                            }
                    }
                    return s();
                }
            };
            v.prototype._processGlobStar = function (t, e, s, i, r, n, o) {
                var a = this;
                this._readdir(s, n, function (h, c) {
                    a._processGlobStar2(t, e, s, i, r, n, c, o);
                });
            };
            v.prototype._processGlobStar2 = function (t, e, s, i, r, n, o, a) {
                if (!o) {
                    return a();
                }
                var h = i.slice(1);
                var c = t ? [t] : [];
                var l = c.concat(h);
                this._process(l, r, false, a);
                var u = this.symlinks[s];
                var p = o.length;
                if (u && n) {
                    return a();
                }
                for (var d = 0; d < p; d++) {
                    if (o[d].charAt(0) !== "." || this.dot) {
                        var f = c.concat(o[d], h);
                        this._process(f, r, true, a);
                        var g = c.concat(o[d], i);
                        this._process(g, r, true, a);
                    }
                }
                a();
            };
            v.prototype._processSimple = function (t, e, s) {
                var i = this;
                this._stat(t, function (r, n) {
                    i._processSimple2(t, e, r, n, s);
                });
            };
            v.prototype._processSimple2 = function (t, e, s, i, r) {
                if (!this.matches[e]) {
                    this.matches[e] = Object.create(null);
                }
                if (!i) {
                    return r();
                }
                if (t && c(t) && !this.nomount) {
                    var n = /[\/\\]$/.test(t);
                    if (t.charAt(0) === "/") {
                        t = a.join(this.root, t);
                    } else {
                        t = a.resolve(this.root, t);
                        if (n) {
                            t += "/";
                        }
                    }
                }
                if (process.platform === "win32") {
                    t = t.replace(/\\/g, "/");
                }
                this._emitMatch(e, t);
                r();
            };
            v.prototype._stat = function (t, e) {
                var s = this._makeAbs(t);
                var i = t.slice(-1) === "/";
                if (t.length > this.maxLength) {
                    return e();
                }
                if (!this.stat && d(this.cache, s)) {
                    var r = this.cache[s];
                    if (Array.isArray(r)) {
                        r = "DIR";
                    }
                    if (!i || r === "DIR") {
                        return e(null, r);
                    }
                    if (i && r === "FILE") {
                        return e();
                    }
                }
                var n = this.statCache[s];
                if (n !== undefined) {
                    if (n === false) {
                        return e(null, n);
                    }
                    var o = n.isDirectory() ? "DIR" : "FILE";
                    if (i && o === "FILE") {
                        return e();
                    } else {
                        return e(null, o, n);
                    }
                }
                var a = this;
                var h = f("stat\0" + s, function (i, r) {
                    if (r && r.isSymbolicLink()) {
                        return a.fs.stat(s, function (i, n) {
                            if (i) {
                                a._stat2(t, s, null, r, e);
                            } else {
                                a._stat2(t, s, i, n, e);
                            }
                        });
                    }
                    a._stat2(t, s, i, r, e);
                });
                if (h) {
                    a.fs.lstat(s, h);
                }
            };
            v.prototype._stat2 = function (t, e, s, i, r) {
                if (s && (s.code === "ENOENT" || s.code === "ENOTDIR")) {
                    this.statCache[e] = false;
                    return r();
                }
                var n = t.slice(-1) === "/";
                this.statCache[e] = i;
                if (e.slice(-1) === "/" && i && !i.isDirectory()) {
                    return r(null, false, i);
                }
                var o = true;
                if (i) {
                    o = i.isDirectory() ? "DIR" : "FILE";
                }
                this.cache[e] = this.cache[e] || o;
                if (n && o === "FILE") {
                    return r();
                } else {
                    return r(null, o, i);
                }
            };
        },
        756: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.glob = e.sync = e.iterate = e.iterateSync = e.stream = e.streamSync = e.Ignore = e.hasMagic = e.Glob = e.unescape = e.escape = undefined;
            e.globStreamSync = l;
            e.globStream = u;
            e.globSync = p;
            e.globIterateSync = f;
            e.globIterate = g;
            const i = s(144);
            const r = s(876);
            const n = s(46);
            var o = s(144);
            Object.defineProperty(e, "escape", {
                enumerable: true,
                get: function () {
                    return o.escape;
                }
            });
            Object.defineProperty(e, "unescape", {
                enumerable: true,
                get: function () {
                    return o.unescape;
                }
            });
            var a = s(876);
            Object.defineProperty(e, "Glob", {
                enumerable: true,
                get: function () {
                    return a.Glob;
                }
            });
            var h = s(46);
            Object.defineProperty(e, "hasMagic", {
                enumerable: true,
                get: function () {
                    return h.hasMagic;
                }
            });
            var c = s(972);
            function l(t, e = {}) {
                return new r.Glob(t, e).streamSync();
            }
            function u(t, e = {}) {
                return new r.Glob(t, e).stream();
            }
            function p(t, e = {}) {
                return new r.Glob(t, e).walkSync();
            }
            async function d(t, e = {}) {
                return new r.Glob(t, e).walk();
            }
            function f(t, e = {}) {
                return new r.Glob(t, e).iterateSync();
            }
            function g(t, e = {}) {
                return new r.Glob(t, e).iterate();
            }
            Object.defineProperty(e, "Ignore", {
                enumerable: true,
                get: function () {
                    return c.Ignore;
                }
            });
            e.streamSync = l;
            e.stream = Object.assign(u, {
                sync: l
            });
            e.iterateSync = f;
            e.iterate = Object.assign(g, {
                sync: f
            });
            e.sync = Object.assign(p, {
                stream: l,
                iterate: f
            });
            e.glob = Object.assign(d, {
                glob: d,
                globSync: p,
                sync: e.sync,
                globStream: u,
                stream: e.stream,
                globStreamSync: l,
                streamSync: e.streamSync,
                globIterate: g,
                iterate: e.iterate,
                globIterateSync: f,
                iterateSync: e.iterateSync,
                Glob: r.Glob,
                hasMagic: n.hasMagic,
                escape: i.escape,
                unescape: i.unescape
            });
            e.glob.glob = e.glob;
        },
        760: t => {
            "use strict";

            t.exports = require("node:path");
        },
        800: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Processor = e.SubWalks = e.MatchRecord = e.HasWalkedCache = undefined;
            const i = s(144);
            class r {
                store;
                constructor(t = new Map()) {
                    this.store = t;
                }
                copy() {
                    return new r(new Map(this.store));
                }
                hasWalked(t, e) {
                    return this.store.get(t.fullpath())?.has(e.globString());
                }
                storeWalked(t, e) {
                    const s = t.fullpath();
                    const i = this.store.get(s);
                    if (i) {
                        i.add(e.globString());
                    } else {
                        this.store.set(s, new Set([e.globString()]));
                    }
                }
            }
            e.HasWalkedCache = r;
            class n {
                store = new Map();
                add(t, e, s) {
                    const i = (e ? 2 : 0) | (s ? 1 : 0);
                    const r = this.store.get(t);
                    this.store.set(t, r === undefined ? i : i & r);
                }
                entries() {
                    return [...this.store.entries()].map(([t, e]) => [t, !!(e & 2), !!(e & 1)]);
                }
            }
            e.MatchRecord = n;
            class o {
                store = new Map();
                add(t, e) {
                    if (!t.canReaddir()) {
                        return;
                    }
                    const s = this.store.get(t);
                    if (s) {
                        if (!s.find(t => t.globString() === e.globString())) {
                            s.push(e);
                        }
                    } else {
                        this.store.set(t, [e]);
                    }
                }
                get(t) {
                    const e = this.store.get(t);
                    if (!e) {
                        throw new Error("attempting to walk unknown path");
                    }
                    return e;
                }
                entries() {
                    return this.keys().map(t => [t, this.store.get(t)]);
                }
                keys() {
                    return [...this.store.keys()].filter(t => t.canReaddir());
                }
            }
            e.SubWalks = o;
            class a {
                hasWalkedCache;
                matches = new n();
                subwalks = new o();
                patterns;
                follow;
                dot;
                opts;
                constructor(t, e) {
                    this.opts = t;
                    this.follow = !!t.follow;
                    this.dot = !!t.dot;
                    this.hasWalkedCache = e ? e.copy() : new r();
                }
                processPatterns(t, e) {
                    this.patterns = e;
                    const s = e.map(e => [t, e]);
                    for (let [t, e] of s) {
                        this.hasWalkedCache.storeWalked(t, e);
                        const s = e.root();
                        const r = e.isAbsolute() && this.opts.absolute !== false;
                        if (s) {
                            t = t.resolve(s === "/" && this.opts.root !== undefined ? this.opts.root : s);
                            const i = e.rest();
                            if (!i) {
                                this.matches.add(t, true, false);
                                continue;
                            }
                            e = i;
                        }
                        if (t.isENOENT()) {
                            continue;
                        }
                        let n;
                        let o;
                        let a = false;
                        for (; typeof (n = e.pattern()) == "string" && (o = e.rest());) {
                            const s = t.resolve(n);
                            t = s;
                            e = o;
                            a = true;
                        }
                        n = e.pattern();
                        o = e.rest();
                        if (a) {
                            if (this.hasWalkedCache.hasWalked(t, e)) {
                                continue;
                            }
                            this.hasWalkedCache.storeWalked(t, e);
                        }
                        if (typeof n != "string") {
                            if (n === i.GLOBSTAR) {
                                if (!t.isSymbolicLink() || this.follow || e.checkFollowGlobstar()) {
                                    this.subwalks.add(t, e);
                                }
                                const s = o?.pattern();
                                const i = o?.rest();
                                if (o && (s !== "" && s !== "." || i)) {
                                    if (s === "..") {
                                        const e = t.parent || t;
                                        if (i) {
                                            if (!this.hasWalkedCache.hasWalked(e, i)) {
                                                this.subwalks.add(e, i);
                                            }
                                        } else {
                                            this.matches.add(e, r, true);
                                        }
                                    }
                                } else {
                                    this.matches.add(t, r, s === "" || s === ".");
                                }
                            } else if (n instanceof RegExp) {
                                this.subwalks.add(t, e);
                            }
                        } else {
                            const e = n === ".." || n === "" || n === ".";
                            this.matches.add(t.resolve(n), r, e);
                        }
                    }
                    return this;
                }
                subwalkTargets() {
                    return this.subwalks.keys();
                }
                child() {
                    return new a(this.opts, this.hasWalkedCache);
                }
                filterEntries(t, e) {
                    const s = this.subwalks.get(t);
                    const r = this.child();
                    for (const t of e) {
                        for (const e of s) {
                            const s = e.isAbsolute();
                            const n = e.pattern();
                            const o = e.rest();
                            if (n === i.GLOBSTAR) {
                                r.testGlobstar(t, e, o, s);
                            } else if (n instanceof RegExp) {
                                r.testRegExp(t, n, o, s);
                            } else {
                                r.testString(t, n, o, s);
                            }
                        }
                    }
                    return r;
                }
                testGlobstar(t, e, s, i) {
                    if (!(!this.dot && t.name.startsWith("."))) {
                        if (!e.hasMore()) {
                            this.matches.add(t, i, false);
                        }
                        if (t.canReaddir()) {
                            if (this.follow || !t.isSymbolicLink()) {
                                this.subwalks.add(t, e);
                            } else if (t.isSymbolicLink()) {
                                if (s && e.checkFollowGlobstar()) {
                                    this.subwalks.add(t, s);
                                } else if (e.markFollowGlobstar()) {
                                    this.subwalks.add(t, e);
                                }
                            }
                        }
                    }
                    if (s) {
                        const e = s.pattern();
                        if (typeof e == "string" && e !== ".." && e !== "" && e !== ".") {
                            this.testString(t, e, s.rest(), i);
                        } else if (e === "..") {
                            const e = t.parent || t;
                            this.subwalks.add(e, s);
                        } else if (e instanceof RegExp) {
                            this.testRegExp(t, e, s.rest(), i);
                        }
                    }
                }
                testRegExp(t, e, s, i) {
                    if (e.test(t.name)) {
                        if (s) {
                            this.subwalks.add(t, s);
                        } else {
                            this.matches.add(t, i, false);
                        }
                    }
                }
                testString(t, e, s, i) {
                    if (t.isNamed(e)) {
                        if (s) {
                            this.subwalks.add(t, s);
                        } else {
                            this.matches.add(t, i, false);
                        }
                    }
                }
            }
            e.Processor = a;
        },
        818: t => {
            t.exports = function (t, s) {
                for (var i = [], r = 0; r < t.length; r++) {
                    var n = s(t[r], r);
                    if (e(n)) {
                        i.push.apply(i, n);
                    } else {
                        i.push(n);
                    }
                }
                return i;
            };
            var e = Array.isArray || function (t) {
                return Object.prototype.toString.call(t) === "[object Array]";
            };
        },
        836: (t, e, s) => {
            t.exports = l;
            l.realpath = l;
            l.sync = u;
            l.realpathSync = u;
            l.monkeypatch = function () {
                i.realpath = l;
                i.realpathSync = u;
            };
            l.unmonkeypatch = function () {
                i.realpath = r;
                i.realpathSync = n;
            };
            var i = s(896);
            var r = i.realpath;
            var n = i.realpathSync;
            var o = process.version;
            var a = /^v[0-5]\./.test(o);
            var h = s(674);
            function c(t) {
                return t && t.syscall === "realpath" && (t.code === "ELOOP" || t.code === "ENOMEM" || t.code === "ENAMETOOLONG");
            }
            function l(t, e, s) {
                if (a) {
                    return r(t, e, s);
                }
                if (typeof e == "function") {
                    s = e;
                    e = null;
                }
                r(t, e, function (i, r) {
                    if (c(i)) {
                        h.realpath(t, e, s);
                    } else {
                        s(i, r);
                    }
                });
            }
            function u(t, e) {
                if (a) {
                    return n(t, e);
                }
                try {
                    return n(t, e);
                } catch (s) {
                    if (c(s)) {
                        return h.realpathSync(t, e);
                    }
                    throw s;
                }
            }
        },
        862: function (t, e, s) {
            "use strict";

            var i;
            var r = this && this.__createBinding || (Object.create ? function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                var r = Object.getOwnPropertyDescriptor(e, s);
                if (!(r && !("get" in r ? !e.__esModule : r.writable || r.configurable))) {
                    r = {
                        enumerable: true,
                        get: function () {
                            return e[s];
                        }
                    };
                }
                Object.defineProperty(t, i, r);
            } : function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                t[i] = e[s];
            });
            var n = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                });
            } : function (t, e) {
                t.default = e;
            });
            var o = this && this.__importStar || (i = function (t) {
                i = Object.getOwnPropertyNames || function (t) {
                    var e = [];
                    for (var s in t) {
                        if (Object.prototype.hasOwnProperty.call(t, s)) {
                            e[e.length] = s;
                        }
                    }
                    return e;
                };
                return i(t);
            }, function (t) {
                if (t && t.__esModule) {
                    return t;
                }
                var e = {};
                if (t != null) {
                    for (var s = i(t), o = 0; o < s.length; o++) {
                        if (s[o] !== "default") {
                            r(e, t, s[o]);
                        }
                    }
                }
                n(e, t);
                return e;
            });
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Note = undefined;
            const a = o(s(398));
            const h = o(s(928));
            class c extends a.TreeItem {
                constructor(t, e, s, i, r = false, n) {
                    super(t, r ? a.TreeItemCollapsibleState.Collapsed : a.TreeItemCollapsibleState.None);
                    this.name = t;
                    this.location = e;
                    this.category = s;
                    this.tags = i;
                    this.isDirectory = r;
                    this.command = n;
                    this.tooltip = this.name;
                    this.name = t;
                    this.location = e;
                    this.category = s;
                    this.tags = i;
                    this.isFolder = r;
                    this.fullPath = h.join(e, t);
                    this.iconPath = r ? new a.ThemeIcon("folder") : a.ThemeIcon.File;
                    this.contextValue = r ? "folder" : "note";
                }
            }
            e.Note = c;
        },
        876: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Glob = undefined;
            const i = s(144);
            const r = s(136);
            const n = s(576);
            const o = s(478);
            const a = s(984);
            const h = typeof process == "object" && process && typeof process.platform == "string" ? process.platform : "linux";
            class c {
                absolute;
                cwd;
                root;
                dot;
                dotRelative;
                follow;
                ignore;
                magicalBraces;
                mark;
                matchBase;
                maxDepth;
                nobrace;
                nocase;
                nodir;
                noext;
                noglobstar;
                pattern;
                platform;
                realpath;
                scurry;
                stat;
                signal;
                windowsPathsNoEscape;
                withFileTypes;
                includeChildMatches;
                opts;
                patterns;
                constructor(t, e) {
                    if (!e) {
                        throw new TypeError("glob options required");
                    }
                    this.withFileTypes = !!e.withFileTypes;
                    this.signal = e.signal;
                    this.follow = !!e.follow;
                    this.dot = !!e.dot;
                    this.dotRelative = !!e.dotRelative;
                    this.nodir = !!e.nodir;
                    this.mark = !!e.mark;
                    if (e.cwd) {
                        if (e.cwd instanceof URL || e.cwd.startsWith("file://")) {
                            e.cwd = (0, r.fileURLToPath)(e.cwd);
                        }
                    } else {
                        this.cwd = "";
                    }
                    this.cwd = e.cwd || "";
                    this.root = e.root;
                    this.magicalBraces = !!e.magicalBraces;
                    this.nobrace = !!e.nobrace;
                    this.noext = !!e.noext;
                    this.realpath = !!e.realpath;
                    this.absolute = e.absolute;
                    this.includeChildMatches = e.includeChildMatches !== false;
                    this.noglobstar = !!e.noglobstar;
                    this.matchBase = !!e.matchBase;
                    this.maxDepth = typeof e.maxDepth == "number" ? e.maxDepth : Infinity;
                    this.stat = !!e.stat;
                    this.ignore = e.ignore;
                    if (this.withFileTypes && this.absolute !== undefined) {
                        throw new Error("cannot set absolute and withFileTypes:true");
                    }
                    if (typeof t == "string") {
                        t = [t];
                    }
                    this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === false;
                    if (this.windowsPathsNoEscape) {
                        t = t.map(t => t.replace(/\\/g, "/"));
                    }
                    if (this.matchBase) {
                        if (e.noglobstar) {
                            throw new TypeError("base matching requires globstar");
                        }
                        t = t.map(t => t.includes("/") ? t : `./**/${t}`);
                    }
                    this.pattern = t;
                    this.platform = e.platform || h;
                    this.opts = {
                        ...e,
                        platform: this.platform
                    };
                    if (e.scurry) {
                        this.scurry = e.scurry;
                        if (e.nocase !== undefined && e.nocase !== e.scurry.nocase) {
                            throw new Error("nocase option contradicts provided scurry option");
                        }
                    } else {
                        const t = e.platform === "win32" ? n.PathScurryWin32 : e.platform === "darwin" ? n.PathScurryDarwin : e.platform ? n.PathScurryPosix : n.PathScurry;
                        this.scurry = new t(this.cwd, {
                            nocase: e.nocase,
                            fs: e.fs
                        });
                    }
                    this.nocase = this.scurry.nocase;
                    const s = this.platform === "darwin" || this.platform === "win32";
                    const a = {
                        ...e,
                        dot: this.dot,
                        matchBase: this.matchBase,
                        nobrace: this.nobrace,
                        nocase: this.nocase,
                        nocaseMagicOnly: s,
                        nocomment: true,
                        noext: this.noext,
                        nonegate: true,
                        optimizationLevel: 2,
                        platform: this.platform,
                        windowsPathsNoEscape: this.windowsPathsNoEscape,
                        debug: !!this.opts.debug
                    };
                    const c = this.pattern.map(t => new i.Minimatch(t, a));
                    const [l, u] = c.reduce((t, e) => {
                        t[0].push(...e.set);
                        t[1].push(...e.globParts);
                        return t;
                    }, [[], []]);
                    this.patterns = l.map((t, e) => {
                        const s = u[e];
                        if (!s) {
                            throw new Error("invalid pattern object");
                        }
                        return new o.Pattern(t, s, 0, this.platform);
                    });
                }
                async walk() {
                    return [...(await new a.GlobWalker(this.patterns, this.scurry.cwd, {
                        ...this.opts,
                        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                        platform: this.platform,
                        nocase: this.nocase,
                        includeChildMatches: this.includeChildMatches
                    }).walk())];
                }
                walkSync() {
                    return [...new a.GlobWalker(this.patterns, this.scurry.cwd, {
                        ...this.opts,
                        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                        platform: this.platform,
                        nocase: this.nocase,
                        includeChildMatches: this.includeChildMatches
                    }).walkSync()];
                }
                stream() {
                    return new a.GlobStream(this.patterns, this.scurry.cwd, {
                        ...this.opts,
                        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                        platform: this.platform,
                        nocase: this.nocase,
                        includeChildMatches: this.includeChildMatches
                    }).stream();
                }
                streamSync() {
                    return new a.GlobStream(this.patterns, this.scurry.cwd, {
                        ...this.opts,
                        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                        platform: this.platform,
                        nocase: this.nocase,
                        includeChildMatches: this.includeChildMatches
                    }).streamSync();
                }
                iterateSync() {
                    return this.streamSync()[Symbol.iterator]();
                }
                [Symbol.iterator]() {
                    return this.iterateSync();
                }
                iterate() {
                    return this.stream()[Symbol.asyncIterator]();
                }
                [Symbol.asyncIterator]() {
                    return this.iterate();
                }
            }
            e.Glob = c;
        },
        896: t => {
            "use strict";

            t.exports = require("fs");
        },
        897: (t, e) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.parseClass = undefined;
            const s = {
                "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
                "[:alpha:]": ["\\p{L}\\p{Nl}", true],
                "[:ascii:]": ["\\x00-\\x7f", false],
                "[:blank:]": ["\\p{Zs}\\t", true],
                "[:cntrl:]": ["\\p{Cc}", true],
                "[:digit:]": ["\\p{Nd}", true],
                "[:graph:]": ["\\p{Z}\\p{C}", true, true],
                "[:lower:]": ["\\p{Ll}", true],
                "[:print:]": ["\\p{C}", true],
                "[:punct:]": ["\\p{P}", true],
                "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
                "[:upper:]": ["\\p{Lu}", true],
                "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
                "[:xdigit:]": ["A-Fa-f0-9", false]
            };
            const i = t => t.replace(/[[\]\\-]/g, "\\$&");
            const r = t => t.join("");
            e.parseClass = (t, e) => {
                const n = e;
                if (t.charAt(n) !== "[") {
                    throw new Error("not in a brace expression");
                }
                const o = [];
                const a = [];
                let h = n + 1;
                let c = false;
                let l = false;
                let u = false;
                let p = false;
                let d = n;
                let f = "";
                t: for (; h < t.length;) {
                    const e = t.charAt(h);
                    if (e !== "!" && e !== "^" || h !== n + 1) {
                        if (e === "]" && c && !u) {
                            d = h + 1;
                            break;
                        }
                        c = true;
                        if (e !== "\\" || u) {
                            if (e === "[" && !u) {
                                for (const [e, [i, r, c]] of Object.entries(s)) {
                                    if (t.startsWith(e, h)) {
                                        if (f) {
                                            return ["$.", false, t.length - n, true];
                                        }
                                        h += e.length;
                                        if (c) {
                                            a.push(i);
                                        } else {
                                            o.push(i);
                                        }
                                        l = l || r;
                                        continue t;
                                    }
                                }
                            }
                            u = false;
                            if (f) {
                                if (e > f) {
                                    o.push(i(f) + "-" + i(e));
                                } else if (e === f) {
                                    o.push(i(e));
                                }
                                f = "";
                                h++;
                            } else if (t.startsWith("-]", h + 1)) {
                                o.push(i(e + "-"));
                                h += 2;
                            } else if (t.startsWith("-", h + 1)) {
                                f = e;
                                h += 2;
                            } else {
                                o.push(i(e));
                                h++;
                            }
                        } else {
                            u = true;
                            h++;
                        }
                    } else {
                        p = true;
                        h++;
                    }
                }
                if (d < h) {
                    return ["", false, 0, false];
                }
                if (!o.length && !a.length) {
                    return ["$.", false, t.length - n, true];
                }
                if (a.length === 0 && o.length === 1 && /^\\?.$/.test(o[0]) && !p) {
                    return [(g = o[0].length === 2 ? o[0].slice(-1) : o[0], g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")), false, d - n, false];
                }
                var g;
                const m = "[" + (p ? "^" : "") + r(o) + "]";
                const y = "[" + (p ? "" : "^") + r(a) + "]";
                return [o.length && a.length ? "(" + m + "|" + y + ")" : o.length ? m : y, l, d - n, true];
            };
        },
        928: t => {
            "use strict";

            t.exports = require("path");
        },
        949: function (t, e, s) {
            "use strict";

            var i;
            var r = this && this.__createBinding || (Object.create ? function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                var r = Object.getOwnPropertyDescriptor(e, s);
                if (!(r && !("get" in r ? !e.__esModule : r.writable || r.configurable))) {
                    r = {
                        enumerable: true,
                        get: function () {
                            return e[s];
                        }
                    };
                }
                Object.defineProperty(t, i, r);
            } : function (t, e, s, i) {
                if (i === undefined) {
                    i = s;
                }
                t[i] = e[s];
            });
            var n = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                });
            } : function (t, e) {
                t.default = e;
            });
            var o = this && this.__importStar || (i = function (t) {
                i = Object.getOwnPropertyNames || function (t) {
                    var e = [];
                    for (var s in t) {
                        if (Object.prototype.hasOwnProperty.call(t, s)) {
                            e[e.length] = s;
                        }
                    }
                    return e;
                };
                return i(t);
            }, function (t) {
                if (t && t.__esModule) {
                    return t;
                }
                var e = {};
                if (t != null) {
                    for (var s = i(t), o = 0; o < s.length; o++) {
                        if (s[o] !== "default") {
                            r(e, t, s[o]);
                        }
                    }
                }
                n(e, t);
                return e;
            });
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.NotesViewProvider = undefined;
            const a = o(s(398));
            const h = o(s(896));
            const c = o(s(756));
            const l = o(s(928));
            const u = s(862);
            e.NotesViewProvider = class {
                constructor(t, e) {
                    this.notesLocation = t;
                    this.notesExtensions = e;
                    this._onDidChangeTreeData = new a.EventEmitter();
                    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
                    this.folderMap = new Map();
                }
                init() {
                    this.refresh();
                    return this;
                }
                refresh() {
                    this._onDidChangeTreeData.fire(undefined);
                }
                getTreeItem(t) {
                    return t;
                }
                getChildren(t) {
                    if (this.notesLocation) {
                        if (t && t.isFolder) {
                            return Promise.resolve(this.getNotes(t.fullPath, this.notesExtensions));
                        } else if (t) {
                            return Promise.resolve([]);
                        } else {
                            return Promise.resolve(this.getNotes(this.notesLocation, this.notesExtensions));
                        }
                    } else {
                        return Promise.resolve([]);
                    }
                }
                getNotes(t, e) {
                    if (this.pathExists(t)) {
                        const s = [];
                        try {
                            const i = h.readdirSync(t, {
                                withFileTypes: true
                            });
                            for (const e of i) {
                                if (e.isDirectory()) {
                                    l.join(t, e.name);
                                    const i = new u.Note(e.name, t, "", "", true);
                                    s.push(i);
                                }
                            }
                            const r = e => new u.Note(l.basename(e), t, "", "", false, {
                                command: "Notes.openNote",
                                title: "",
                                arguments: [l.join(t, e)]
                            });
                            let n;
                            n = e === "*" ? c.sync("*", {
                                cwd: t,
                                nodir: true,
                                nocase: true
                            }).map(r) : c.sync(`*.{${e}}`, {
                                cwd: t,
                                nodir: true,
                                nocase: true
                            }).map(r);
                            s.push(...n);
                        } catch (t) {
                            console.error("Error reading directory:", t);
                        }
                        s.sort((t, e) => t.isFolder && !e.isFolder ? -1 : !t.isFolder && e.isFolder ? 1 : t.name.localeCompare(e.name));
                        return s;
                    }
                    return [];
                }
                pathExists(t) {
                    try {
                        h.accessSync(t);
                    } catch (t) {
                        return false;
                    }
                    return true;
                }
            };
        },
        972: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Ignore = undefined;
            const i = s(144);
            const r = s(478);
            const n = typeof process == "object" && process && typeof process.platform == "string" ? process.platform : "linux";
            e.Ignore = class {
                relative;
                relativeChildren;
                absolute;
                absoluteChildren;
                platform;
                mmopts;
                constructor(t, {
                    nobrace: e,
                    nocase: s,
                    noext: i,
                    noglobstar: r,
                    platform: o = n
                }) {
                    this.relative = [];
                    this.absolute = [];
                    this.relativeChildren = [];
                    this.absoluteChildren = [];
                    this.platform = o;
                    this.mmopts = {
                        dot: true,
                        nobrace: e,
                        nocase: s,
                        noext: i,
                        noglobstar: r,
                        optimizationLevel: 2,
                        platform: o,
                        nocomment: true,
                        nonegate: true
                    };
                    for (const e of t) {
                        this.add(e);
                    }
                }
                add(t) {
                    const e = new i.Minimatch(t, this.mmopts);
                    for (let t = 0; t < e.set.length; t++) {
                        const s = e.set[t];
                        const n = e.globParts[t];
                        if (!s || !n) {
                            throw new Error("invalid pattern object");
                        }
                        for (; s[0] === "." && n[0] === ".";) {
                            s.shift();
                            n.shift();
                        }
                        const o = new r.Pattern(s, n, 0, this.platform);
                        const a = new i.Minimatch(o.globString(), this.mmopts);
                        const h = n[n.length - 1] === "**";
                        const c = o.isAbsolute();
                        if (c) {
                            this.absolute.push(a);
                        } else {
                            this.relative.push(a);
                        }
                        if (h) {
                            if (c) {
                                this.absoluteChildren.push(a);
                            } else {
                                this.relativeChildren.push(a);
                            }
                        }
                    }
                }
                ignored(t) {
                    const e = t.fullpath();
                    const s = `${e}/`;
                    const i = t.relative() || ".";
                    const r = `${i}/`;
                    for (const t of this.relative) {
                        if (t.match(i) || t.match(r)) {
                            return true;
                        }
                    }
                    for (const t of this.absolute) {
                        if (t.match(e) || t.match(s)) {
                            return true;
                        }
                    }
                    return false;
                }
                childrenIgnored(t) {
                    const e = t.fullpath() + "/";
                    const s = (t.relative() || ".") + "/";
                    for (const t of this.relativeChildren) {
                        if (t.match(s)) {
                            return true;
                        }
                    }
                    for (const t of this.absoluteChildren) {
                        if (t.match(e)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
        },
        984: (t, e, s) => {
            "use strict";

            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.GlobStream = e.GlobWalker = e.GlobUtil = undefined;
            const i = s(420);
            const r = s(972);
            const n = s(800);
            class o {
                path;
                patterns;
                opts;
                seen = new Set();
                paused = false;
                aborted = false;
                #he = [];
                #ce;
                #le;
                signal;
                maxDepth;
                includeChildMatches;
                constructor(t, e, s) {
                    this.patterns = t;
                    this.path = e;
                    this.opts = s;
                    this.#le = s.posix || s.platform !== "win32" ? "/" : "\\";
                    this.includeChildMatches = s.includeChildMatches !== false;
                    if ((s.ignore || !this.includeChildMatches) && (this.#ce = ((t, e) => typeof t == "string" ? new r.Ignore([t], e) : Array.isArray(t) ? new r.Ignore(t, e) : t)(s.ignore ?? [], s), !this.includeChildMatches && typeof this.#ce.add != "function")) {
                        throw new Error("cannot ignore child matches, ignore lacks add() method.");
                    }
                    this.maxDepth = s.maxDepth || Infinity;
                    if (s.signal) {
                        this.signal = s.signal;
                        this.signal.addEventListener("abort", () => {
                            this.#he.length = 0;
                        });
                    }
                }
                #ue(t) {
                    return this.seen.has(t) || !!this.#ce?.ignored?.(t);
                }
                #pe(t) {
                    return !!this.#ce?.childrenIgnored?.(t);
                }
                pause() {
                    this.paused = true;
                }
                resume() {
                    if (this.signal?.aborted) {
                        return;
                    }
                    let t;
                    for (this.paused = false; !this.paused && (t = this.#he.shift());) {
                        t();
                    }
                }
                onResume(t) {
                    if (!this.signal?.aborted) {
                        if (this.paused) {
                            this.#he.push(t);
                        } else {
                            t();
                        }
                    }
                }
                async matchCheck(t, e) {
                    if (e && this.opts.nodir) {
                        return;
                    }
                    let s;
                    if (this.opts.realpath) {
                        s = t.realpathCached() || (await t.realpath());
                        if (!s) {
                            return;
                        }
                        t = s;
                    }
                    const i = t.isUnknown() || this.opts.stat ? await t.lstat() : t;
                    if (this.opts.follow && this.opts.nodir && i?.isSymbolicLink()) {
                        const t = await i.realpath();
                        if (t && (t.isUnknown() || this.opts.stat)) {
                            await t.lstat();
                        }
                    }
                    return this.matchCheckTest(i, e);
                }
                matchCheckTest(t, e) {
                    if (!t || !(this.maxDepth === Infinity || t.depth() <= this.maxDepth) || e && !t.canReaddir() || this.opts.nodir && t.isDirectory() || this.opts.nodir && this.opts.follow && t.isSymbolicLink() && t.realpathCached()?.isDirectory() || this.#ue(t)) {
                        return undefined;
                    } else {
                        return t;
                    }
                }
                matchCheckSync(t, e) {
                    if (e && this.opts.nodir) {
                        return;
                    }
                    let s;
                    if (this.opts.realpath) {
                        s = t.realpathCached() || t.realpathSync();
                        if (!s) {
                            return;
                        }
                        t = s;
                    }
                    const i = t.isUnknown() || this.opts.stat ? t.lstatSync() : t;
                    if (this.opts.follow && this.opts.nodir && i?.isSymbolicLink()) {
                        const t = i.realpathSync();
                        if (t && (t?.isUnknown() || this.opts.stat)) {
                            t.lstatSync();
                        }
                    }
                    return this.matchCheckTest(i, e);
                }
                matchFinish(t, e) {
                    if (this.#ue(t)) {
                        return;
                    }
                    if (!this.includeChildMatches && this.#ce?.add) {
                        const e = `${t.relativePosix()}/**`;
                        this.#ce.add(e);
                    }
                    const s = this.opts.absolute === undefined ? e : this.opts.absolute;
                    this.seen.add(t);
                    const i = this.opts.mark && t.isDirectory() ? this.#le : "";
                    if (this.opts.withFileTypes) {
                        this.matchEmit(t);
                    } else if (s) {
                        const e = this.opts.posix ? t.fullpathPosix() : t.fullpath();
                        this.matchEmit(e + i);
                    } else {
                        const e = this.opts.posix ? t.relativePosix() : t.relative();
                        const s = this.opts.dotRelative && !e.startsWith(".." + this.#le) ? "." + this.#le : "";
                        this.matchEmit(e ? s + e + i : "." + i);
                    }
                }
                async match(t, e, s) {
                    const i = await this.matchCheck(t, s);
                    if (i) {
                        this.matchFinish(i, e);
                    }
                }
                matchSync(t, e, s) {
                    const i = this.matchCheckSync(t, s);
                    if (i) {
                        this.matchFinish(i, e);
                    }
                }
                walkCB(t, e, s) {
                    if (this.signal?.aborted) {
                        s();
                    }
                    this.walkCB2(t, e, new n.Processor(this.opts), s);
                }
                walkCB2(t, e, s, i) {
                    if (this.#pe(t)) {
                        return i();
                    }
                    if (this.signal?.aborted) {
                        i();
                    }
                    if (this.paused) {
                        this.onResume(() => this.walkCB2(t, e, s, i));
                        return;
                    }
                    s.processPatterns(t, e);
                    let r = 1;
                    const n = () => {
                        if (--r == 0) {
                            i();
                        }
                    };
                    for (const [t, e, i] of s.matches.entries()) {
                        if (!this.#ue(t)) {
                            r++;
                            this.match(t, e, i).then(() => n());
                        }
                    }
                    for (const t of s.subwalkTargets()) {
                        if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                            continue;
                        }
                        r++;
                        const e = t.readdirCached();
                        if (t.calledReaddir()) {
                            this.walkCB3(t, e, s, n);
                        } else {
                            t.readdirCB((e, i) => this.walkCB3(t, i, s, n), true);
                        }
                    }
                    n();
                }
                walkCB3(t, e, s, i) {
                    s = s.filterEntries(t, e);
                    let r = 1;
                    const n = () => {
                        if (--r == 0) {
                            i();
                        }
                    };
                    for (const [t, e, i] of s.matches.entries()) {
                        if (!this.#ue(t)) {
                            r++;
                            this.match(t, e, i).then(() => n());
                        }
                    }
                    for (const [t, e] of s.subwalks.entries()) {
                        r++;
                        this.walkCB2(t, e, s.child(), n);
                    }
                    n();
                }
                walkCBSync(t, e, s) {
                    if (this.signal?.aborted) {
                        s();
                    }
                    this.walkCB2Sync(t, e, new n.Processor(this.opts), s);
                }
                walkCB2Sync(t, e, s, i) {
                    if (this.#pe(t)) {
                        return i();
                    }
                    if (this.signal?.aborted) {
                        i();
                    }
                    if (this.paused) {
                        this.onResume(() => this.walkCB2Sync(t, e, s, i));
                        return;
                    }
                    s.processPatterns(t, e);
                    let r = 1;
                    const n = () => {
                        if (--r == 0) {
                            i();
                        }
                    };
                    for (const [t, e, i] of s.matches.entries()) {
                        if (!this.#ue(t)) {
                            this.matchSync(t, e, i);
                        }
                    }
                    for (const t of s.subwalkTargets()) {
                        if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                            continue;
                        }
                        r++;
                        const e = t.readdirSync();
                        this.walkCB3Sync(t, e, s, n);
                    }
                    n();
                }
                walkCB3Sync(t, e, s, i) {
                    s = s.filterEntries(t, e);
                    let r = 1;
                    const n = () => {
                        if (--r == 0) {
                            i();
                        }
                    };
                    for (const [t, e, i] of s.matches.entries()) {
                        if (!this.#ue(t)) {
                            this.matchSync(t, e, i);
                        }
                    }
                    for (const [t, e] of s.subwalks.entries()) {
                        r++;
                        this.walkCB2Sync(t, e, s.child(), n);
                    }
                    n();
                }
            }
            e.GlobUtil = o;
            e.GlobWalker = class extends o {
                matches = new Set();
                constructor(t, e, s) {
                    super(t, e, s);
                }
                matchEmit(t) {
                    this.matches.add(t);
                }
                async walk() {
                    if (this.signal?.aborted) {
                        throw this.signal.reason;
                    }
                    if (this.path.isUnknown()) {
                        await this.path.lstat();
                    }
                    await new Promise((t, e) => {
                        this.walkCB(this.path, this.patterns, () => {
                            if (this.signal?.aborted) {
                                e(this.signal.reason);
                            } else {
                                t(this.matches);
                            }
                        });
                    });
                    return this.matches;
                }
                walkSync() {
                    if (this.signal?.aborted) {
                        throw this.signal.reason;
                    }
                    if (this.path.isUnknown()) {
                        this.path.lstatSync();
                    }
                    this.walkCBSync(this.path, this.patterns, () => {
                        if (this.signal?.aborted) {
                            throw this.signal.reason;
                        }
                    });
                    return this.matches;
                }
            };
            e.GlobStream = class extends o {
                results;
                constructor(t, e, s) {
                    super(t, e, s);
                    this.results = new i.Minipass({
                        signal: this.signal,
                        objectMode: true
                    });
                    this.results.on("drain", () => this.resume());
                    this.results.on("resume", () => this.resume());
                }
                matchEmit(t) {
                    this.results.write(t);
                    if (!this.results.flowing) {
                        this.pause();
                    }
                }
                stream() {
                    const t = this.path;
                    if (t.isUnknown()) {
                        t.lstat().then(() => {
                            this.walkCB(t, this.patterns, () => this.results.end());
                        });
                    } else {
                        this.walkCB(t, this.patterns, () => this.results.end());
                    }
                    return this.results;
                }
                streamSync() {
                    if (this.path.isUnknown()) {
                        this.path.lstatSync();
                    }
                    this.walkCBSync(this.path, this.patterns, () => this.results.end());
                    return this.results;
                }
            };
        }
    };
    var e = {};
    var s = function s(i) {
        var r = e[i];
        if (r !== undefined) {
            return r.exports;
        }
        var n = e[i] = {
            exports: {}
        };
        t[i].call(n.exports, n, n.exports, s);
        return n.exports;
    }(265);
    module.exports = s;
})();
//# sourceMappingURL=extension.js.map