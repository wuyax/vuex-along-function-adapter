/**
 * vuex-along-function-adapter.ts (c) 2022
 * Author: WUYAX
 * Version: V0.1.0
 * Created: 2022-12-27 15:01
 * Modified:
 * Description: vuex-along adapter for pure function
 */
export declare function replaceFuncToStr(data: any): any;
export declare function replaceStrToFunc(data: any): any;
declare class FunctionAdapter {
    source: string;
    constructor(source: string);
    read(): any;
    write(data: object): void;
}
export default function functionAdapter(): {
    local: typeof FunctionAdapter;
    sync: boolean;
};
export {};
