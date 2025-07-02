// ✅ Modular, Resilient & Maintainable `add_member.js`
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const memberKey = params.get("member");

if (!familyKey) {
  showToast("❌ परिवार ID नहीं मिला");
  throw new Error("Missing family key");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showToast("कृपया लॉगिन करें");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
    return;
  }

  const uid = user.uid;
  const form = document.getElementById("memberForm");

  if (memberKey) {
    const memberRef = ref(db, `surveys/members/${uid}/${familyKey}/${memberKey}`);
    get(memberRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        form.member_name.value = data.name || "";
        form.father_name.value = data.fatherName || "";
        form.aadhaar.value = data.aadhaar || "";
        form.dob.value = data.dob || "";

        const genderInput = form.querySelector(`input[name="gender"][value="${data.gender}"]`);
        if (genderInput) genderInput.checked = true;

        const maritalInput = form.querySelector(`input[name="marital"][value="${data.marital}"]`);
        if (maritalInput) maritalInput.checked = true;
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const aadhaar = form.aadhaar.value.trim();
    if (!/^[0-9]{12}$/.test(aadhaar)) {
      showToast("❌ कृपया 12 अंकों का सही आधार नंबर दर्ज करें।");
      return;
    }

    const genderValue = form.querySelector('input[name="gender"]:checked')?.value || "";
    const maritalValue = form.querySelector('input[name="marital"]:checked')?.value || "";

    if (!genderValue || !maritalValue) {
      showToast("❌ कृपया लिंग और वैवाहिक स्थिति चुनें।");
      return;
    }

    const name = form.member_name.value.trim();
    const dob = form.dob.value;

    if (!name || !dob) {
      showToast("❌ कृपया नाम और जन्म तिथि भरें।");
      return;
    }

    const data = {
      name,
      fatherName: form.father_name.value.trim(),
      aadhaar,
      dob,
      gender: genderValue,
      marital: maritalValue,
      timestamp: new Date().toISOString()
    };

    const membersRef = ref(db, `surveys/members/${uid}/${familyKey}`);

    const memberRef = memberKey
      ? ref(db, `surveys/members/${uid}/${familyKey}/${memberKey}`)
      : push(membersRef); // 🔄 भविष्य में आधार-आधारित uniqueness के लिए set(child(..., aadhaar)) पर विचार करें

    set(memberRef, data)
      .then(() => {
        showToast("✅ सदस्य सेव किया गया");
        setTimeout(() => {
          window.location.href = `../showmember/show_member.html?family=${familyKey}`;
        }, 3000);
      })
      .catch((err) => showToast("❌ Error: " + err.message));
  });
});

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ✅ नेटवर्क स्टेटस चेक
window.addEventListener("offline", () => {
  showToast("❌ इंटरनेट कनेक्शन नहीं है", 5000);
});

window.addEventListener("online", () => {
  showToast("✅ आप वापस ऑनलाइन हैं", 3000);
});

// ✅ Navigation highlight
const path = window.location.pathname;
if (path.includes("dashboard")) {
  document.getElementById("nav-home")?.classList.add("active");
} else if (path.includes("addFamily")) {
  document.getElementById("nav-add")?.classList.add("active");
} else if (path.includes("showSurvey")) {
  document.getElementById("nav-show")?.classList.add("active");
}
