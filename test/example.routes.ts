import { Haxxor } from "../src/core/app";

export const exampleRoutes = new Haxxor()
    .get("/hello", () => {
        return {
            message: "Hello, World!"
        }
    })
