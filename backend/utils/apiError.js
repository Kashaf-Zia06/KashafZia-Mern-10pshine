class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[]


    ){
        super()
        this.statusCode=statusCode
        this.message=message
        this.errors=errors
        this.success=false
    }
}

export {ApiError}