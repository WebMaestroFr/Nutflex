const _fetch = ({resolve, reject, timestamp, url}) => fetch(url).then(
    res => res.status === 200
        ? res.json().then(data => resolve({data, timestamp}), reject)
        : reject(`[${res.status}] ${url}`)
);

export default class API {
    constructor(base, params = {}, interval = 0) {

        this.getUrl = (path, filters) => {
            const args = {
                    ...params,
                    ...filters
                },
                paramsString = Object
                    .keys(args)
                    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`)
                    .join('&');
            return `${base}/${path}?${paramsString}`;
        };

        let _ready = true,
            _queue = [];
        const _process = () => {
            const item = _queue.shift();
            if (item === undefined) {
                _ready = true;
            } else {
                _ready = false;
                console.info(`[FETCH] ${item.url}`);
                _fetch(item).catch(reason => {
                    if (item.retries) {
                        console.error(`[RETRY]`, reason);
                        item.retries -= 1;
                        _queue.unshift(item);
                    } else {
                        item.reject(reason);
                    }
                });
                setTimeout(_process, interval);
            }
        };

        this.queue = (url, timestamp, clear, retries, resolve, reject) => {
            if (clear) {
                _queue.map(item => item.reject(`[CLEAR] ${item.url}`));
                _queue = [];
            }
            _queue.push({resolve, reject, timestamp, url, retries});
            if (_ready) {
                _process();
            }
        };

    }

    getCache(url) {
        // localStorage.removeItem(url);
        const content = localStorage.getItem(url);
        return content
            ? JSON.parse(content)
            : {
                data: null,
                timestamp: 0
            };
    }

    setCache(url, content) {
        localStorage.setItem(url, JSON.stringify(content));
    }

    fetch(path, filters = {}, expiration = 60 * 60, clear = false, retries = 1) {
        let cancel = false;
        const url = this.getUrl(path, filters),
            cache = this.getCache(url),
            timestamp = Date.now(),
            promise = new Promise(
                (resolve, reject) => cache.data && timestamp - cache.timestamp < expiration * 1000
                    ? resolve(cache)
                    : this.queue(url, timestamp, clear, retries, resolve, reject)
            ),
            resolution = promise
                .then(content => {
                    this.setCache(url, content);
                    return content.data;
                })
                .catch(reason => {
                    console.warn(reason);
                    return cache.data;
                });
        return {
            cancel: () => cancel = true,
            done: callback => resolution.then(
                content => cancel || !content
                    ? null
                    : callback(content)
            )
        };
    }
}