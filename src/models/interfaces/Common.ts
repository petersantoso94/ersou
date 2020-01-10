export interface IRule {
    [key: string]: (arg0: string) => boolean | string
}