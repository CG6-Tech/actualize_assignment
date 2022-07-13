import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    "apiKey": "AIzaSyBrR1fXIz1L2DMnmkChLk8Z8JsB_oiU-4g",
    "authDomain": "cg6-portfolio.firebaseapp.com",
    "projectId": "cg6-portfolio",
    "storageBucket": "cg6-portfolio.appspot.com",
    "messagingSenderId": "919563862671",
    "appId": "1:919563862671:web:53ba98bfd21bbc6b2fe6fa",
    "measurementId": "G-TTPPK63VR6"
}

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;