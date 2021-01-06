import {ControllerStore, ParameterStore, RouterStore} from "./store";
import * as Router from "koa-router";
import {Context} from "koa";
import {InitParams, ValidKey} from "../index";
import {VariableType, ValidType} from "./enum";
import {loadControllers} from "./utils";


/**
 * 初始化工程
 * @param params 初始化参数
 */
export function init(params: InitParams) {
    params.controllerPackages.forEach(p => loadControllers(p));
    pretreatmentStore();
    registerRouter(params.router);
}

/**
 * @description 对装饰器收集到的信息进行预处理校验
 */
export function pretreatmentStore() {
    // 路径预校验
    RouterStore.forEach(val => {
        const {controller} = val;
        const c = ControllerStore.get(controller);
        if (typeof c === "undefined") {
            throw new Error(`cannot find controller ${controller}`)
        }
    })

    // 参数预校验
    ParameterStore.forEach(parameters => {
        parameters.forEach(parameter => {
            if (parameter.patterns.length > 0 && parameter.type !== VariableType.PATH) {
                throw new Error(`decorator can only be used on path variable`);
            }
            if (parameter.validKeys.length > 0 && parameter.type === VariableType.PATH) {
                throw new Error(`decorator cannot be used on path variable`);
            }
        })
    })
    // 参数排序
    ParameterStore.forEach(parameters => parameters.sort((s1, s2) => s1.index < s2.index ? -1 : 1));
    // 将参数追加到RouterStore上
    ParameterStore.forEach((parameters, key) => RouterStore.get(key).parameters = parameters);
}

/**
 * @description 注册koa-router
 * @param router koa-router对象
 */
export function registerRouter(router: Router) {
    RouterStore.forEach(val => {
        const {controller, key, path, method} = val;
        const {cPath} = ControllerStore.get(controller);
        const mapKey = controller + "&" + key;
        router[method](cPath + path, async (ctx: Context) => {
            const params = pretreatment(ctx, mapKey);
            if (typeof params !== "boolean") {
                await val.handler(ctx, ...params);
            } else {
                await sendError(ctx)
            }
        });
    })
}

/**
 * @description 对每条请求进行预处理，注入参数，增加校验
 * @param ctx koa上下文
 * @param mapKey RouterStore的key值
 * @return {Array | boolean} 校验未通过返回false，通过返回参数数组
 */
export function pretreatment(ctx: Context, mapKey: string): Array<any> | boolean {
    const params: Array<any> = [];
    const {parameters} = RouterStore.get(mapKey);
    for (let i = 0; i < parameters.length; i++) {
        const {type, name, patterns, validKeys} = parameters[i];
        // @ts-ignore
        let param = type === VariableType.PATH ? ctx.params[name] : type === VariableType.QUERY ? ctx.request.query : ctx.request.body;
        if (!validParams(patterns, validKeys, param)) {
            return false;
        }
        params.push(param);
    }
    return params;
}

/**
 * @description 参数校验
 * @param patterns 正则校验
 * @param validKeys 特殊校验
 * @param param 参数值
 */
export function validParams(patterns: Array<RegExp>, validKeys: Array<ValidKey>, param: any): boolean {
    for (let m = 0; m < patterns.length; m++) {
        if (!patterns[m].test(param)) {
            return false;
        }
    }
    for (let n = 0; n < validKeys.length; n++) {
        const {type, key} = validKeys[n];
        if (type === ValidType.REQUIRED && typeof param[key] === "undefined") {
            return false;
        }

        if (type === ValidType.NOTNULL && param[key] === null) {
            return false;
        }
    }
    return true;
}

/**
 * @description 返回错误请求
 * @param ctx koa上下文
 */
export async function sendError(ctx: Context) {
    ctx.response.status = 400;
    ctx.response.body = {
        code: "400",
        msg: "param valid failed"
    }
}
