import * as Router from "koa-router";
import {Context} from "koa";
import {ValidType} from "./lib/enum";

export type ControllerFunction = (constructor: Function) => void;
export type RequestFunction = (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export type ParameterFunction = (target: Object, key: string, parameterIndex: number) => void;
export type koaDecoratorFunction = (ctx: Context, next: Function) => void;

export declare function Controller(constructor: Function): void;

export declare function Controller(path: string): ControllerFunction;

export declare function GetMapping(path: string): RequestFunction;

export declare function PostMapping(path: string): RequestFunction;

export declare function PutMapping(path: string): RequestFunction;

export declare function DeleteMapping(path: string): RequestFunction;

export declare function PatchMapping(path: string): RequestFunction;

export declare function HeadMapping(path: string): RequestFunction;

export declare function TraceMapping(path: string): RequestFunction;

export declare function OptionsMapping(path: string): RequestFunction;

export declare function PathVariable(name: string): ParameterFunction;

export declare function QueryParams(target: any, key: string, parameterIndex: number): void;

export declare function RequestBody(target: any, key: string, parameterIndex: number): void;

export declare function koaDecorator(params: InitParams): koaDecoratorFunction;

export declare function Validator(reg: RegExp): ParameterFunction;

export declare function Validator(reg: Array<RegExp>): ParameterFunction;

export declare function Required(keys: Array<string>): ParameterFunction;

export declare function Required(key: string): ParameterFunction;

export declare function NotNull(keys: Array<string>): ParameterFunction;

export declare function NotNull(key: string): ParameterFunction;

export declare interface ControllerStoreParam {
    controller: string;
    cPath: string;
}

export declare type ValidKey = {
    type: ValidType;
    key: string;
}

export declare interface RouterStoreParam {
    controller: string;
    method: string;
    key: string;
    path: string;
    handler: Function;
    parameters: Array<ParameterParam>
}

export declare interface ParameterParam {
    type: number;
    name: string;
    index: number;
    validKeys: Array<ValidKey>;
    patterns: Array<RegExp>;
}

export declare interface InitParams {
    router: Router;
    controllerPackages: Array<string>;
}
