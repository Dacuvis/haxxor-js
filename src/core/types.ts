export interface Route{
    method: string,
    path: string,
    handler: Function,
    regex: RegExp,
    keys: string[]
}

export interface MatchedRoute extends Route {
    params: Record<string, string>
}