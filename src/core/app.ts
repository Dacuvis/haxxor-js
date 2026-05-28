import { Context } from "./context";
import { Router } from "./router";

export class Haxxor {
  router: Router;

  private errorHandler: ((err: Error, ctx: any) => any) | null = null;

  constructor() {
    this.router = new Router();
  }

  // Support for plugins
  use(plugin: Haxxor) {
    this.router.routes.push(...plugin.router.routes);
    return this;
  }

  // HTTP method(GET) shortcuts
  get(path: string, handler: Function) {
    this.router.add("GET", path, handler);
    return this;
  }

  // HTTP method(POST) shortcuts
  post(path: string, handler: Function) {
    this.router.add("POST", path, handler);
    return this;
  }

  // HTTP method(PUT) shortcuts
  put(path: string, handler: Function) {
    this.router.add("PUT", path, handler);
    return this;
  }

  // HTTP method(DELETE) shortcuts
  delete(path: string, handler: Function) {
    this.router.add("DELETE", path, handler);
    return this;
  }

  group(prefix: string, callback: (app: Haxxor) => void) {
    const subApp = new Haxxor()

    callback(subApp)

    for(const route of subApp.router.routes) {
      let combinePath = `${prefix}${route.path}`.replace(/\/+/g, "/");
      if (combinePath.length > 1 && combinePath.endsWith("/")) {
        combinePath = combinePath.slice(0, -1)
      }

      this.router.add(route.method, combinePath, route.handler)
    }

    return this
  }

  onError(handler: (err: Error, ctx: any) => any){
    this.errorHandler = handler
    return this
  }

  // Start the server
  listen(port: number) {
    Bun.serve({
      port,
      fetch: async (req) => {
        const url = new URL(req.url);
        const route = this.router.find(req.method, url.pathname);

        if (!route) {
          return new Response("Not Found", { status: 404 });
        }

        const query: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          query[key] = value;
        });

        let bodyData: any = null;
        if (["POST", "PUT"].includes(req.method)) {
          const contentType = req.headers.get("content-type") || "";
          try {
            if (contentType.includes("application/json")) {
              bodyData = await req.json();
            } else if (
              contentType.includes("application/x-www-form-urlencoded")
            ) {
              const formData = await req.formData();
              bodyData = {};

              formData.forEach((value, key) => {
                bodyData[key] = value;
              })
            }
          } catch (error) {
            return new Response("Bad Request", { status: 400 });
          }
        }
        const ctx: any = new Context(req, route?.params, query);

        (ctx as any).request = {
          body: bodyData,
        };

        try {
          const result = await route.handler(ctx);

          if (result instanceof Response) {
            return result;
          }
          if (typeof result === "string") {
            return ctx.text(result);
          }
          if (typeof result === "object") {
            return ctx.json(result);
          }
        } catch (error) {
          if (this.errorHandler) {
            try {
              const errResult = await this.errorHandler(error as Error, ctx)

              if (errResult instanceof Response) return errResult
              if (typeof errResult === "string") return ctx.text(errResult)
              if (typeof errResult === "object") return ctx.json(errResult)
            } catch (nestedError) {
                return new Response("Internal Server Error", { status: 500 });
            }
          }

          return ctx.status(500).text("Internal Server Error")
        }
      },
    });

    console.log(`Server is running on port ${port}`);
  }
}
