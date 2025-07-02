import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase config
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
const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showToast("कृपया लॉगिन करें");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
    return;
  }

  const uid = user.uid;

  document.getElementById("familyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const familyName = document.getElementById("familyName").value.trim();
    const janAadhar = document.getElementById("janAadhar").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const pariwarSankhya = document.getElementById("pariwarSankhya").value.trim();

    const onlyDigits10 = /^\d{10}$/;

    // ✅ Validations
    if (!familyName) {
      showToast("❌ कृपया परिवार का नाम दर्ज करें");
      return;
    }

    if (!pariwarSankhya || isNaN(pariwarSankhya) || Number(pariwarSankhya) <= 0) {
      showToast("❌ परिवार के सदस्यों की संख्या सही दर्ज करें");
      return;
    }

    if (!onlyDigits10.test(janAadhar)) {
      showToast("❌ जन आधार नंबर 10 अंकों का होना चाहिए");
      return;
    }

    if (!onlyDigits10.test(mobile)) {
      showToast("❌ मोबाइल नंबर 10 अंकों का होना चाहिए");
      return;
    }

    const data = {
      familyName,
      janAadhar,
      mobile,
      pariwarSankhya: Number(pariwarSankhya)
    };

    try {
      const familyRef = push(ref(db, `surveys/families/${uid}`));
      await set(familyRef, data);

      const familyKey = familyRef.key;
      showToast("✅ परिवार जोड़ा गया!");

      setTimeout(() => {
        window.location.href = `../addmember/add_member.html?family=${familyKey}`;
      }, 3000);
    } catch (error) {
      console.error("Firebase Error:", error);
      showToast("❌ डेटा सेव करने में त्रुटि हुई: " + error.message);
    }
  });
});

// ✅ Toast Notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// 🌐 Network status handlers
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000);
});

window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});
