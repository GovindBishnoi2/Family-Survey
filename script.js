import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  databaseURL: "https://gvmm-57297-default-rtdb.firebaseio.com",
  projectId: "gvmm-57297",
  storageBucket: "gvmm-57297.appspot.com",
  messagingSenderId: "128465029455",
  appId: "1:128465029455:web:5fe5bf87f0364edb631d3a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login सफल!");
      window.location.href = "dashboard/dashboard.html"; // या आपके dashboard की path
    } catch (error) {
      alert("❌ Login असफल: " + error.message);
    }
  });
}
const forgotLink = document.getElementById("forgotPasswordLink");

if (forgotLink) {
  forgotLink.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {
      alert("❗ कृपया पहले Email डालें");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("📩 लिंक आपके ईमेल पर भेजा गया है। अगर कुछ मिनट में न दिखे तो spam/promotions भी चेक करें।");

      })
      .catch((error) => {
        alert("❌ Error: " + error.message);
      });
  });
}
