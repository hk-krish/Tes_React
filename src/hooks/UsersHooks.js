// import { useLazyQuery, useMutation } from "@apollo/client";
// import { getAllUsers, getUserById } from "../graphql/Queries/UsersQueries";

// export function GetAllUsersList() {
//     const [allUsers] = useLazyQuery(getAllUsers, {
//         context: {
//             headers: {
//                 "Authorization": 'Bearer ' + localStorage.getItem('auth_token')
//             }
//         }
//     });
//     return { allUsers };
// }

// export function GetUserById() {
//     const [UserById] = useLazyQuery(getUserById);
//     return { UserById };
// }
