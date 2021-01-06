import {init, registerRouter} from "./entry";
import {InitParams} from "../index";
import {Context} from "koa";

/**
 * @description 中间件，程序入口
 * @param params 中间件初始化参数
 */
export function koaDecorator(params: InitParams) {
    init(params);
    return async (ctx: Context, next: Function) => {
        await next();
    }
}
