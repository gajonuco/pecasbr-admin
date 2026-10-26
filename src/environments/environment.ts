// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "http://localhost:8080",
  imageURL: 'http://localhost:8080/images',

  // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase : {
    apiKey: "AIzaSyAjt1KtbR8Nm2wMLagbOU5X_2kMHlyxOVA",
    authDomain: "oficina-mecanica-pwa.firebaseapp.com",
    projectId: "oficina-mecanica-pwa",
    storageBucket: "oficina-mecanica-pwa.firebasestorage.app",
    messagingSenderId: "382668018602",
    appId: "1:382668018602:web:4caa3d2624eb5541ecd1d3",
    measurementId: "G-8HQ40153L7"
  },

  vapidKey: "BK_QLCs4jAYhJK6Z2x4pMn6ISgUEgxOVRhgJMTfNR91Kj_Xl3ohakiw0s6Sbxwot1lpaiz1oKBRsUcPZuNbXrWo"

};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
