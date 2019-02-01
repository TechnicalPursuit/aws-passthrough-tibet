'use strict';

module.exports.passthrough = async (event, context, callback) => {

    var AWS,
        commonHeaders,

        response,

        service,

        result;

    AWS = require('aws-sdk');

    //  Define common headers that we'll return no matter whether we're
    //  returning an error or success. These allow us to communicate with
    //  CORS-observant devices.
    commonHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    };

    //  ---

    //  There should be a 'service' field in the event. This should correspond
    //  to some AWS service, like 'S3' or 'Lambda'.

    //  If we didn't get a service field in the event, return an error here.
    if (!event.service) {
        response = {
            statusCode: 400,
            headers: commonHeaders,
            body: 'No service specified.'
        };

        return callback(null, response);
    }

    //  There should be a 'methodName' field in the event. This should
    //  correspond an invokable method on the AWS service that was specified
    //  above. For instance, for the S3 service, this might be a value like
    //  'listBuckets'.

    //  If we didn't get a methodName field in the event, return an error here.
    if (!event.methodName) {
        response = {
            statusCode: 400,
            headers: commonHeaders,
            body: 'No methodName specified.'
        };

        return callback(null, response);
    }

    //  ---

    //  Create a new AWS service using the supplied service name.
    service = new AWS[event.service]();

    //  If we couldn't create the service, return an error here.
    if (!service) {
        response = {
            statusCode: 400,
            headers: commonHeaders,
            body: 'Service named: ' + event.service + ' could not be constructed.'
        };

        return callback(null, response);
    }

    //  ---

    //  If the method name doesn't exist as a property on the service, return an
    //  error here.
    if (!service[event.methodName]) {
        response = {
            statusCode: 400,
            headers: commonHeaders,
            body: 'Method named: ' + event.methodName + ' could not be constructed.'
        };

        return callback(null, response);
    }

    //  ---

    //  Go ahead and invoke the service. Note here how we invoke the service and
    //  force it to return a Promise, using the '.promise()' message that
    //  virtually all AWS services provide in the JavaScript AWS SDK to get a
    //  Promise back from a particular call. We then 'await' the resolution of
    //  that Promise and grab the result.
    result = await (service[event.methodName])(event.params).promise();

    //  Stringify the result in preparation for returning it.
    result = JSON.stringify(result);

    //  ---

    //  Return the result

    response = {
        statusCode: 200,
        headers: commonHeaders,
        body: result
    };

    return callback(null, response);
};
