/*
 @Purpose: All errors response data
*/

const errors = {};

errors['NOT_FOUND'] = {
    header_status: 404,
    result_code: 10,
    title: 'Not Found',
    message: 'The page/data you requested was not found'
};

errors['AUTH_FAILURE'] = {
    header_status: 401,
    result_code: 11,
    title: 'Authentication failure',
    message: "E-email/Password didn't match"
};

errors['ACCESS_DENIED'] = {
    header_status: 403,
    result_code: 12,
    title: 'Access Denied',
    message: "Authentication required"
};

errors['FORBIDDEN'] = {
    header_status: 403,
    result_code: 13,
    title: 'Access Forbidden',
    message: "Accessing the page or resource you were trying to reach is forbidden"
};

errors['DB_ERROR'] = {
    header_status: 500,
    result_code: 14,
    title: 'Database Error',
    message: 'Database Error occurred!'
};
errors['DATA_NOT_FOUND'] = {
    header_status: 404,
    result_code: 15,
    title: 'Data Not Found',
    message: 'You requested for data was not found'
};

errors['INTERNAL_SERVER_ERROR'] = {
    header_status: 500,
    result_code: 16,
    title: 'Internal Server Error',
    message: 'Internal Server Error'
};
errors['DUPLICATE_ENTRY'] = {
    header_status: 400,
    result_code: 17,
    title: 'Duplicate Data',
    message: 'Duplicate entry not allow'
};

errors['EMAIL_VERIFYING_FAILURE'] = {
    header_status: 422,
    result_code: 18,
    title: 'Email Verifing Failue',
    message: 'Email veritying failure'
};
errors['OPP_FAILURE'] = {
    header_status: 400,
    result_code: 19,
    title: 'Operation Failure',
    message: 'Operation failure'
};
errors['AlREADY_VERIFIED'] = {
    header_status: 400,
    result_code: 20,
    title: 'Already Verified',
    message: 'Already verified'
};

errors['SOMETHING_WENT_WRONG'] = {
    header_status: 500,
    result_code: 21,
    title: 'Something Went Wrong',
    message: 'Something went wrong in the app server. try again later'
};
errors['USER_NOT_FOUND'] = {
    header_status: 404,
    result_code: 22,
    title: 'User Not Found',
    message: 'You requested for user was not found'
};
errors['INVALID_OTP'] = {
    header_status: 404,
    result_code: 22,
    title: 'Invalid OTP',
    message: 'You provided OTP is invalid'
};
errors['MOBILE_REQUIRED'] = {
    header_status: 400,
    result_code: 22,
    title: 'Mobile Number is required',
    message: 'Please provide mobile number'
};
errors['UPLOAD_FAILURE'] = {
    header_status: 400,
    result_code: 22,
    title: 'Upload Failure',
    message: 'Please submit image in body properly'
};
errors['INVALID_PASS'] = {
    header_status: 400,
    result_code: 23,
    title: 'Invalid Password',
    message: 'Your provided password is invalid'
};
errors['TOO_LARGE_REQUEST_ENTITY'] = {
    header_status: 400,
    result_code: 24,
    title: 'Request Entity Too Large',
    message: 'Less than 10MB is allowed for requesting entity.'
};
errors['VALID_BANK_REQUIRED'] = {
    header_status: 400,
    result_code: 25,
    title: 'Valid bank id is requried',
    message: 'Please provide a valid bank ID.'
};
errors['CONFIRM_PASSWORD_NOT_MATCH'] = {
    header_status: 400,
    result_code: 26,
    title: 'Confirm password not match',
    message: 'Your provided password is not match'
};
errors['INVALID_CLIENT_TYPE'] = {
    header_status: 400,
    result_code: 27,
    title: 'Invalid Client Type',
    message: 'Please provide valid client_type in query params'
};
errors['INVALID_CLIENT_VERSION'] = {
    header_status: 400,
    result_code: 28,
    title: 'Invalid Client Version',
    message: 'Please provide valid client_version in query params'
};
errors['UNSUPPORTED_VERSION'] = {
    header_status: 400,
    result_code: 29,
    title: 'Version not supported',
    message: 'Your provided version is not supported'
};

errors['ACCESS_UNAUTHORISED'] = {
    header_status: 403,
    result_code: 30,
    title: 'Access Unauthorised',
    message: "You don't have permission"
};
errors['FEATURE_NOT_AVAILABLE'] = {
    header_status: 403,
    result_code: 31,
    title: 'Feature not availabe',
    message: "Feature not availabe"
};

errors['TIMEOUT'] = {
    header_status: 403,
    result_code: 32,
    title: 'Deadline Expired',
    message: "Deadline expired to do it."
};

errors['WRONG_INPUT_FORMAT'] = {
    header_status: 403,
    result_code: 33,
    title: 'Wrong Input Data Format',
    message: "Please provide valid format of input data."
};


errors['API_AUTH_FAILURE'] = {
    header_status: 403,
    result_code: 35,
    title: 'Access Forbidden',
    message: "Accessing the page or resource you were trying to reach is forbidden"
};
errors['INVALID_REQUEST_DATA'] = {
    header_status: 400,
    result_code: 36,
    title: 'Invalid Request Data',
    message: "You provided data is invalid"
};
errors['INVALID_JSON_BODY'] = {
    header_status: 403,
    result_code: 37,
    title: 'Invalid JSON format',
    message: "Invalid format of json body"
};


module.exports = errors;