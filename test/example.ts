import { Haxxor } from "../src/core/app"
import { exampleRoutes } from "./example.routes"

const app = new Haxxor()
    .group("/api", (app) => {
        app.use(exampleRoutes)
    })
    .listen(3000)