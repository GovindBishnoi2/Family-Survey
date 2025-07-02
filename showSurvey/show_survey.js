import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, onValue, remove, get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth, onAuthStateChanged
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
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ Global
let allFamilies = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showToast("कृपया लॉगिन करें");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
    return;
  }

  const uid = user.uid;
  const list = document.getElementById("familyList");
  const searchInput = document.getElementById("searchInput");
  const familyRef = ref(db, `surveys/families/${uid}`);

  onValue(familyRef, async (snapshot) => {
    list.innerHTML = "";
    allFamilies = [];

    if (!snapshot.exists()) {
      list.innerHTML = `<div class="no-data">🗒️ कोई परिवार नहीं मिला</div>`;
      return;
    }

    snapshot.forEach((childSnap) => {
      allFamilies.push({ ...childSnap.val(), key: childSnap.key });
    });

    render(allFamilies);
  });

  // ✅ Single Event Listener outside onValue
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = allFamilies.filter(f =>
      (f.familyName && f.familyName.toLowerCase().includes(value)) ||
      (f.janAadhar && f.janAadhar.toLowerCase().includes(value))
    );
    render(filtered);
  });

  function render(filteredList) {
    list.innerHTML = "";

    filteredList.forEach(async (family) => {
      const memberSnap = await get(ref(db, `surveys/members/${uid}/${family.key}`));
      const memberCount = memberSnap.exists() ? Object.keys(memberSnap.val()).length : 0;

      const div = document.createElement("div");
      div.className = "member-card";

      div.appendChild(makePara("नाम", family.familyName));
      div.appendChild(makePara("परिवार संख्या", family.pariwarSankhya));
      div.appendChild(makePara("सदस्य", memberCount));

      const toggleDetailsBtn = makeButton("🔽 Show More", () => {
        const visible = moreDetails.style.display === "block";
        moreDetails.style.display = visible ? "none" : "block";
        toggleDetailsBtn.textContent = visible ? "🔽 Show More" : "🔼 Hide";
      });
      toggleDetailsBtn.className = "toggleDetailsBtn";
      div.appendChild(toggleDetailsBtn);

      const moreDetails = document.createElement("div");
      moreDetails.className = "more-details";
      moreDetails.style.display = "none";

      moreDetails.appendChild(makePara("जन आधार", family.janAadhar));
      moreDetails.appendChild(makePara("स्थान", family.location));
      moreDetails.appendChild(makePara("धर्म", family.dharm));

      const actionRow = document.createElement("div");
      actionRow.className = "action-row";

      actionRow.appendChild(makeButton("👁 सदस्य देखें", () => {
        window.location.href = `../showmember/show_member.html?family=${family.key}`;
      }));

      actionRow.appendChild(makeButton("➕ सदस्य जोड़ें", () => {
        window.location.href = `../addmember/add_member.html?family=${family.key}`;
      }));

      const toggleActionBtn = makeButton("⚙️ Options");
      actionRow.appendChild(toggleActionBtn);

      const actionButtons = document.createElement("div");
      actionButtons.className = "action-buttons";
      actionButtons.style.display = "none";

      actionButtons.appendChild(makeButton("✏️ Edit", () => {
        window.location.href = `../addFamily/family_form_page.html?family=${family.key}`;
      }));

      actionButtons.appendChild(makeButton("🗑️ Delete", async () => {
        // 🔒 Optionally replace with custom modal later
        const confirmed = confirm("क्या आप वाकई इस परिवार को हटाना चाहते हैं?");
        if (!confirmed) return;

        try {
          await remove(ref(db, `surveys/families/${uid}/${family.key}`));
          await remove(ref(db, `surveys/members/${uid}/${family.key}`));
          showToast("✅ परिवार हटाया गया");
        } catch (err) {
          console.error("❌ हटाने में त्रुटि:", err);
          showToast("❌ हटाने में त्रुटि हुई");
        }
      }));

      toggleActionBtn.addEventListener("click", () => {
        const visible = actionButtons.style.display === "flex";
        actionButtons.style.display = visible ? "none" : "flex";
      });

      moreDetails.appendChild(actionRow);
      moreDetails.appendChild(actionButtons);
      div.appendChild(moreDetails);

      list.appendChild(div);
    });
  }
});

// ✅ Util: paragraph
function makePara(label, value) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${label}:</strong> ${value || "-"}`;
  return p;
}

// ✅ Util: button
function makeButton(text, handler) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    handler?.();
  });
  return btn;
}

// ✅ Toast
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ✅ Network Status
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000);
});
window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});
