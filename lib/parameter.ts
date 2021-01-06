import {ParameterStore} from "./store";
import {VariableType, ValidType} from "./enum";
import {getKey} from "./utils";

/**
 * @description 路径参数装饰器
 * @param name 参数名
 * @constructor
 */
export function PathVariable(name: string) {
    return (target: Function, key: string, parameterIndex: number) => {
        addToParameterStore(getKey(target, key), VariableType.PATH, name, parameterIndex)
    }
}

/**
 * @description query参数装饰器
 * @param target 控制器类
 * @param key 方法名
 * @param parameterIndex 参数索引
 * @constructor
 */
export function QueryParams(target: Function, key: string, parameterIndex: number) {
    addToParameterStore(getKey(target, key), VariableType.QUERY, null, parameterIndex)
}

/**
 * @description body参数装饰器
 * @param target 控制器类
 * @param key 方法名
 * @param parameterIndex 参数索引
 * @constructor
 */
export function RequestBody(target: Function, key: string, parameterIndex: number) {
    addToParameterStore(getKey(target, key), VariableType.BODY, null, parameterIndex)
}

/**
 * @description 参数正则校验装饰器
 * @param reg 正则表达式
 * @constructor
 */
export function Validator(reg: RegExp | Array<RegExp>) {
    return (target: any, key: string, parameterIndex: number) => {
        addPatternToParameterStore(getKey(target, key), parameterIndex, reg);
    }
}

/**
 * @description 参数特殊校验装饰器
 * @param keys 要检验的参数字段
 * @constructor
 */
export function NotNull(keys: string | Array<string>) {
    return (target: Function, key: string, parameterIndex: number) => {
        addValidToParameterStore(getKey(target, key), parameterIndex, keys, ValidType.NOTNULL);
    }
}

/**
 * @description 参数特殊校验装饰器
 * @param keys 要检验的参数字段
 * @constructor
 */
export function Required(keys: string | Array<string>) {
    return (target: Function, key: string, parameterIndex: number) => {
        addValidToParameterStore(getKey(target, key), parameterIndex, keys, ValidType.REQUIRED);
    }
}

/**
 * 将参数信息写入ParameterStore
 * @param mapKey store key值
 * @param type 参数类型
 * @param name 参数名
 * @param index 参数索引
 */
function addToParameterStore(mapKey: string, type: VariableType, name: string, index: number) {
    if (ParameterStore.has(mapKey)) {
        const parameterIndex = ParameterStore.get(mapKey).findIndex(v => v.index === index);
        if (parameterIndex > -1) {
            ParameterStore.get(mapKey)[parameterIndex].type = type;
            ParameterStore.get(mapKey)[parameterIndex].name = name;
        } else {
            ParameterStore.get(mapKey).push({type, name, index, validKeys: [], patterns: []});
        }
    } else {
        ParameterStore.set(mapKey, [{type, name, index, validKeys: [], patterns: []}]);
    }
}

/**
 * 将参数信息写入ParameterStore
 * @param mapKey store key值
 * @param index 参数索引
 * @param pattern 正则表达式
 */
export function addPatternToParameterStore(mapKey: string, index: number, pattern: RegExp | Array<RegExp>) {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    if (ParameterStore.has(mapKey)) {
        const patternIndex = ParameterStore.get(mapKey).findIndex(v => v.index === index);
        if (patternIndex > -1) {
            ParameterStore.get(mapKey)[patternIndex].patterns =
                ParameterStore.get(mapKey)[patternIndex].patterns.concat(patterns);
        } else {
            ParameterStore.get(mapKey).push({index, name: null, type: null, validKeys: [], patterns})
        }
    } else {
        ParameterStore.set(mapKey, [{index, name: null, type: null, validKeys: [], patterns}])
    }
}

/**
 * 将参数信息写入ParameterStore
 * @param mapKey store key值
 * @param index 参数索引
 * @param validKey 参数校验的字段
 * @param type 特殊校验类型
 */
export function addValidToParameterStore(mapKey: string, index: number, validKey: string | Array<string>, type: ValidType) {
    validKey = Array.isArray(validKey) ? validKey : [validKey];
    const validKeys: Array<{ type: ValidType; key: string; }> = []
    validKey.forEach(value => validKeys.push({type, key: value}))

    if (ParameterStore.has(mapKey)) {
        const validIndex = ParameterStore.get(mapKey).findIndex(v => v.index === index);
        if (validIndex > -1) {
            ParameterStore.get(mapKey)[validIndex].validKeys =
                ParameterStore.get(mapKey)[validIndex].validKeys.concat(validKeys);
        } else {
            ParameterStore.get(mapKey).push({index, name: null, type: null, validKeys, patterns: []})
        }
    } else {
        ParameterStore.set(mapKey, [{index, name: null, type: null, validKeys, patterns: []}])
    }
}
