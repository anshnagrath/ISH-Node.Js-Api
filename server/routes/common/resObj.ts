export const resObj = function(statusCode, message, data) {
    var responseObject = {
        status: {
            code: statusCode,
            message: message
        },
        data: data
    }
    return responseObject;
}

