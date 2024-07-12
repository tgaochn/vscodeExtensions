module.exports = function (t) {
    var e = {};
    function r(n) {
        if (e[n]) return e[n].exports;
        var i = e[n] = {
            i: n,
            l: false,
            exports: {}
        };
        return t[n].call(i.exports, i, i.exports, r), i.l = true, i.exports;
    }
    return r.m = t, r.c = e, r.d = function (t, e, n) {
        r.o(t, e) || Object.defineProperty(t, e, {
            enumerable: true,
            get: n
        });
    }, r.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: true
        });
    }, r.t = function (t, e) {
        if (1 & e && (t = r(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", {
            enumerable: true,
            value: t
        }), 2 & e && "string" != typeof t) for (var i in t) r.d(n, i, function (e) {
            return t[e];
        }.bind(null, i));
        return n;
    }, r.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default;
        } : function () {
            return t;
        };
        return r.d(e, "a", e), e;
    }, r.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }, r.p = "", r(r.s = 12);
}([function (t, e) {
    t.exports = require("path");
}, function (t, e) {
    t.exports = require("fs");
}, function (t, e) {
    t.exports = require("vscode");
}, function (t, e, r) {
    t.exports = u, u.Minimatch = l;
    var n = {
        sep: "/"
    };
    try {
        n = r(0);
    } catch (t) { }
    var i = u.GLOBSTAR = l.GLOBSTAR = {},
        o = r(15),
        s = {
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
        },
        a = "().*{}+?[]^$\\!".split("").reduce(function (t, e) {
            return t[e] = true, t;
        }, {});
    var c = /\/+/;
    function h(t, e) {
        t = t || {}, e = e || {};
        var r = {};
        return Object.keys(e).forEach(function (t) {
            r[t] = e[t];
        }), Object.keys(t).forEach(function (e) {
            r[e] = t[e];
        }), r;
    }
    function u(t, e, r) {
        if ("string" != typeof e) throw new TypeError("glob pattern string required");
        return r || (r = {}), !(!r.nocomment && "#" === e.charAt(0)) && ("" === e.trim() ? "" === t : new l(e, r).match(t));
    }
    function l(t, e) {
        if (!(this instanceof l)) return new l(t, e);
        if ("string" != typeof t) throw new TypeError("glob pattern string required");
        e || (e = {}), t = t.trim(), "/" !== n.sep && (t = t.split(n.sep).join("/")), this.options = e, this.set = [], this.pattern = t, this.regexp = null, this.negate = false, this.comment = false, this.empty = false, this.make();
    }
    function f(t, e) {
        if (e || (e = this instanceof l ? this.options : {}), undefined === (t = undefined === t ? this.pattern : t)) throw new TypeError("undefined pattern");
        return e.nobrace || !t.match(/\{.*\}/) ? [t] : o(t);
    }
    u.filter = function (t, e) {
        return e = e || {}, function (r, n, i) {
            return u(r, t, e);
        };
    }, u.defaults = function (t) {
        if (!t || !Object.keys(t).length) return u;
        var e = u,
            r = function (r, n, i) {
                return e.minimatch(r, n, h(t, i));
            };
        return r.Minimatch = function (r, n) {
            return new e.Minimatch(r, h(t, n));
        }, r;
    }, l.defaults = function (t) {
        return t && Object.keys(t).length ? u.defaults(t).Minimatch : l;
    }, l.prototype.debug = function () { }, l.prototype.make = function () {
        if (this._made) return;
        var t = this.pattern,
            e = this.options;
        if (!e.nocomment && "#" === t.charAt(0)) return void (this.comment = true);
        if (!t) return void (this.empty = true);
        this.parseNegate();
        var r = this.globSet = this.braceExpand();
        e.debug && (this.debug = console.error);
        this.debug(this.pattern, r), r = this.globParts = r.map(function (t) {
            return t.split(c);
        }), this.debug(this.pattern, r), r = r.map(function (t, e, r) {
            return t.map(this.parse, this);
        }, this), this.debug(this.pattern, r), r = r.filter(function (t) {
            return -1 === t.indexOf(false);
        }), this.debug(this.pattern, r), this.set = r;
    }, l.prototype.parseNegate = function () {
        var t = this.pattern,
            e = false,
            r = this.options,
            n = 0;
        if (r.nonegate) return;
        for (var i = 0, o = t.length; i < o && "!" === t.charAt(i); i++) e = !e, n++;
        n && (this.pattern = t.substr(n));
        this.negate = e;
    }, u.braceExpand = function (t, e) {
        return f(t, e);
    }, l.prototype.braceExpand = f, l.prototype.parse = function (t, e) {
        if (t.length > 65536) throw new TypeError("pattern is too long");
        var r = this.options;
        if (!r.noglobstar && "**" === t) return i;
        if ("" === t) return "";
        var n,
            o = "",
            c = !!r.nocase,
            h = false,
            u = [],
            l = [],
            f = false,
            d = -1,
            m = -1,
            g = "." === t.charAt(0) ? "" : r.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)",
            v = this;
        function y() {
            if (n) {
                switch (n) {
                    case "*":
                        o += "[^/]*?", c = true;
                        break;
                    case "?":
                        o += "[^/]", c = true;
                        break;
                    default:
                        o += "\\" + n;
                }
                v.debug("clearStateChar %j %j", n, o), n = false;
            }
        }
        for (var b, w = 0, _ = t.length; w < _ && (b = t.charAt(w)); w++) if (this.debug("%s\t%s %s %j", t, w, o, b), h && a[b]) o += "\\" + b, h = false; else switch (b) {
            case "/":
                return false;
            case "\\":
                y(), h = true;
                continue;
            case "?":
            case "*":
            case "+":
            case "@":
            case "!":
                if (this.debug("%s\t%s %s %j <-- stateChar", t, w, o, b), f) {
                    this.debug("  in class"), "!" === b && w === m + 1 && (b = "^"), o += b;
                    continue;
                }
                v.debug("call clearStateChar %j", n), y(), n = b, r.noext && y();
                continue;
            case "(":
                if (f) {
                    o += "(";
                    continue;
                }
                if (!n) {
                    o += "\\(";
                    continue;
                }
                u.push({
                    type: n,
                    start: w - 1,
                    reStart: o.length,
                    open: s[n].open,
                    close: s[n].close
                }), o += "!" === n ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", n, o), n = false;
                continue;
            case ")":
                if (f || !u.length) {
                    o += "\\)";
                    continue;
                }
                y(), c = true;
                var E = u.pop();
                o += E.close, "!" === E.type && l.push(E), E.reEnd = o.length;
                continue;
            case "|":
                if (f || !u.length || h) {
                    o += "\\|", h = false;
                    continue;
                }
                y(), o += "|";
                continue;
            case "[":
                if (y(), f) {
                    o += "\\" + b;
                    continue;
                }
                f = true, m = w, d = o.length, o += b;
                continue;
            case "]":
                if (w === m + 1 || !f) {
                    o += "\\" + b, h = false;
                    continue;
                }
                if (f) {
                    var O = t.substring(m + 1, w);
                    try {
                        RegExp("[" + O + "]");
                    } catch (t) {
                        var S = this.parse(O, p);
                        o = o.substr(0, d) + "\\[" + S[0] + "\\]", c = c || S[1], f = false;
                        continue;
                    }
                }
                c = true, f = false, o += b;
                continue;
            default:
                y(), h ? h = false : !a[b] || "^" === b && f || (o += "\\"), o += b;
        }
        f && (O = t.substr(m + 1), S = this.parse(O, p), o = o.substr(0, d) + "\\[" + S[0], c = c || S[1]);
        for (E = u.pop(); E; E = u.pop()) {
            var k = o.slice(E.reStart + E.open.length);
            this.debug("setting tail", o, E), k = k.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (t, e, r) {
                return r || (r = "\\"), e + e + r + "|";
            }), this.debug("tail=%j\n   %s", k, k, E, o);
            var x = "*" === E.type ? "[^/]*?" : "?" === E.type ? "[^/]" : "\\" + E.type;
            c = true, o = o.slice(0, E.reStart) + x + "\\(" + k;
        }
        y(), h && (o += "\\\\");
        var N = false;
        switch (o.charAt(0)) {
            case ".":
            case "[":
            case "(":
                N = true;
        }
        for (var A = l.length - 1; A > -1; A--) {
            var j = l[A],
                I = o.slice(0, j.reStart),
                L = o.slice(j.reStart, j.reEnd - 8),
                C = o.slice(j.reEnd - 8, j.reEnd),
                T = o.slice(j.reEnd);
            C += T;
            var M = I.split("(").length - 1,
                D = T;
            for (w = 0; w < M; w++) D = D.replace(/\)[+*?]?/, "");
            var R = "";
            "" === (T = D) && e !== p && (R = "$"), o = I + L + T + R + C;
        }
        "" !== o && c && (o = "(?=.)" + o);
        N && (o = g + o);
        if (e === p) return [o, c];
        if (!c) return function (t) {
            return t.replace(/\\(.)/g, "$1");
        }(t);
        var P = r.nocase ? "i" : "";
        try {
            var $ = new RegExp("^" + o + "$", P);
        } catch (t) {
            return new RegExp("$.");
        }
        return $._glob = t, $._src = o, $;
    };
    var p = {};
    u.makeRe = function (t, e) {
        return new l(t, e || {}).makeRe();
    }, l.prototype.makeRe = function () {
        if (this.regexp || false === this.regexp) return this.regexp;
        var t = this.set;
        if (!t.length) return this.regexp = false, this.regexp;
        var e = this.options,
            r = e.noglobstar ? "[^/]*?" : e.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?",
            n = e.nocase ? "i" : "",
            o = t.map(function (t) {
                return t.map(function (t) {
                    return t === i ? r : "string" == typeof t ? function (t) {
                        return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                    }(t) : t._src;
                }).join("\\/");
            }).join("|");
        o = "^(?:" + o + ")$", this.negate && (o = "^(?!" + o + ").*$");
        try {
            this.regexp = new RegExp(o, n);
        } catch (t) {
            this.regexp = false;
        }
        return this.regexp;
    }, u.match = function (t, e, r) {
        var n = new l(e, r = r || {});
        return t = t.filter(function (t) {
            return n.match(t);
        }), n.options.nonull && !t.length && t.push(e), t;
    }, l.prototype.match = function (t, e) {
        if (this.debug("match", t, this.pattern), this.comment) return false;
        if (this.empty) return "" === t;
        if ("/" === t && e) return true;
        var r = this.options;
        "/" !== n.sep && (t = t.split(n.sep).join("/"));
        t = t.split(c), this.debug(this.pattern, "split", t);
        var i,
            o,
            s = this.set;
        for (this.debug(this.pattern, "set", s), o = t.length - 1; o >= 0 && !(i = t[o]); o--);
        for (o = 0; o < s.length; o++) {
            var a = s[o],
                h = t;
            if (r.matchBase && 1 === a.length && (h = [i]), this.matchOne(h, a, e)) return !!r.flipNegate || !this.negate;
        }
        return !r.flipNegate && this.negate;
    }, l.prototype.matchOne = function (t, e, r) {
        var n = this.options;
        this.debug("matchOne", {
            this: this,
            file: t,
            pattern: e
        }), this.debug("matchOne", t.length, e.length);
        for (var o = 0, s = 0, a = t.length, c = e.length; o < a && s < c; o++, s++) {
            this.debug("matchOne loop");
            var h,
                u = e[s],
                l = t[o];
            if (this.debug(e, u, l), false === u) return false;
            if (u === i) {
                this.debug("GLOBSTAR", [e, u, l]);
                var f = o,
                    p = s + 1;
                if (p === c) {
                    for (this.debug("** at the end"); o < a; o++) if ("." === t[o] || ".." === t[o] || !n.dot && "." === t[o].charAt(0)) return false;
                    return true;
                }
                for (; f < a;) {
                    var d = t[f];
                    if (this.debug("\nglobstar while", t, f, e, p, d), this.matchOne(t.slice(f), e.slice(p), r)) return this.debug("globstar found match!", f, a, d), true;
                    if ("." === d || ".." === d || !n.dot && "." === d.charAt(0)) {
                        this.debug("dot detected!", t, f, e, p);
                        break;
                    }
                    this.debug("globstar swallow a segment, and continue"), f++;
                }
                return !(!r || (this.debug("\n>>> no match, partial?", t, f, e, p), f !== a));
            }
            if ("string" == typeof u ? (h = n.nocase ? l.toLowerCase() === u.toLowerCase() : l === u, this.debug("string match", u, l, h)) : (h = l.match(u), this.debug("pattern match", u, l, h)), !h) return false;
        }
        if (o === a && s === c) return true;
        if (o === a) return r;
        if (s === c) return o === a - 1 && "" === t[o];
        throw new Error("wtf?");
    };
}, function (t, e) {
    t.exports = require("util");
}, function (t, e, r) {
    "use strict";

    function n(t) {
        return "/" === t.charAt(0);
    }
    function i(t) {
        var e = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(t),
            r = e[1] || "",
            n = Boolean(r && ":" !== r.charAt(1));
        return Boolean(e[2] || n);
    }
    t.exports = "win32" === process.platform ? i : n, t.exports.posix = n, t.exports.win32 = i;
}, function (t, e, r) {
    t.exports = b;
    var n = r(1),
        i = r(7),
        o = r(3),
        s = (o.Minimatch, r(18)),
        a = r(20).EventEmitter,
        c = r(0),
        h = r(8),
        u = r(5),
        l = r(21),
        f = r(9),
        p = (f.alphasort, f.alphasorti, f.setopts),
        d = f.ownProp,
        m = r(22),
        g = (r(4), f.childrenIgnored),
        v = f.isIgnored,
        y = r(11);
    function b(t, e, r) {
        if ("function" == typeof e && (r = e, e = {}), e || (e = {}), e.sync) {
            if (r) throw new TypeError("callback provided to sync glob");
            return l(t, e);
        }
        return new _(t, e, r);
    }
    b.sync = l;
    var w = b.GlobSync = l.GlobSync;
    function _(t, e, r) {
        if ("function" == typeof e && (r = e, e = null), e && e.sync) {
            if (r) throw new TypeError("callback provided to sync glob");
            return new w(t, e);
        }
        if (!(this instanceof _)) return new _(t, e, r);
        p(this, t, e), this._didRealPath = false;
        var n = this.minimatch.set.length;
        this.matches = new Array(n), "function" == typeof r && (r = y(r), this.on("error", r), this.on("end", function (t) {
            r(null, t);
        }));
        var i = this;
        if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = false, this.noprocess) return this;
        if (0 === n) return s();
        for (var o = 0; o < n; o++) this._process(this.minimatch.set[o], o, false, s);
        function s() {
            --i._processing, i._processing <= 0 && i._finish();
        }
    }
    b.glob = b, b.hasMagic = function (t, e) {
        var r = function (t, e) {
            if (null === e || "object" != typeof e) return t;
            for (var r = Object.keys(e), n = r.length; n--;) t[r[n]] = e[r[n]];
            return t;
        }({}, e);
        r.noprocess = true;
        var n = new _(t, r).minimatch.set;
        if (!t) return false;
        if (n.length > 1) return true;
        for (var i = 0; i < n[0].length; i++) if ("string" != typeof n[0][i]) return true;
        return false;
    }, b.Glob = _, s(_, a), _.prototype._finish = function () {
        if (h(this instanceof _), !this.aborted) {
            if (this.realpath && !this._didRealpath) return this._realpath();
            f.finish(this), this.emit("end", this.found);
        }
    }, _.prototype._realpath = function () {
        if (!this._didRealpath) {
            this._didRealpath = true;
            var t = this.matches.length;
            if (0 === t) return this._finish();
            for (var e = this, r = 0; r < this.matches.length; r++) this._realpathSet(r, n);
        }
        function n() {
            0 == --t && e._finish();
        }
    }, _.prototype._realpathSet = function (t, e) {
        var r = this.matches[t];
        if (!r) return e();
        var n = Object.keys(r),
            o = this,
            s = n.length;
        if (0 === s) return e();
        var a = this.matches[t] = Object.create(null);
        n.forEach(function (r, n) {
            r = o._makeAbs(r), i.realpath(r, o.realpathCache, function (n, i) {
                n ? "stat" === n.syscall ? a[r] = true : o.emit("error", n) : a[i] = true, 0 == --s && (o.matches[t] = a, e());
            });
        });
    }, _.prototype._mark = function (t) {
        return f.mark(this, t);
    }, _.prototype._makeAbs = function (t) {
        return f.makeAbs(this, t);
    }, _.prototype.abort = function () {
        this.aborted = true, this.emit("abort");
    }, _.prototype.pause = function () {
        this.paused || (this.paused = true, this.emit("pause"));
    }, _.prototype.resume = function () {
        if (this.paused) {
            if (this.emit("resume"), this.paused = false, this._emitQueue.length) {
                var t = this._emitQueue.slice(0);
                this._emitQueue.length = 0;
                for (var e = 0; e < t.length; e++) {
                    var r = t[e];
                    this._emitMatch(r[0], r[1]);
                }
            }
            if (this._processQueue.length) {
                var n = this._processQueue.slice(0);
                this._processQueue.length = 0;
                for (e = 0; e < n.length; e++) {
                    var i = n[e];
                    this._processing--, this._process(i[0], i[1], i[2], i[3]);
                }
            }
        }
    }, _.prototype._process = function (t, e, r, n) {
        if (h(this instanceof _), h("function" == typeof n), !this.aborted) if (this._processing++, this.paused) this._processQueue.push([t, e, r, n]); else {
            for (var i, s = 0; "string" == typeof t[s];) s++;
            switch (s) {
                case t.length:
                    return void this._processSimple(t.join("/"), e, n);
                case 0:
                    i = null;
                    break;
                default:
                    i = t.slice(0, s).join("/");
            }
            var a,
                c = t.slice(s);
            null === i ? a = "." : u(i) || u(t.join("/")) ? (i && u(i) || (i = "/" + i), a = i) : a = i;
            var l = this._makeAbs(a);
            if (g(this, a)) return n();
            c[0] === o.GLOBSTAR ? this._processGlobStar(i, a, l, c, e, r, n) : this._processReaddir(i, a, l, c, e, r, n);
        }
    }, _.prototype._processReaddir = function (t, e, r, n, i, o, s) {
        var a = this;
        this._readdir(r, o, function (c, h) {
            return a._processReaddir2(t, e, r, n, i, o, h, s);
        });
    }, _.prototype._processReaddir2 = function (t, e, r, n, i, o, s, a) {
        if (!s) return a();
        for (var h = n[0], u = !!this.minimatch.negate, l = h._glob, f = this.dot || "." === l.charAt(0), p = [], d = 0; d < s.length; d++) {
            if ("." !== (g = s[d]).charAt(0) || f) (u && !t ? !g.match(h) : g.match(h)) && p.push(g);
        }
        var m = p.length;
        if (0 === m) return a();
        if (1 === n.length && !this.mark && !this.stat) {
            this.matches[i] || (this.matches[i] = Object.create(null));
            for (d = 0; d < m; d++) {
                var g = p[d];
                t && (g = "/" !== t ? t + "/" + g : t + g), "/" !== g.charAt(0) || this.nomount || (g = c.join(this.root, g)), this._emitMatch(i, g);
            }
            return a();
        }
        n.shift();
        for (d = 0; d < m; d++) {
            g = p[d];
            t && (g = "/" !== t ? t + "/" + g : t + g), this._process([g].concat(n), i, o, a);
        }
        a();
    }, _.prototype._emitMatch = function (t, e) {
        if (!this.aborted && !v(this, e)) if (this.paused) this._emitQueue.push([t, e]); else {
            var r = u(e) ? e : this._makeAbs(e);
            if (this.mark && (e = this._mark(e)), this.absolute && (e = r), !this.matches[t][e]) {
                if (this.nodir) {
                    var n = this.cache[r];
                    if ("DIR" === n || Array.isArray(n)) return;
                }
                this.matches[t][e] = true;
                var i = this.statCache[r];
                i && this.emit("stat", e, i), this.emit("match", e);
            }
        }
    }, _.prototype._readdirInGlobStar = function (t, e) {
        if (!this.aborted) {
            if (this.follow) return this._readdir(t, false, e);
            var r = this,
                i = m("lstat\0" + t, function (n, i) {
                    if (n && "ENOENT" === n.code) return e();
                    var o = i && i.isSymbolicLink();
                    r.symlinks[t] = o, o || !i || i.isDirectory() ? r._readdir(t, false, e) : (r.cache[t] = "FILE", e());
                });
            i && n.lstat(t, i);
        }
    }, _.prototype._readdir = function (t, e, r) {
        if (!this.aborted && (r = m("readdir\0" + t + "\0" + e, r))) {
            if (e && !d(this.symlinks, t)) return this._readdirInGlobStar(t, r);
            if (d(this.cache, t)) {
                var i = this.cache[t];
                if (!i || "FILE" === i) return r();
                if (Array.isArray(i)) return r(null, i);
            }
            n.readdir(t, function (t, e, r) {
                return function (n, i) {
                    n ? t._readdirError(e, n, r) : t._readdirEntries(e, i, r);
                };
            }(this, t, r));
        }
    }, _.prototype._readdirEntries = function (t, e, r) {
        if (!this.aborted) {
            if (!this.mark && !this.stat) for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i = "/" === t ? t + i : t + "/" + i, this.cache[i] = true;
            }
            return this.cache[t] = e, r(null, e);
        }
    }, _.prototype._readdirError = function (t, e, r) {
        if (!this.aborted) {
            switch (e.code) {
                case "ENOTSUP":
                case "ENOTDIR":
                    var n = this._makeAbs(t);
                    if (this.cache[n] = "FILE", n === this.cwdAbs) {
                        var i = new Error(e.code + " invalid cwd " + this.cwd);
                        i.path = this.cwd, i.code = e.code, this.emit("error", i), this.abort();
                    }
                    break;
                case "ENOENT":
                case "ELOOP":
                case "ENAMETOOLONG":
                case "UNKNOWN":
                    this.cache[this._makeAbs(t)] = false;
                    break;
                default:
                    this.cache[this._makeAbs(t)] = false, this.strict && (this.emit("error", e), this.abort()), this.silent || console.error("glob error", e);
            }
            return r();
        }
    }, _.prototype._processGlobStar = function (t, e, r, n, i, o, s) {
        var a = this;
        this._readdir(r, o, function (c, h) {
            a._processGlobStar2(t, e, r, n, i, o, h, s);
        });
    }, _.prototype._processGlobStar2 = function (t, e, r, n, i, o, s, a) {
        if (!s) return a();
        var c = n.slice(1),
            h = t ? [t] : [],
            u = h.concat(c);
        this._process(u, i, false, a);
        var l = this.symlinks[r],
            f = s.length;
        if (l && o) return a();
        for (var p = 0; p < f; p++) {
            if ("." !== s[p].charAt(0) || this.dot) {
                var d = h.concat(s[p], c);
                this._process(d, i, true, a);
                var m = h.concat(s[p], n);
                this._process(m, i, true, a);
            }
        }
        a();
    }, _.prototype._processSimple = function (t, e, r) {
        var n = this;
        this._stat(t, function (i, o) {
            n._processSimple2(t, e, i, o, r);
        });
    }, _.prototype._processSimple2 = function (t, e, r, n, i) {
        if (this.matches[e] || (this.matches[e] = Object.create(null)), !n) return i();
        if (t && u(t) && !this.nomount) {
            var o = /[\/\\]$/.test(t);
            "/" === t.charAt(0) ? t = c.join(this.root, t) : (t = c.resolve(this.root, t), o && (t += "/"));
        }
        "win32" === process.platform && (t = t.replace(/\\/g, "/")), this._emitMatch(e, t), i();
    }, _.prototype._stat = function (t, e) {
        var r = this._makeAbs(t),
            i = "/" === t.slice(-1);
        if (t.length > this.maxLength) return e();
        if (!this.stat && d(this.cache, r)) {
            var o = this.cache[r];
            if (Array.isArray(o) && (o = "DIR"), !i || "DIR" === o) return e(null, o);
            if (i && "FILE" === o) return e();
        }
        var s = this.statCache[r];
        if (undefined !== s) {
            if (false === s) return e(null, s);
            var a = s.isDirectory() ? "DIR" : "FILE";
            return i && "FILE" === a ? e() : e(null, a, s);
        }
        var c = this,
            h = m("stat\0" + r, function (i, o) {
                if (o && o.isSymbolicLink()) return n.stat(r, function (n, i) {
                    n ? c._stat2(t, r, null, o, e) : c._stat2(t, r, n, i, e);
                });
                c._stat2(t, r, i, o, e);
            });
        h && n.lstat(r, h);
    }, _.prototype._stat2 = function (t, e, r, n, i) {
        if (r && ("ENOENT" === r.code || "ENOTDIR" === r.code)) return this.statCache[e] = false, i();
        var o = "/" === t.slice(-1);
        if (this.statCache[e] = n, "/" === e.slice(-1) && n && !n.isDirectory()) return i(null, false, n);
        var s = true;
        return n && (s = n.isDirectory() ? "DIR" : "FILE"), this.cache[e] = this.cache[e] || s, o && "FILE" === s ? i() : i(null, s, n);
    };
}, function (t, e, r) {
    t.exports = u, u.realpath = u, u.sync = l, u.realpathSync = l, u.monkeypatch = function () {
        n.realpath = u, n.realpathSync = l;
    }, u.unmonkeypatch = function () {
        n.realpath = i, n.realpathSync = o;
    };
    var n = r(1),
        i = n.realpath,
        o = n.realpathSync,
        s = process.version,
        a = /^v[0-5]\./.test(s),
        c = r(14);
    function h(t) {
        return t && "realpath" === t.syscall && ("ELOOP" === t.code || "ENOMEM" === t.code || "ENAMETOOLONG" === t.code);
    }
    function u(t, e, r) {
        if (a) return i(t, e, r);
        "function" == typeof e && (r = e, e = null), i(t, e, function (n, i) {
            h(n) ? c.realpath(t, e, r) : r(n, i);
        });
    }
    function l(t, e) {
        if (a) return o(t, e);
        try {
            return o(t, e);
        } catch (r) {
            if (h(r)) return c.realpathSync(t, e);
            throw r;
        }
    }
}, function (t, e) {
    t.exports = require("assert");
}, function (t, e, r) {
    function n(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }
    e.alphasort = h, e.alphasorti = c, e.setopts = function (t, e, r) {
        r || (r = {});
        if (r.matchBase && -1 === e.indexOf("/")) {
            if (r.noglobstar) throw new Error("base matching requires globstar");
            e = "**/" + e;
        }
        t.silent = !!r.silent, t.pattern = e, t.strict = false !== r.strict, t.realpath = !!r.realpath, t.realpathCache = r.realpathCache || Object.create(null), t.follow = !!r.follow, t.dot = !!r.dot, t.mark = !!r.mark, t.nodir = !!r.nodir, t.nodir && (t.mark = true);
        t.sync = !!r.sync, t.nounique = !!r.nounique, t.nonull = !!r.nonull, t.nosort = !!r.nosort, t.nocase = !!r.nocase, t.stat = !!r.stat, t.noprocess = !!r.noprocess, t.absolute = !!r.absolute, t.maxLength = r.maxLength || Infinity, t.cache = r.cache || Object.create(null), t.statCache = r.statCache || Object.create(null), t.symlinks = r.symlinks || Object.create(null), function (t, e) {
            t.ignore = e.ignore || [], Array.isArray(t.ignore) || (t.ignore = [t.ignore]);
            t.ignore.length && (t.ignore = t.ignore.map(u));
        }(t, r), t.changedCwd = false;
        var o = process.cwd();
        n(r, "cwd") ? (t.cwd = i.resolve(r.cwd), t.changedCwd = t.cwd !== o) : t.cwd = o;
        t.root = r.root || i.resolve(t.cwd, "/"), t.root = i.resolve(t.root), "win32" === process.platform && (t.root = t.root.replace(/\\/g, "/"));
        t.cwdAbs = s(t.cwd) ? t.cwd : l(t, t.cwd), "win32" === process.platform && (t.cwdAbs = t.cwdAbs.replace(/\\/g, "/"));
        t.nomount = !!r.nomount, r.nonegate = true, r.nocomment = true, t.minimatch = new a(e, r), t.options = t.minimatch.options;
    }, e.ownProp = n, e.makeAbs = l, e.finish = function (t) {
        for (var e = t.nounique, r = e ? [] : Object.create(null), n = 0, i = t.matches.length; n < i; n++) {
            var o = t.matches[n];
            if (o && 0 !== Object.keys(o).length) {
                var s = Object.keys(o);
                e ? r.push.apply(r, s) : s.forEach(function (t) {
                    r[t] = true;
                });
            } else if (t.nonull) {
                var a = t.minimatch.globSet[n];
                e ? r.push(a) : r[a] = true;
            }
        }
        e || (r = Object.keys(r));
        t.nosort || (r = r.sort(t.nocase ? c : h));
        if (t.mark) {
            for (n = 0; n < r.length; n++) r[n] = t._mark(r[n]);
            t.nodir && (r = r.filter(function (e) {
                var r = !/\/$/.test(e),
                    n = t.cache[e] || t.cache[l(t, e)];
                return r && n && (r = "DIR" !== n && !Array.isArray(n)), r;
            }));
        }
        t.ignore.length && (r = r.filter(function (e) {
            return !f(t, e);
        }));
        t.found = r;
    }, e.mark = function (t, e) {
        var r = l(t, e),
            n = t.cache[r],
            i = e;
        if (n) {
            var o = "DIR" === n || Array.isArray(n),
                s = "/" === e.slice(-1);
            if (o && !s ? i += "/" : !o && s && (i = i.slice(0, -1)), i !== e) {
                var a = l(t, i);
                t.statCache[a] = t.statCache[r], t.cache[a] = t.cache[r];
            }
        }
        return i;
    }, e.isIgnored = f, e.childrenIgnored = function (t, e) {
        return !!t.ignore.length && t.ignore.some(function (t) {
            return !(!t.gmatcher || !t.gmatcher.match(e));
        });
    };
    var i = r(0),
        o = r(3),
        s = r(5),
        a = o.Minimatch;
    function c(t, e) {
        return t.toLowerCase().localeCompare(e.toLowerCase());
    }
    function h(t, e) {
        return t.localeCompare(e);
    }
    function u(t) {
        var e = null;
        if ("/**" === t.slice(-3)) {
            var r = t.replace(/(\/\*\*)+$/, "");
            e = new a(r, {
                dot: true
            });
        }
        return {
            matcher: new a(t, {
                dot: true
            }),
            gmatcher: e
        };
    }
    function l(t, e) {
        var r = e;
        return r = "/" === e.charAt(0) ? i.join(t.root, e) : s(e) || "" === e ? e : t.changedCwd ? i.resolve(t.cwd, e) : i.resolve(e), "win32" === process.platform && (r = r.replace(/\\/g, "/")), r;
    }
    function f(t, e) {
        return !!t.ignore.length && t.ignore.some(function (t) {
            return t.matcher.match(e) || !(!t.gmatcher || !t.gmatcher.match(e));
        });
    }
}, function (t, e) {
    t.exports = function t(e, r) {
        if (e && r) return t(e)(r);
        if ("function" != typeof e) throw new TypeError("need wrapper function");
        return Object.keys(e).forEach(function (t) {
            n[t] = e[t];
        }), n;
        function n() {
            for (var t = new Array(arguments.length), r = 0; r < t.length; r++) t[r] = arguments[r];
            var n = e.apply(this, t),
                i = t[t.length - 1];
            return "function" == typeof n && n !== i && Object.keys(i).forEach(function (t) {
                n[t] = i[t];
            }), n;
        }
    };
}, function (t, e, r) {
    var n = r(10);
    function i(t) {
        var e = function () {
            return e.called ? e.value : (e.called = true, e.value = t.apply(this, arguments));
        };
        return e.called = false, e;
    }
    function o(t) {
        var e = function () {
            if (e.called) throw new Error(e.onceError);
            return e.called = true, e.value = t.apply(this, arguments);
        },
            r = t.name || "Function wrapped with `once`";
        return e.onceError = r + " shouldn't be called more than once", e.called = false, e;
    }
    t.exports = n(i), t.exports.strict = n(o), i.proto = i(function () {
        Object.defineProperty(Function.prototype, "once", {
            value: function () {
                return i(this);
            },
            configurable: true
        }), Object.defineProperty(Function.prototype, "onceStrict", {
            value: function () {
                return o(this);
            },
            configurable: true
        });
    });
}, function (t, e, r) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
        value: true
    });
    const n = r(2),
        i = r(1),
        o = r(0),
        s = r(13);
    e.activate = function (t) {
        console.log('"vscode-notes" is active.');
        let e = new s.NotesProvider(String(a.getNotesLocation()));
        if (n.window.registerTreeDataProvider("notes", e.init()), !a.getNotesLocation()) return void n.window.showWarningMessage("You need to select a notes storage location before you can start using Notes.", "Select", "Cancel").then(t => {
            "Select" === t && a.setupNotes();
        });
        let r = n.commands.registerCommand("Notes.deleteNote", t => {
            a.deleteNote(t, e);
        });
        t.subscriptions.push(r);
        let i = n.commands.registerCommand("Notes.listNotes", () => {
            a.listNotes();
        });
        t.subscriptions.push(i);
        let o = n.commands.registerCommand("Notes.newNote", () => {
            a.newNote(e);
        });
        t.subscriptions.push(o);
        let oo = n.commands.registerCommand("Notes.newNote2", () => {
            a.newNote2(e);
        });
        t.subscriptions.push(oo);
        let c = n.commands.registerCommand("Notes.openNote", t => {
            a.openNote(t);
        });
        t.subscriptions.push(c);
        let h = n.commands.registerCommand("Notes.refreshNotes", () => {
            a.refreshNotes(e);
        });
        t.subscriptions.push(h);
        let u = n.commands.registerCommand("Notes.renameNote", t => {
            a.renameNote(t, e);
        });
        t.subscriptions.push(u);
        let l = n.commands.registerCommand("Notes.setupNotes", () => {
            a.setupNotes();
        });
        t.subscriptions.push(l);
    }, e.deactivate = function () { };
    class a {
        constructor(t) {
            this.settings = t, this.settings = n.workspace.getConfiguration("vscode-notes");
        }
        static getNotesLocation() {
            return n.workspace.getConfiguration("Notes").get("notesLocation");
        }
        static deleteNote(t, e) {
            // n.window.showWarningMessage(`Are you sure you want to delete '${t.name}'? This action is permanent and can not be reversed.`, "Yes", "No").then(r => {
            //     "Yes" === r && (i.unlink(o.join(String(t.location), String(t.name)), e => {
            //         if (e) return console.error(e), n.window.showErrorMessage(`Failed to delete ${t.name}.`);
            //         n.window.showInformationMessage(`Successfully deleted ${t.name}.`);
            //     }), e.refresh());
            // });

            // ! directly remove the file
            n.window.showWarningMessage(`Trying to delete '${t.name}'. This action is permanent and can not be reversed.`).then(r => {
                (i.unlink(o.join(String(t.location), String(t.name)), e => {
                    if (e) return console.error(e), n.window.showErrorMessage(`Failed to delete ${t.name}.`);
                    n.window.showInformationMessage(`Successfully deleted ${t.name}.`);
                }), e.refresh());
            });
        }
        static listNotes() {
            let t = String(a.getNotesLocation());
            i.readdir(String(t), (e, r) => {
                if (e) return console.error(e), n.window.showErrorMessage("Failed to read the notes folder.");
                n.window.showQuickPick(r).then(e => {
                    n.window.showTextDocument(n.Uri.file(o.join(String(t), String(e))));
                });
            });
        }
        static newNote(t) {
            let e = String(a.getNotesLocation());

            // get current date
            let date = new Date();
            let formattedDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 ";
            let dayOfWeek = date.toLocaleString('zh-US', { weekday: 'long' });
            formattedDate += dayOfWeek

            n.window.showInputBox({
                prompt: "Note name?",
                value: formattedDate
            }).then(r => {
                let s = `${r}`,
                    a = o.join(String(e), `${s.replace(/\:/gi, "")}.md`),
                    // c = "# " + s + "\n\n",
                    c = "",
                    h = i.existsSync(String(a));
                if (r) {
                    if (h) return n.window.showWarningMessage("A note with that name already exists.");
                    i.writeFile(a, c, t => {
                        if (t) return console.error(t), n.window.showErrorMessage("Failed to create the new note.");
                        {
                            let t = n.Uri.file(a);
                            n.window.showTextDocument(t).then(() => {
                                n.commands.executeCommand("cursorMove", {
                                    to: "viewPortBottom"
                                });
                            });
                        }
                    }), t.refresh();
                }
            });
        }
        static newNote2(t) {
            let note_path = String(a.getNotesLocation());

            // ! my changes starts here
            // get current date
            let date = new Date();
            let formattedDate = date.getFullYear() + "年" +
                (date.getMonth() + 1).toString().padStart(2, '0') + "月" +
                date.getDate().toString().padStart(2, '0') + "日 ";
            let dayOfWeek = date.toLocaleString('zh-US', { weekday: 'long' });
            formattedDate += dayOfWeek

            // create a file directly
            let r = formattedDate;
            let s = `${r}`;
            let fn_full = o.join(String(note_path), `${s.replace(/\:/gi, "")}.md`);
            if (i.existsSync(String(fn_full))) return n.window.showWarningMessage("A note with that name already exists.");
            i.writeFile(fn_full, "", t => {
                if (t) return console.error(t), n.window.showErrorMessage("Failed to create the new note.");
                {
                    let t = n.Uri.file(fn_full);
                    n.window.showTextDocument(t).then(() => {
                        n.commands.executeCommand("cursorMove", {
                            to: "viewPortBottom"
                        });
                    });
                }
            }), t.refresh();
        }
        static openNote(t) {
            let e = String(a.getNotesLocation());
            n.window.showTextDocument(n.Uri.file(o.join(String(e), String(t))));
        }
        static refreshNotes(t) {
            t.refresh();
        }
        static renameNote(t, e) {
            n.window.showInputBox({
                prompt: "New note name?",
                value: t.name
            }).then(r => {
                if (!r || r === t.name) return;
                let s = r,
                    a = o.join(t.location, s);
                i.existsSync(a) ? n.window.showWarningMessage(`'${s}' already exists.`) : (n.window.showInformationMessage(`'${t.name}' renamed to '${s}'.`), i.renameSync(o.join(t.location, t.name), a), e.refresh());
            });
        }
        static setupNotes() {
            n.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: "Select"
            }).then(t => {
                if (t && t[0]) {
                    n.workspace.getConfiguration("Notes").update("notesLocation", o.normalize(t[0].fsPath), true).then(() => {
                        n.window.showWarningMessage("You must reload the window for the storage location change to take effect.", "Reload").then(t => {
                            "Reload" === t && n.commands.executeCommand("workbench.action.reloadWindow");
                        });
                    });
                }
            });
        }
    }
    e.Notes = a;
}, function (t, e, r) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
        value: true
    });
    const n = r(2),
        i = r(1),
        o = r(6),
        s = r(0),
        a = r(23);
    e.NotesProvider = class {
        constructor(t) {
            this.notesLocation = t, this._onDidChangeTreeData = new n.EventEmitter(), this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        }
        init() {
            return this.refresh(), this;
        }
        refresh() {
            this._onDidChangeTreeData.fire();
        }
        getTreeItem(t) {
            return t;
        }
        getChildren(t) {
            return this.notesLocation ? t ? Promise.resolve([]) : Promise.resolve(this.getNotes(this.notesLocation)) : Promise.resolve([]);
        }
        getNotes(t) {
            if (this.pathExists(t)) {
                const e = e => new a.Note(s.basename(e), t, n.TreeItemCollapsibleState.None, {
                    command: "Notes.openNote",
                    title: "",
                    arguments: [e]
                });
                return o.sync("*.md", {
                    cwd: t,
                    nodir: true,
                    nocase: true
                }).map(e);
            }
            return [];
        }
        pathExists(t) {
            try {
                i.accessSync(t);
            } catch (t) {
                return false;
            }
            return true;
        }
    };
}, function (t, e, r) {
    var n = r(0),
        i = "win32" === process.platform,
        o = r(1),
        s = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function a(t) {
        return "function" == typeof t ? t : function () {
            var t;
            if (s) {
                var e = new Error();
                t = function (t) {
                    t && (e.message = t.message, r(t = e));
                };
            } else t = r;
            return t;
            function r(t) {
                if (t) {
                    if (process.throwDeprecation) throw t;
                    if (!process.noDeprecation) {
                        var e = "fs: missing callback " + (t.stack || t.message);
                        process.traceDeprecation ? console.trace(e) : console.error(e);
                    }
                }
            }
        }();
    }
    n.normalize;
    if (i) var c = /(.*?)(?:[\/\\]+|$)/g; else c = /(.*?)(?:[\/]+|$)/g;
    if (i) var h = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/; else h = /^[\/]*/;
    e.realpathSync = function (t, e) {
        if (t = n.resolve(t), e && Object.prototype.hasOwnProperty.call(e, t)) return e[t];
        var r,
            s,
            a,
            u,
            l = t,
            f = {},
            p = {};
        function d() {
            var e = h.exec(t);
            r = e[0].length, s = e[0], a = e[0], u = "", i && !p[a] && (o.lstatSync(a), p[a] = true);
        }
        for (d(); r < t.length;) {
            c.lastIndex = r;
            var m = c.exec(t);
            if (u = s, s += m[0], a = u + m[1], r = c.lastIndex, !(p[a] || e && e[a] === a)) {
                var g;
                if (e && Object.prototype.hasOwnProperty.call(e, a)) g = e[a]; else {
                    var v = o.lstatSync(a);
                    if (!v.isSymbolicLink()) {
                        p[a] = true, e && (e[a] = a);
                        continue;
                    }
                    var y = null;
                    if (!i) {
                        var b = v.dev.toString(32) + ":" + v.ino.toString(32);
                        f.hasOwnProperty(b) && (y = f[b]);
                    }
                    null === y && (o.statSync(a), y = o.readlinkSync(a)), g = n.resolve(u, y), e && (e[a] = g), i || (f[b] = y);
                }
                t = n.resolve(g, t.slice(r)), d();
            }
        }
        return e && (e[l] = t), t;
    }, e.realpath = function (t, e, r) {
        if ("function" != typeof r && (r = a(e), e = null), t = n.resolve(t), e && Object.prototype.hasOwnProperty.call(e, t)) return process.nextTick(r.bind(null, null, e[t]));
        var s,
            u,
            l,
            f,
            p = t,
            d = {},
            m = {};
        function g() {
            var e = h.exec(t);
            s = e[0].length, u = e[0], l = e[0], f = "", i && !m[l] ? o.lstat(l, function (t) {
                if (t) return r(t);
                m[l] = true, v();
            }) : process.nextTick(v);
        }
        function v() {
            if (s >= t.length) return e && (e[p] = t), r(null, t);
            c.lastIndex = s;
            var n = c.exec(t);
            return f = u, u += n[0], l = f + n[1], s = c.lastIndex, m[l] || e && e[l] === l ? process.nextTick(v) : e && Object.prototype.hasOwnProperty.call(e, l) ? w(e[l]) : o.lstat(l, y);
        }
        function y(t, n) {
            if (t) return r(t);
            if (!n.isSymbolicLink()) return m[l] = true, e && (e[l] = l), process.nextTick(v);
            if (!i) {
                var s = n.dev.toString(32) + ":" + n.ino.toString(32);
                if (d.hasOwnProperty(s)) return b(null, d[s], l);
            }
            o.stat(l, function (t) {
                if (t) return r(t);
                o.readlink(l, function (t, e) {
                    i || (d[s] = e), b(t, e);
                });
            });
        }
        function b(t, i, o) {
            if (t) return r(t);
            var s = n.resolve(f, i);
            e && (e[o] = s), w(s);
        }
        function w(e) {
            t = n.resolve(e, t.slice(s)), g();
        }
        g();
    };
}, function (t, e, r) {
    var n = r(16),
        i = r(17);
    t.exports = function (t) {
        if (!t) return [];
        "{}" === t.substr(0, 2) && (t = "\\{\\}" + t.substr(2));
        return function t(e, r) {
            var o = [],
                s = i("{", "}", e);
            if (!s || /\$$/.test(s.pre)) return [e];
            var c,
                h = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(s.body),
                l = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(s.body),
                g = h || l,
                v = s.body.indexOf(",") >= 0;
            if (!g && !v) return s.post.match(/,.*\}/) ? (e = s.pre + "{" + s.body + a + s.post, t(e)) : [e];
            if (g) c = s.body.split(/\.\./); else {
                if (1 === (c = function t(e) {
                    if (!e) return [""];
                    var r = [],
                        n = i("{", "}", e);
                    if (!n) return e.split(",");
                    var o = n.pre,
                        s = n.body,
                        a = n.post,
                        c = o.split(",");
                    c[c.length - 1] += "{" + s + "}";
                    var h = t(a);
                    a.length && (c[c.length - 1] += h.shift(), c.push.apply(c, h));
                    return r.push.apply(r, c), r;
                }(s.body)).length) if (1 === (c = t(c[0], false).map(f)).length) return (w = s.post.length ? t(s.post, false) : [""]).map(function (t) {
                    return s.pre + c[0] + t;
                });
            }
            var y,
                b = s.pre,
                w = s.post.length ? t(s.post, false) : [""];
            if (g) {
                var _ = u(c[0]),
                    E = u(c[1]),
                    O = Math.max(c[0].length, c[1].length),
                    S = 3 == c.length ? Math.abs(u(c[2])) : 1,
                    k = d;
                E < _ && (S *= -1, k = m);
                var x = c.some(p);
                y = [];
                for (var N = _; N <= E; N += S) {
                    var A;
                    if (l) "\\" === (A = String.fromCharCode(N)) && (A = ""); else if (A = String(N), x) {
                        var j = O - A.length;
                        if (j > 0) {
                            var I = new Array(j + 1).join("0");
                            A = N < 0 ? "-" + I + A.slice(1) : I + A;
                        }
                    }
                    y.push(A);
                }
            } else y = n(c, function (e) {
                return t(e, false);
            });
            for (var L = 0; L < y.length; L++) for (var C = 0; C < w.length; C++) {
                var T = b + y[L] + w[C];
                (!r || g || T) && o.push(T);
            }
            return o;
        }(function (t) {
            return t.split("\\\\").join(o).split("\\{").join(s).split("\\}").join(a).split("\\,").join(c).split("\\.").join(h);
        }(t), true).map(l);
    };
    var o = "\0SLASH" + Math.random() + "\0",
        s = "\0OPEN" + Math.random() + "\0",
        a = "\0CLOSE" + Math.random() + "\0",
        c = "\0COMMA" + Math.random() + "\0",
        h = "\0PERIOD" + Math.random() + "\0";
    function u(t) {
        return parseInt(t, 10) == t ? parseInt(t, 10) : t.charCodeAt(0);
    }
    function l(t) {
        return t.split(o).join("\\").split(s).join("{").split(a).join("}").split(c).join(",").split(h).join(".");
    }
    function f(t) {
        return "{" + t + "}";
    }
    function p(t) {
        return /^-?0\d/.test(t);
    }
    function d(t, e) {
        return t <= e;
    }
    function m(t, e) {
        return t >= e;
    }
}, function (t, e) {
    t.exports = function (t, e) {
        for (var n = [], i = 0; i < t.length; i++) {
            var o = e(t[i], i);
            r(o) ? n.push.apply(n, o) : n.push(o);
        }
        return n;
    };
    var r = Array.isArray || function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    };
}, function (t, e, r) {
    "use strict";

    function n(t, e, r) {
        t instanceof RegExp && (t = i(t, r)), e instanceof RegExp && (e = i(e, r));
        var n = o(t, e, r);
        return n && {
            start: n[0],
            end: n[1],
            pre: r.slice(0, n[0]),
            body: r.slice(n[0] + t.length, n[1]),
            post: r.slice(n[1] + e.length)
        };
    }
    function i(t, e) {
        var r = e.match(t);
        return r ? r[0] : null;
    }
    function o(t, e, r) {
        var n,
            i,
            o,
            s,
            a,
            c = r.indexOf(t),
            h = r.indexOf(e, c + 1),
            u = c;
        if (c >= 0 && h > 0) {
            for (n = [], o = r.length; u >= 0 && !a;) u == c ? (n.push(u), c = r.indexOf(t, u + 1)) : 1 == n.length ? a = [n.pop(), h] : ((i = n.pop()) < o && (o = i, s = h), h = r.indexOf(e, u + 1)), u = c < h && c >= 0 ? c : h;
            n.length && (a = [o, s]);
        }
        return a;
    }
    t.exports = n, n.range = o;
}, function (t, e, r) {
    try {
        var n = r(4);
        if ("function" != typeof n.inherits) throw "";
        t.exports = n.inherits;
    } catch (e) {
        t.exports = r(19);
    }
}, function (t, e) {
    "function" == typeof Object.create ? t.exports = function (t, e) {
        e && (t.super_ = e, t.prototype = Object.create(e.prototype, {
            constructor: {
                value: t,
                enumerable: false,
                writable: true,
                configurable: true
            }
        }));
    } : t.exports = function (t, e) {
        if (e) {
            t.super_ = e;
            var r = function () { };
            r.prototype = e.prototype, t.prototype = new r(), t.prototype.constructor = t;
        }
    };
}, function (t, e) {
    t.exports = require("events");
}, function (t, e, r) {
    t.exports = d, d.GlobSync = m;
    var n = r(1),
        i = r(7),
        o = r(3),
        s = (o.Minimatch, r(6).Glob, r(4), r(0)),
        a = r(8),
        c = r(5),
        h = r(9),
        u = (h.alphasort, h.alphasorti, h.setopts),
        l = h.ownProp,
        f = h.childrenIgnored,
        p = h.isIgnored;
    function d(t, e) {
        if ("function" == typeof e || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
        return new m(t, e).found;
    }
    function m(t, e) {
        if (!t) throw new Error("must provide pattern");
        if ("function" == typeof e || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
        if (!(this instanceof m)) return new m(t, e);
        if (u(this, t, e), this.noprocess) return this;
        var r = this.minimatch.set.length;
        this.matches = new Array(r);
        for (var n = 0; n < r; n++) this._process(this.minimatch.set[n], n, false);
        this._finish();
    }
    m.prototype._finish = function () {
        if (a(this instanceof m), this.realpath) {
            var t = this;
            this.matches.forEach(function (e, r) {
                var n = t.matches[r] = Object.create(null);
                for (var o in e) try {
                    o = t._makeAbs(o), n[i.realpathSync(o, t.realpathCache)] = true;
                } catch (e) {
                    if ("stat" !== e.syscall) throw e;
                    n[t._makeAbs(o)] = true;
                }
            });
        }
        h.finish(this);
    }, m.prototype._process = function (t, e, r) {
        a(this instanceof m);
        for (var n, i = 0; "string" == typeof t[i];) i++;
        switch (i) {
            case t.length:
                return void this._processSimple(t.join("/"), e);
            case 0:
                n = null;
                break;
            default:
                n = t.slice(0, i).join("/");
        }
        var s,
            h = t.slice(i);
        null === n ? s = "." : c(n) || c(t.join("/")) ? (n && c(n) || (n = "/" + n), s = n) : s = n;
        var u = this._makeAbs(s);
        f(this, s) || (h[0] === o.GLOBSTAR ? this._processGlobStar(n, s, u, h, e, r) : this._processReaddir(n, s, u, h, e, r));
    }, m.prototype._processReaddir = function (t, e, r, n, i, o) {
        var a = this._readdir(r, o);
        if (a) {
            for (var c = n[0], h = !!this.minimatch.negate, u = c._glob, l = this.dot || "." === u.charAt(0), f = [], p = 0; p < a.length; p++) {
                if ("." !== (g = a[p]).charAt(0) || l) (h && !t ? !g.match(c) : g.match(c)) && f.push(g);
            }
            var d = f.length;
            if (0 !== d) if (1 !== n.length || this.mark || this.stat) {
                n.shift();
                for (p = 0; p < d; p++) {
                    var m;
                    g = f[p];
                    m = t ? [t, g] : [g], this._process(m.concat(n), i, o);
                }
            } else {
                this.matches[i] || (this.matches[i] = Object.create(null));
                for (var p = 0; p < d; p++) {
                    var g = f[p];
                    t && (g = "/" !== t.slice(-1) ? t + "/" + g : t + g), "/" !== g.charAt(0) || this.nomount || (g = s.join(this.root, g)), this._emitMatch(i, g);
                }
            }
        }
    }, m.prototype._emitMatch = function (t, e) {
        if (!p(this, e)) {
            var r = this._makeAbs(e);
            if (this.mark && (e = this._mark(e)), this.absolute && (e = r), !this.matches[t][e]) {
                if (this.nodir) {
                    var n = this.cache[r];
                    if ("DIR" === n || Array.isArray(n)) return;
                }
                this.matches[t][e] = true, this.stat && this._stat(e);
            }
        }
    }, m.prototype._readdirInGlobStar = function (t) {
        if (this.follow) return this._readdir(t, false);
        var e, r;
        try {
            r = n.lstatSync(t);
        } catch (t) {
            if ("ENOENT" === t.code) return null;
        }
        var i = r && r.isSymbolicLink();
        return this.symlinks[t] = i, i || !r || r.isDirectory() ? e = this._readdir(t, false) : this.cache[t] = "FILE", e;
    }, m.prototype._readdir = function (t, e) {
        if (e && !l(this.symlinks, t)) return this._readdirInGlobStar(t);
        if (l(this.cache, t)) {
            var r = this.cache[t];
            if (!r || "FILE" === r) return null;
            if (Array.isArray(r)) return r;
        }
        try {
            return this._readdirEntries(t, n.readdirSync(t));
        } catch (e) {
            return this._readdirError(t, e), null;
        }
    }, m.prototype._readdirEntries = function (t, e) {
        if (!this.mark && !this.stat) for (var r = 0; r < e.length; r++) {
            var n = e[r];
            n = "/" === t ? t + n : t + "/" + n, this.cache[n] = true;
        }
        return this.cache[t] = e, e;
    }, m.prototype._readdirError = function (t, e) {
        switch (e.code) {
            case "ENOTSUP":
            case "ENOTDIR":
                var r = this._makeAbs(t);
                if (this.cache[r] = "FILE", r === this.cwdAbs) {
                    var n = new Error(e.code + " invalid cwd " + this.cwd);
                    throw n.path = this.cwd, n.code = e.code, n;
                }
                break;
            case "ENOENT":
            case "ELOOP":
            case "ENAMETOOLONG":
            case "UNKNOWN":
                this.cache[this._makeAbs(t)] = false;
                break;
            default:
                if (this.cache[this._makeAbs(t)] = false, this.strict) throw e;
                this.silent || console.error("glob error", e);
        }
    }, m.prototype._processGlobStar = function (t, e, r, n, i, o) {
        var s = this._readdir(r, o);
        if (s) {
            var a = n.slice(1),
                c = t ? [t] : [],
                h = c.concat(a);
            this._process(h, i, false);
            var u = s.length;
            if (!this.symlinks[r] || !o) for (var l = 0; l < u; l++) {
                if ("." !== s[l].charAt(0) || this.dot) {
                    var f = c.concat(s[l], a);
                    this._process(f, i, true);
                    var p = c.concat(s[l], n);
                    this._process(p, i, true);
                }
            }
        }
    }, m.prototype._processSimple = function (t, e) {
        var r = this._stat(t);
        if (this.matches[e] || (this.matches[e] = Object.create(null)), r) {
            if (t && c(t) && !this.nomount) {
                var n = /[\/\\]$/.test(t);
                "/" === t.charAt(0) ? t = s.join(this.root, t) : (t = s.resolve(this.root, t), n && (t += "/"));
            }
            "win32" === process.platform && (t = t.replace(/\\/g, "/")), this._emitMatch(e, t);
        }
    }, m.prototype._stat = function (t) {
        var e = this._makeAbs(t),
            r = "/" === t.slice(-1);
        if (t.length > this.maxLength) return false;
        if (!this.stat && l(this.cache, e)) {
            var i = this.cache[e];
            if (Array.isArray(i) && (i = "DIR"), !r || "DIR" === i) return i;
            if (r && "FILE" === i) return false;
        }
        var o = this.statCache[e];
        if (!o) {
            var s;
            try {
                s = n.lstatSync(e);
            } catch (t) {
                if (t && ("ENOENT" === t.code || "ENOTDIR" === t.code)) return this.statCache[e] = false, false;
            }
            if (s && s.isSymbolicLink()) try {
                o = n.statSync(e);
            } catch (t) {
                o = s;
            } else o = s;
        }
        this.statCache[e] = o;
        i = true;
        return o && (i = o.isDirectory() ? "DIR" : "FILE"), this.cache[e] = this.cache[e] || i, (!r || "FILE" !== i) && i;
    }, m.prototype._mark = function (t) {
        return h.mark(this, t);
    }, m.prototype._makeAbs = function (t) {
        return h.makeAbs(this, t);
    };
}, function (t, e, r) {
    var n = r(10),
        i = Object.create(null),
        o = r(11);
    function s(t) {
        for (var e = t.length, r = [], n = 0; n < e; n++) r[n] = t[n];
        return r;
    }
    t.exports = n(function (t, e) {
        return i[t] ? (i[t].push(e), null) : (i[t] = [e], function (t) {
            return o(function e() {
                var r = i[t],
                    n = r.length,
                    o = s(arguments);
                try {
                    for (var a = 0; a < n; a++) r[a].apply(null, o);
                } finally {
                    r.length > n ? (r.splice(0, n), process.nextTick(function () {
                        e.apply(null, o);
                    })) : delete i[t];
                }
            });
        }(t));
    });
}, function (t, e, r) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
        value: true
    });
    const n = r(2),
        i = r(0);
    class o extends n.TreeItem {
        constructor(t, e, r, n) {
            super(t), this.name = t, this.location = e, this.collapsibleState = r, this.command = n, this.iconPath = {
                light: i.join(__filename, "..", "..", "resources", "light", "note.svg"),
                dark: i.join(__filename, "..", "..", "resources", "dark", "note.svg")
            }, this.contextValue = "note";
        }
        get tooltip() {
            return `${this.name}`;
        }
    }
    e.Note = o;
}]);
//# sourceMappingURL=extension.js.map