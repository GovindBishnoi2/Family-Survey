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
  alert("❌ परिवार ID नहीं मिला");
  throw new Error("Missing family key");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("कृपया लॉगिन करें");
    window.location.href = "../index.html";
    return;
  }

  const uid = user.uid;
  const form = document.getElementById("memberForm");
  const submitBtn = form.querySelector("button[type='submit']");
  const title = document.getElementById("formTitle");

  if (memberKey) {
    submitBtn.textContent = "सदस्य अपडेट करें";
    if (title) title.textContent = "सदस्य अपडेट करें";

    const memberRef = ref(db, `surveys/members/${uid}/${familyKey}/${memberKey}`);
    get(memberRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        form.name.value = data.name || "";
        form.aadhaar.value = data.aadhaar || "";
        form.dob.value = data.dob || "";
        form.gender.value = data.gender || "";
        form.marital.value = data.marital || "";
        form.education.value = data.education || "";
        form.occupation.value = data.occupation || "";
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      aadhaar: form.aadhaar.value.trim(),
      dob: form.dob.value,
      gender: form.gender.value,
      marital: form.marital.value.trim(),
      education: form.education.value.trim(),
      occupation: form.occupation.value.trim(),
      timestamp: new Date().toISOString()
    };

    const memberRef = memberKey
      ? ref(db, `surveys/members/${uid}/${familyKey}/${memberKey}`)
      : push(ref(db, `surveys/members/${uid}/${familyKey}`));

    set(memberRef, data)
      .then(() => {
        alert("✅ सदस्य सेव किया गया");
        window.location.href = `../showmember/show_member.html?family=${familyKey}`;
      })
      .catch((err) => alert("❌ Error: " + err.message));
  });
});
