import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  projectId: "gvmm-57297",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get oobCode from URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');

if (!oobCode) {
  showToast("❌ गलत या पुराना लिंक है।", 5000);
  throw new Error("Missing oobCode in URL.");
}

// Strong Password Validator
function isStrongPassword(pwd) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
}

// Submit Handler
document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('newPassword').value;

  if (!isStrongPassword(newPassword)) {
    showToast("⚠️ मज़बूत पासवर्ड दर्ज करें (8+ कैरेक्टर, 1 कैपिटल, 1 नंबर, 1 चिन्ह)", 4000);
    return;
  }

  confirmPasswordReset(auth, oobCode, newPassword)
    .then(() => {
      showToast("✅ पासवर्ड बदल दिया गया!");
      setTimeout(() => window.location.href = "../index.html", 1500);
    })
    .catch((error) => {
      showToast("❌ " + getFriendlyError(error.code), 4000);
    });
});

// Friendly Error Translator
function getFriendlyError(code) {
  switch (code) {
    case 'auth/expired-action-code':
      return "🔒 यह लिंक अब मान्य नहीं है।";
    case 'auth/invalid-action-code':
      return "⚠️ यह रीसेट लिंक गलत या पहले ही उपयोग हो चुका है।";
    case 'auth/user-disabled':
      return "🚫 यह यूज़र निष्क्रिय कर दिया गया है।";
    default:
      return "❌ कुछ गलत हुआ। कृपया पुनः प्रयास करें।";
  }
}

// Toast Function
function showToast(message, duration = 4000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// Network Status
window.addEventListener("offline", () => showToast("📴 इंटरनेट कनेक्शन नहीं है", 5000));
window.addEventListener("online", () => showToast("📶 आप ऑनलाइन हैं", 3000));
