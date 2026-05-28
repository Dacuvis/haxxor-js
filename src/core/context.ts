export class Context {
    req: Request
    params: Record<string, string> = {}
    query: Record<string, string> = {}


    // Default Status Code
    statusCode = 200

    // Initialize with request and route params
    constructor(req: Request, params: Record<string, string> = {}, query: Record<string, string> = {}) {
        this.req = req
        this.params = params
        this.query = query
    }

    // Helper methods for response
    status = (code: number) => {
        this.statusCode = code
        return this
    }

    // Send text response
    text = (data: any) => {
        return new Response(data, {
            status: this.statusCode
        })
    }
    
    // Send JSON response
    json = (data: any) => {
        return Response.json(data, {
            status: this.statusCode
        })
    }


}