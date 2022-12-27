/**
 * vuex-along-function-adapter.ts (c) 2022
 * Author: WUYAX
 * Version: V0.1.0
 * Created: 2022-12-27 15:01
 * Modified:
 * Description: vuex-along adapter for pure function
 */

import {
  isPlainObject,
  isArray,
  isFunction,
  isString,
  startsWith,
} from 'lodash-es'

const PREFIX: string = '_afunc_'

interface cache {
  [x: string]: any
}

function isRefer(data: any): boolean {
  if (isPlainObject(data) || isArray(data) || isFunction(data)) {
    return true
  } else {
    return false
  }
}

function funcToStr(func: any): string {
  if (!isFunction(func)) return func
  return `${PREFIX}${func.toString()}`
}

function isFunctionStr(str: any): boolean {
  if (!isString(str)) return false
  return startsWith(str, PREFIX)
}

function strToFunc(str: string): Function {
  try {
    let substr = str.slice(PREFIX.length)
    return Function('"use strict";return (' + substr + ')')()
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('convert string to function SyntaxError')
    } else {
      console.error(error)
    }
    return () => {}
  }
}

export function replaceFuncToStr(data: any): any {
  if (isPlainObject(data)) {
    let cache: cache = {}
    let objKeys: string[] = Object.keys(data)
    objKeys.forEach((key) => {
      const dataItem: any = data[key]
      if (isRefer(dataItem)) {
        cache[key] = replaceFuncToStr(dataItem)
      } else {
        cache[key] = dataItem
      }
    })
    return cache
  } else if (isArray(data)) {
    return data.map((dataItem: any) => {
      if (isRefer(dataItem)) {
        return replaceFuncToStr(dataItem)
      } else {
        return dataItem
      }
    })
  } else if (isFunction(data)) {
    return funcToStr(data)
  } else {
    return data
  }
}

export function replaceStrToFunc(data: any): any {
  if (isPlainObject(data)) {
    let cache: cache = {}
    let objKeys: string[] = Object.keys(data)
    objKeys.forEach((key) => {
      const dataItem = data[key]
      if (isRefer(dataItem)) {
        cache[key] = replaceStrToFunc(dataItem)
      } else if (isFunctionStr(dataItem)) {
        cache[key] = strToFunc(dataItem)
      } else {
        cache[key] = dataItem
      }
    })
    return cache
  } else if (isArray(data)) {
    return data.map((dataItem: any) => {
      if (isRefer(dataItem)) {
        return replaceStrToFunc(dataItem)
      } else if (isFunctionStr(dataItem)) {
        return strToFunc(dataItem)
      } else {
        return dataItem
      }
    })
  } else if (isFunctionStr(data)) {
    return strToFunc(data)
  } else {
    return data
  }
}

class FunctionAdapter {
  public source: string
  constructor(source: string) {
    this.source = source
  }
  read() {
    let dataStr: string = localStorage.getItem(this.source) || '{}'
    return replaceStrToFunc(JSON.parse(dataStr)) || {}
  }
  write(data: object) {
    localStorage.setItem(this.source, JSON.stringify(replaceFuncToStr(data)))
  }
}

export default function functionAdapter() {
  return {
    local: FunctionAdapter,
    sync: true
  }
}
