// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  databaseURL: "https://gvmm-57297-default-rtdb.firebaseio.com",
  projectId: "gvmm-57297",
  storageBucket: "gvmm-57297.appspot.com",
  messagingSenderId: "128465029455",
  appId: "1:128465029455:web:5fe5bf87f0364edb631d3a",
  measurementId: "G-DV26XSZ9WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Signup Handling
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = `${firstName} ${lastName}`;
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data in database
      await set(ref(db, "users/" + user.uid), {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email
      });


      alert("✅ Signup successful!");
      window.location.href = "../dashboard/dashboard.html";
    } catch (error) {
      alert("❌ Signup failed: " + error.message);
    }
  });
}
// ✅ Toggle password visibility on signup screen
const toggleSignupPassword = document.getElementById("toggleSignupPassword");
const signupPasswordInput = document.getElementById("signupPassword");

if (toggleSignupPassword && signupPasswordInput) {
  toggleSignupPassword.addEventListener("click", () => {
    const isHidden = signupPasswordInput.type === "password";
    signupPasswordInput.type = isHidden ? "text" : "password";

    toggleSignupPassword.src = isHidden
      ? "../Images/eye-close.png"
      : "../Images/eye-open.png";

    toggleSignupPassword.alt = isHidden ? "Hide Password" : "Show Password";
  });
}
// 🔴 नेट चला गया
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000);
});

// 🟢 नेट वापस आया
window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});
