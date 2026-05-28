import { Haxxor } from "../src/core/app"
import { exampleRoutes } from "./example.routes"

const app = new Haxxor()
    .use(exampleRoutes)
    .listen(3000)