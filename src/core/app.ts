    import { Context } from "./context";
    import { Router } from "./router";

    export class Haxxor {
        router: Router

        constructor() {
            this.router = new Router()
        }

        // Support for plugins
        use(plugin: Haxxor) {
            this.router.routes.push(...plugin.router.routes)
            return this
        }

        // HTTP method(GET) shortcuts
        get(path: string, handler: Function) {
            this.router.add('GET', path,handler)
            return this
        }

        // HTTP method(POST) shortcuts
        post(path: string, handler: Function) {
            this.router.add('POST', path, handler)
            return this
        }

        // HTTP method(PUT) shortcuts
        put(path: string, handler: Function) {
            this.router.add('PUT', path, handler)
            return this
        }

        // HTTP method(DELETE) shortcuts
        delete(path: string, handler: Function) {
            this.router.add('DELETE', path, handler)
            return this
        }

        // Start the server
        listen(port: number) {
            Bun.serve({
                port,
                fetch: async (req) => {
                    const url = new URL(req.url)
                    const route = this.router.find(req.method, url.pathname)

                    if (!route) {
                    return new Response('Not Found', { status: 404 })
                    }

                    const query: Record<string, string> = {}
                    url.searchParams.forEach((value, key) => {
                        query[key] = value
                    })
                    
                    const ctx = new Context(req, route?.params, query)
                    
                    try {
                        return await route.handler(ctx)
                    } catch (error) {
                        return ctx.status(500).text('Internal Server Error')
                    }
                }
            })

            console.log(`Server is running on port ${port}`)
        }
    }