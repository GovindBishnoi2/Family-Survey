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
  showToast("✅ Login सफल!");
  setTimeout(() => {
    window.location.href = "dashboard/dashboard.html";
  }, 2000);
} catch (error) {
    console.error("🔥 Firebase Login Error:", error.code, error.message); // Debug full error
    alert(error.code + " – " + error.message); // Show exact reason for failure

    if (error.code === "auth/user-not-found") {
        showToast("❌ यह ईमेल रजिस्टर नहीं है");
    } else if (error.code === "auth/wrong-password") {
        showToast("❌ पासवर्ड गलत है");
    } else if (error.code === "auth/invalid-email") {
        showToast("❌ ईमेल फ़ॉर्मेट सही नहीं है");
    } else {
        showToast("⚠️ " + error.message);
    }
}

}


    }
  });
}
const forgotLink = document.getElementById("forgotPasswordLink");

if (forgotLink) {
  forgotLink.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {
      showToast("❗ कृपया पहले Email डालें");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showToast("📩 लिंक आपके ईमेल पर भेजा गया है। अगर कुछ मिनट में न दिखे तो spam/promotions भी चेक करें।");

      })
      .catch((error) => {
        showToast("❌ Error: " + error.message);
      });
  });
}


// ✅ Toggle password visibility on login screen
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPasswordInput = document.getElementById("loginPassword");

if (toggleLoginPassword && loginPasswordInput) {
  toggleLoginPassword.addEventListener("click", () => {
    const isPassword = loginPasswordInput.type === "password";
    loginPasswordInput.type = isPassword ? "text" : "password";

    // 👁️ Update icon path
    toggleLoginPassword.src = isPassword
      ? "Images/eye-close.png"
      : "Images/eye-open.png";
    
  });
}
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}
// 🔴 नेट चला गया
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 50000);
});

// 🟢 नेट वापस आया
window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});
