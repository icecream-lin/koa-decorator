import * as fs from "fs";

/**
 * @description 加载项目所有控制器
 * @param path 控制器所在路径
 */
export function loadControllers(path: string) {
    const readDir = fs.readdirSync(path);
    readDir.forEach(file => {
        let stats = fs.lstatSync(path + "\\" + file);
        if (stats.isDirectory()) {
            loadControllers(path + "\\" + file);
        } else {
            require(path + "\\" + file);
        }
    });
}

/**
 * @description 获取store key值
 * @param target 控制器类
 * @param key 方法名
 */
export function getKey(target: Function, key: string): string {
    return target.constructor.name + "&" + key;
}
