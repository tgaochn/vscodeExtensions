"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(limitedFunc, initialDelay, repeatInterval) {
        this.limitedFunc = limitedFunc;
        this.pendingCallCount = 0;
        this.initialDelay = initialDelay;
        this.isInitialDelayOver = false;
        this.repeatInterval = repeatInterval;
        this.initialTimeout = null;
        this.repeatTimeout = null;
    }
    fire(repeated = false) {
        if (!repeated) {
            this.pendingCallCount++;
        }
        if (!this.isInitialDelayOver) {
            if (this.initialDelay > 0) {
                if (this.initialTimeout !== null) {
                    return;
                }
                this.startInitialTimeout();
                return;
            }
            this.isInitialDelayOver = true;
        }
        if (this.repeatTimeout !== null) {
            return;
        }
        this.pendingCallCount = 0;
        this.limitedFunc();
        this.repeatTimeout = setTimeout(() => {
            this.repeatTimeout = null;
            if (this.pendingCallCount === 0) {
                this.reset();
                return;
            }
            this.fire(true);
        }, this.repeatInterval);
    }
    startInitialTimeout() {
        this.initialTimeout = setTimeout(() => {
            this.isInitialDelayOver = true;
            this.fire(true);
        }, this.initialDelay);
    }
    reset() {
        this.initialTimeout = null;
        this.isInitialDelayOver = false;
        this.repeatTimeout = null;
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=rate_limiter.js.map