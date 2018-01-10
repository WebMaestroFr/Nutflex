export function paramsString(args) {
    return Object
        .keys(args)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`)
        .join('&');
}

// localStorage.clear();

export class APIRequest {
    constructor(resolve, reject, url, init) {
        this.resolve = resolve;
        this.reject = reject;
        this.url = url;
        this.init = init;
        this.isCanceled = false;
    }
    fetch() {
        return fetch(this.url, this.init).then(
            response => response.status === 200
                ? response.json().then(this.resolve, this.reject)
                : this.reject(`[${response.status}] ${this.url}`),
            this.reject
        )
    }
    cancel() {
        this.isCanceled = true;
        this.reject(`[CANCEL] ${this.url}`);
    }
}

export default class API {
    constructor(base, params = {}, interval = 0) {
        this.base = base;
        this.params = params;
        this.interval = interval;
        this.queue = [];
        this.isProcessing = false;
    }

    _process() {
        this.queue = this
            .queue
            .filter(r => !r.isCanceled);
        const request = this
            .queue
            .shift();
        if (request === undefined) {
            this.isProcessing = false;
        } else {
            this.isProcessing = true;
            request
                .fetch()
                .then(() => setTimeout(() => this._process(), this.interval));
        }
    }

    _queue(request) {
        this
            .queue
            .push(request);
        if (!this.isProcessing) {
            this._process();
        }
    }

    fetch(path, filters = {}, expiration = 0, init = {}) {
        let request = null;
        const timestamp = Date.now(),
            params = paramsString({
                ...this.params,
                ...filters
            }),
            url = `${this.base}/${path}?${params}`,
            item = localStorage.getItem(url),
            cache = item
                ? JSON.parse(item)
                : null;
        const promise = (cache && timestamp - cache.timestamp < expiration * 1000)
            ? Promise
                .resolve(cache.data)
                .then(data => {
                    // console.log(`[CACHE] ${url}`);
                    return data;
                })
            : new Promise((resolve, reject) => {
                request = new APIRequest(data => {
                    if (expiration) {
                        const content = JSON.stringify({data, timestamp})
                        localStorage.setItem(url, content);
                    }
                    // console.log(`[FETCH] ${url}`);
                    return resolve(data);
                }, reject, url, init);
                this._queue(request);
            });
        return {
            cancel: () => request
                ? request.cancel()
                : null,
            // done: (callback) => promise.then(callback, console.warn)
            done: (callback) => promise.then(callback, () => null)
        };
    }

    get(path, filters = {}, expiration = 0, init = {}) {
        return this.fetch(path, filters, expiration, {
            ...init,
            method: 'GET'
        });
    }

    post(path, filters = {}, expiration = 0, init = {}) {
        return this.fetch(path, filters, expiration, {
            ...init,
            method: 'POST'
        });
    }
}