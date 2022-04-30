


/* =================== Helpers ===================*/
const MAX_SAFE_INTEGER = 9007199254740991

/**
 * Checks if `value` is a valid array-like length.
 *
 * - Copied from from Lodash.js
 */
function isLength(value) {
    return typeof value === 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}


/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 * 
 * - Copied from from Lodash.js
 */
function isArrayLike(value) {
    return value != null && typeof value !== 'function' && isLength(value.length)
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * - Copied from from Lodash.js
 */
function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Promise`.
 *
 * - Copied from https://github.com/lodash/lodash/issues/1935
 */
function isPromise(value) {
    return value instanceof Promise ||
        (
            isObject(value) &&
            typeof value.then === 'function' &&
            typeof value.catch === 'function'
        );
}



/**
 * Make it possible to get sub-properties from Promise objects using Proxies.
 */
function async(p) {
    const validator = {
        get(target, key) {
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], validator)
            } else if (key === 'then') {
                return target.then.bind(target)
            } else if (key === 'catch') {
                return target.catch.bind(target)
            } else if (key === 'finally') {
                return target.finally.bind(target)
            } else if (target['then']) {
                return new Proxy(Promise.resolve(target).then(res => res ? res[key] : undefined).catch(err => new Error(JSON.stringify(err))), validator)
            } else {
                return target[key];
            }
        }
    }
    if (isPromise(p)) {
        return new Proxy(p.catch(err => {
            const errObj = new Error('Rejected');
            if (typeof err === 'object') Object.assign(errObj, err)
            else errObj.message=err
            return errObj;
        }), validator)
    }
    return p
}

/**
 * Wraps the return value of a function with async().
 */
async.wrap = (func) => {
    const validator = {
        apply: function (target, thisArg, argumentsList) {
            return async(target(...argumentsList))
        }
    }
    return new Proxy(func, validator)
}

/**
 * Same as Promise.allSettled but supports objects aswell.
 */
async.allSettled = (promises) => {
    if (isArrayLike(promises)) return Promise.allSettled(promises)
    const keys = Object.keys(promises)
    promises = keys.map(key => promises[key])
    return Promise.allSettled(promises).then(res => {
        return Object.fromEntries(res.map((c, i) => [keys[i], c]))
    })
}

/**
 * Same as Promise.all but supports objects aswell.
 */
async.all = (promises) => {
    if (isArrayLike(promises)) return Promise.all(promises)
    const keys = Object.keys(promises)
    promises = keys.map(key => promises[key])
    return Promise.all(promises).then(res => {
        return Object.fromEntries(res.map((c, i) => [keys[i], c]))
    })
}

/**
 * Same as Promise.race but supports objects aswell.
 */
async.race = (promises) => {
    if (isArrayLike(promises)) return Promise.race(promises)
    promises = Object.keys(promises).map(key => promises[key])
    return Promise.race(promises).then(res => {
        return res
    })
}

/**
 * Map async iterator.
 */
async.map = (arr, callback) => {
    const res = []
    return Promise.resolve(arr).then(r => Promise.all(r.map((c, i) => Promise.resolve(c).then(d => res[i] = callback(d, i, null)).catch(err => res[i] = callback(null, i, new Error(err))))).then(r => res))
}

module.exports = async