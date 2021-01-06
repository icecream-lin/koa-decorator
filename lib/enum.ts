/**
 * @description 请求方法枚举
 */
export enum RequestMethod {
    GET = "get",
    HEAD = "head",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete",
    OPTIONS = "options",
    TRACE = "trace"
}

/**
 * @description 校验类型枚举
 */
export enum ValidType {
    NOTNULL,
    REQUIRED
}

/**
 * @description 参数类型枚举
 */
export enum VariableType {
    PATH,
    QUERY,
    BODY
}
