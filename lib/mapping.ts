import {ControllerStore, RouterStore} from "./store";
import {RequestMethod} from "./enum";
import {ControllerFunction} from "../index";

/**
 * @description 控制器标志
 * @param param 路径 | constructor
 * @constructor
 */
export function Controller(param: Function | string): void | ControllerFunction {
    if (typeof param === "string") {
        return (constructor: Function) => {
            ControllerStore.set(constructor.name, {
                controller: constructor.name,
                cPath: param
            });
        }
    }
    ControllerStore.set(param.name, {
        controller: param.name,
        cPath: ""
    });
}

/**
 * @description get请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function GetMapping(path: string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.GET);
        return descriptor;
    }
}

/**
 * @description post请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function PostMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.POST);
        return descriptor;
    }
}

/**
 * @description put请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function PutMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.PUT);
        return descriptor;
    }
}

/**
 * @description delete请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function DeleteMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.DELETE);
        return descriptor;
    }
}

/**
 * @description options请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function OptionsMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.OPTIONS);
        return descriptor;
    }
}

/**
 * @description head请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function HeadMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.HEAD);
        return descriptor;
    }
}

/**
 * @description patch请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function PatchMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.PATCH);
        return descriptor;
    }
}

/**
 * @description trace请求装饰器函数
 * @param path 请求路径
 * @constructor
 */
export function TraceMapping(path :string) {
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        addToRouterStore(target, key, path, RequestMethod.TRACE);
        return descriptor;
    }
}

/**
 * @description 将请求装饰器收集的信息写入RouterStore
 * @param target 控制器类
 * @param key 方法名
 * @param path 路径
 * @param type 请求类型
 */
function addToRouterStore(target: Function, key: string, path: string, type: RequestMethod) {
    const controllerName = target.constructor.name;
    const pathKey = controllerName + "&" + key
    RouterStore.set(pathKey, {
        controller: controllerName,
        method: type,
        key: key,
        path: path,
        handler: target[key],
        parameters: []
    });
}

