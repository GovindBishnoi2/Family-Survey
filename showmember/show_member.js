import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
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

const params = new URLSearchParams(window.location.search);
const familyKey = params.get("family");

if (!familyKey) {
  showToast("❌ परिवार ID नहीं मिला");
  throw new Error("Missing family key");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showToast("कृपया लॉगिन करें");
    setTimeout(() => window.location.href = "../index.html", 3000);
    return;
  }

  const uid = user.uid;
  const memberList = document.getElementById("memberList");
  const memberRef = ref(db, `surveys/members/${uid}/${familyKey}`);

  memberList.innerHTML = `<div class="loader"></div><p class="loading-text">🔄 डेटा लोड हो रहा है...</p>`;

  onValue(memberRef, (snapshot) => {
    memberList.innerHTML = "";
    if (!snapshot.exists()) {
      memberList.innerHTML = "<p>कोई सदस्य नहीं मिला।</p>";
      return;
    }

    snapshot.forEach((childSnap) => {
      const data = childSnap.val();
      const key = childSnap.key;
      const card = renderMemberCard(data, key, uid);
      memberList.appendChild(card);
    });

    initSearch(); // 🔍 Enable search after rendering
  }, () => {
    memberList.innerHTML = "<p>❌ डेटा लोड करने में त्रुटि हुई</p>";
  });
});

function renderMemberCard(data, key, uid) {
  const card = document.createElement("div");
  card.className = "member-card";
  card.setAttribute("data-search", `${data.name || ""} ${data.aadhaar || ""}`.toLowerCase());

  card.innerHTML = `
    <p><strong>नाम:</strong> ${safe(data.name)}</p>
    <p><strong>पिता का नाम:</strong> ${safe(data.fatherName)}</p>
    <button class="toggleBtn">🔽 Show More</button>
    <div class="more-details" style="display:none;">
      ${renderDetails(data)}
      <div class="action-buttons" style="margin-top:10px;">
        <button onclick="editMember('${key}')">✏️ Edit</button>
        <button onclick="deleteMember('${uid}','${key}')">🗑️ Delete</button>
        <button onclick="shareMember('${key}')">📤 Share</button>
      </div>
    </div>
  `;

  const toggleBtn = card.querySelector(".toggleBtn");
  const details = card.querySelector(".more-details");
  toggleBtn.addEventListener("click", () => {
    const show = details.style.display === "block";
    details.style.display = show ? "none" : "block";
    toggleBtn.textContent = show ? "🔽 Show More" : "🔼 Hide";
  });

  return card;
}

function renderDetails(data) {
  const fields = [
    ["आधार", data.aadhaar],
    ["जन्म तिथि", data.dob],
    ["लिंग", data.gender],
    ["वैवाहिक स्थिति", data.marital],
    ["शिक्षा", data.education],
    ["पेशा", data.occupation]
  ];
  return fields.map(([label, val]) => `<p><strong>${label}:</strong> ${safe(val)}</p>`).join("");
}

window.editMember = (key) => {
  window.location.href = `../addmember/add_member.html?family=${familyKey}&member=${key}`;
};

window.deleteMember = (uid, key) => {
  if (confirm("क्या आप वाकई इस सदस्य को हटाना चाहते हैं?")) {
    remove(ref(getDatabase(), `surveys/members/${uid}/${familyKey}/${key}`))
      .then(() => showToast("🗑️ सदस्य हटा दिया गया"))
      .catch(() => showToast("❌ हटाने में विफल"));
  }
};

window.shareMember = (key) => {
  const url = `${location.origin}/addmember/add_member.html?family=${familyKey}&member=${key}`;
  navigator.clipboard.writeText(url)
    .then(() => showToast("📎 लिंक कॉपी हो गया!"))
    .catch(() => showToast("❌ लिंक कॉपी नहीं हो सका"));
};

function safe(text) {
  return typeof text === "string" ? escapeHTML(text) : "—";
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    "'": '&#039;', '"': '&quot;'
  }[c]));
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// 🌐 Network status
window.addEventListener("offline", () => showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000));
window.addEventListener("online", () => showToast("✅ आप वापस ऑनलाइन हैं", 3000));

// 🔍 Search Functionality
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".member-card").forEach(card => {
      const text = card.getAttribute("data-search") || "";
      card.style.display = text.includes(val) ? "block" : "none";
    });
  });
}
