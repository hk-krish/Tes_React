// import AWS from 'aws-sdk'
// // import { REACT_APP_USER_POOL_ID, REACT_APP_REGION, REACT_APP_ACCESS_KEY_ID, REACT_APP_SECRET_ACCESS_KEY } from '../config/aws-config';

// export const GetGroupsOfUser = (username) => {
//     var params = {
//         Username: username,
//         UserPoolId: process.env.REACT_APP_USER_POOL_ID,
//     };

//     return new Promise((resolve, reject) => {
//         AWS.config.update({ region: process.env.REACT_APP_REGION, 'accessKeyId': process.env.REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': process.env.REACT_APP_SECRET_ACCESS_KEY });
//         var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
//         cognitoidentityserviceprovider.adminListGroupsForUser(params, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 reject(err)
//             }
//             else {
//                 console.log("data", data);
//                 resolve(data)
//             }
//         })
//     })
// }
