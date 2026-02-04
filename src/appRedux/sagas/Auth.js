// import { all, call, fork, put, takeEvery } from "redux-saga/effects";
// import { SIGNIN_USER, SIGNOUT_USER } from "constants/ActionTypes";
// import {
//   showAuthMessage,
//   userSignInSuccess,
//   userSignOutSuccess,
// } from "../../appRedux/actions/Auth";
// import jwt from "jsonwebtoken";
// // import { auth } from "../../firebase/firebase";

// const signInUserWithEmailPasswordRequest = async (email, password) =>
//   await auth
//     .signInWithEmailAndPassword(email, password)
//     .then((authUser) => authUser)
//     .catch((error) => error);

// export const GetCurrentLoggedUserDetails = () => {
//   const userAccessToken = localStorage.getItem("user_token");
//   if (userAccessToken) {
//     let data = jwt.decode(userAccessToken.replace("Bearer ", ""));
//     return data;
//   }
//   return null;
// };

// function* signInUserWithEmailPassword({ payload }) {
//   const { email, password } = payload;
//   try {
//     const signInUser = yield call(
//       signInUserWithEmailPasswordRequest,
//       email,
//       password
//     );
//     if (signInUser.message) {
//       yield put(showAuthMessage(signInUser.message));
//     } else {
//       localStorage.setItem("user_id", signInUser.user.uid);
//       yield put(userSignInSuccess(signInUser.user.uid));
//     }
//   } catch (error) {
//     yield put(showAuthMessage(error));
//   }
// }

// const signOutRequest = async () =>
//   await auth
//     .signOut()
//     .then((authUser) => authUser)
//     .catch((error) => error);

// function* signOut() {
//   try {
//     const signOutUser = yield call(signOutRequest);
//     if (signOutUser === undefined) {
//       localStorage.removeItem("user_token");
//       yield put(userSignOutSuccess(signOutUser));
//     } else {
//       yield put(showAuthMessage(signOutUser.message));
//     }
//   } catch (error) {
//     yield put(showAuthMessage(error));
//   }
// }

// export function* signInUser() {
//   yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
// }

// export function* signOutUser() {
//   yield takeEvery(SIGNOUT_USER, signOut);
// }

// export default function* rootSaga() {
//   yield all([fork(signInUser), fork(signOutUser)]);
// }
