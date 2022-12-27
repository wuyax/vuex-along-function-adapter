/**
 * vuex-along-function-adapter.ts (c) 2022
 * Author: WUYAX
 * Version: V0.1.0
 * Created: 2022-12-27 15:01
 * Modified:
 * Description: vuex-along adapter for pure function
 */
import { isPlainObject, isArray, isFunction, isString, startsWith, } from 'lodash-es';
var PREFIX = '_afunc_';
function isRefer(data) {
    if (isPlainObject(data) || isArray(data) || isFunction(data)) {
        return true;
    }
    else {
        return false;
    }
}
function funcToStr(func) {
    if (!isFunction(func))
        return func;
    return "" + PREFIX + func.toString();
}
function isFunctionStr(str) {
    if (!isString(str))
        return false;
    return startsWith(str, PREFIX);
}
function strToFunc(str) {
    try {
        var substr = str.slice(PREFIX.length);
        return Function('"use strict";return (' + substr + ')')();
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            console.warn('converter string to function SyntaxError');
        }
        else {
            console.error(error);
        }
        return function () { };
    }
}
export function replaceFuncToStr(data) {
    if (isPlainObject(data)) {
        var cache_1 = {};
        var objKeys = Object.keys(data);
        objKeys.forEach(function (key) {
            var dataItem = data[key];
            if (isRefer(dataItem)) {
                cache_1[key] = replaceFuncToStr(dataItem);
            }
            else {
                cache_1[key] = dataItem;
            }
        });
        return cache_1;
    }
    else if (isArray(data)) {
        return data.map(function (dataItem) {
            if (isRefer(dataItem)) {
                return replaceFuncToStr(dataItem);
            }
            else {
                return dataItem;
            }
        });
    }
    else if (isFunction(data)) {
        return funcToStr(data);
    }
    else {
        return data;
    }
}
export function replaceStrToFunc(data) {
    if (isPlainObject(data)) {
        var cache_2 = {};
        var objKeys = Object.keys(data);
        objKeys.forEach(function (key) {
            var dataItem = data[key];
            if (isRefer(dataItem)) {
                cache_2[key] = replaceStrToFunc(dataItem);
            }
            else if (isFunctionStr(dataItem)) {
                cache_2[key] = strToFunc(dataItem);
            }
            else {
                cache_2[key] = dataItem;
            }
        });
        return cache_2;
    }
    else if (isArray(data)) {
        return data.map(function (dataItem) {
            if (isRefer(dataItem)) {
                return replaceStrToFunc(dataItem);
            }
            else if (isFunctionStr(dataItem)) {
                return strToFunc(dataItem);
            }
            else {
                return dataItem;
            }
        });
    }
    else if (isFunctionStr(data)) {
        return strToFunc(data);
    }
    else {
        return data;
    }
}
var FunctionAdapter = /** @class */ (function () {
    function FunctionAdapter(source) {
        this.source = source;
    }
    FunctionAdapter.prototype.read = function () {
        var dataStr = localStorage.getItem(this.source) || '{}';
        return replaceStrToFunc(JSON.parse(dataStr)) || {};
    };
    FunctionAdapter.prototype.write = function (data) {
        localStorage.setItem(this.source, JSON.stringify(replaceFuncToStr(data)));
    };
    return FunctionAdapter;
}());
export default function functionAdapter() {
    return {
        local: FunctionAdapter,
        sync: true
    };
}
