import type { Route } from './types'

export class Router {
    routes: Route[] = []

    // Add a new route with method, path, and handler
    add(method: string, path: string, handler: Function) {
        const keys: string[] = []

        const regexString = path.replace(/:([^\/]+)/g, (_, keyName) => {
            keys.push(keyName)
            return '([^/]+)' // Capture group
        })

        const regex = new RegExp(`^${regexString}$`)
        this.routes.push({ method, path, handler, regex, keys })
    }

    // Find a matching route for the given method and path
    find(method: string, path: string) {
        for (const route of this.routes) {
            if (route.method !== method) continue
            
            const match = path.match(route.regex)
            if (match) {
                const params: Record<string, string> = {}
                route.keys.forEach((key, index) => {
                    params[key] = match[index + 1] ?? ''
                })

                return {...route, params}
            }
        }

        return null
    }
}