import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔧 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  projectId: "gvmm-57297",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Get reset code from URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');

if (!oobCode) {
  alert("❌ Invalid reset link.");
  throw new Error("Missing oobCode in URL.");
}

// ✅ On submit, confirm password reset
document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('newPassword').value;

  confirmPasswordReset(auth, oobCode, newPassword)
    .then(() => {
      alert("✅ पासवर्ड बदल दिया गया!");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
    });
});
