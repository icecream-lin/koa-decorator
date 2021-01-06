import {ControllerStoreParam, ParameterParam, RouterStoreParam} from "../index";

/**
 * @description 存储路由匹配路径的store
 */
export const RouterStore = new Map<string, RouterStoreParam>();

/**
 * @description 存储controller的store
 */
export const ControllerStore = new Map<string, ControllerStoreParam>();

/**
 * @description 存储参数信息的store
 */
export const ParameterStore = new Map<string, Array<ParameterParam>>();
