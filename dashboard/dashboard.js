// 🚀 Firebase SDKs Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  databaseURL: "https://gvmm-57297-default-rtdb.firebaseio.com",
  projectId: "gvmm-57297",
  storageBucket: "gvmm-57297.appspot.com",
  messagingSenderId: "128465029455",
  appId: "1:128465029455:web:5fe5bf87f0364edb631d3a"
};

// 🔧 Firebase Initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 🌐 DOM Elements
const loader = document.getElementById("loader");
const loadingText = document.getElementById("loadingText");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const clearBtn = document.getElementById("clearBtn");
const logoutBtn = document.getElementById("logoutBtn");

// 🔃 Loader On at Start
showLoader(loader, loadingText);

// 🏠 All Families Store
let allFamilies = [];

// 🔐 Authentication Listener
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const uid = user.uid;

  // 👤 Load User Profile
  get(ref(db, "users/" + uid)).then((snap) => {
    if (snap.exists()) {
      const data = snap.val();
      document.getElementById("displayUsername").textContent = data.username || "User";
      document.getElementById("displayEmail").textContent = data.email || "--";
    }
  });

  // 📊 Load Stats (Families + Members)
  const familiesRef = ref(db, `surveys/families/${uid}`);
  const membersRef = ref(db, `surveys/members/${uid}`);

  onValue(familiesRef, (snap) => {
    allFamilies = [];
    let count = 0;

    snap.forEach((child) => {
      allFamilies.push({ ...child.val(), key: child.key });
      count++;
    });

    document.getElementById("totalFamilies").textContent = count;
    hideLoader(loader, loadingText);
  });

  onValue(membersRef, (snap) => {
    let total = 0, male = 0, female = 0;

    snap.forEach(famSnap => {
      const members = famSnap.val();
      for (const memberId in members) {
        total++;
        const gender = (members[memberId].gender || "").toLowerCase();
        if (gender.includes("पुरुष")) male++;
        else if (gender.includes("महिला")) female++;
      }
    });

    document.getElementById("totalMembers").textContent = total;
    document.getElementById("totalMales").textContent = male;
    document.getElementById("totalFemales").textContent = female;
  });

  // 🔍 Search Input Handler
  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) return renderSearch([], searchResults);
    const filtered = allFamilies.filter(f =>
      (f.familyName && f.familyName.toLowerCase().includes(q)) ||
      (f.janAadhar && f.janAadhar.toLowerCase().includes(q))
    );
    renderSearch(filtered, searchResults);
  });

  // ❌ Clear Button
  clearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    renderSearch([], searchResults);
  });

  // 🚪 Logout Button
  logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
    showToast("🚪 लॉग आउट किया गया");
    window.location.href = "../index.html";
  });
});

// 🔁 Render Search Results
function renderSearch(families, outputDiv) {
  outputDiv.innerHTML = "";
  if (!families.length) {
    outputDiv.innerHTML = "<p>❌ कोई परिणाम नहीं मिला</p>";
    return;
  }

  families.forEach(f => {
    const div = document.createElement("div");
    div.className = "stat-box";
    div.innerHTML = `
      <strong>${f.familyName}</strong><br>
      परिवार संख्या: ${f.pariwarSankhya || "-"}<br>
      जन आधार: ${f.janAadhar || "-"}
    `;
    div.style.cursor = "pointer";
    div.addEventListener("click", () => {
      window.location.href = `../showmember/show_member.html?family=${f.key}`;
    });
    outputDiv.appendChild(div);
  });
}

// 🎯 Loader Control
function hideLoader(loader, text) {
  if (loader) loader.style.display = "none";
  if (text) text.style.display = "none";
}
function showLoader(loader, text) {
  if (loader) loader.style.display = "block";
  if (text) text.style.display = "block";
}

// 🔔 Toast Alert System
function showToast(message, duration = 3000) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// 🌐 Network Alerts
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000);
});
window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});
