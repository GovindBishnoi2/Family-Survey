import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("कृपया लॉगिन करें");
    window.location.href = "../index.html";
    return;
  }

  const uid = user.uid;
  const list = document.getElementById("familyList");
  const familyRef = ref(db, `surveys/families/${uid}`);

  onValue(familyRef, (snapshot) => {
    list.innerHTML = "";

    if (!snapshot.exists()) {
      list.innerHTML = "<p>कोई डेटा नहीं मिला।</p>";
      return;
    }

    snapshot.forEach((childSnap) => {
      const family = childSnap.val();
      const familyKey = childSnap.key;

      const div = document.createElement("div");
      div.className = "family-card";
      div.innerHTML = `
        <p><strong>नाम:</strong> ${family.familyName}</p>
        <p><strong>जन आधार:</strong> ${family.janAadhar}</p>
        <p><strong>परिवार संख्या:</strong> ${family.pariwarSankhya}</p>
        <p><strong>स्थान:</strong> ${family.location}</p>
        <p><strong>धर्म:</strong> ${family.dharm}</p>
        <button onclick="location.href='../addmember/add_member.html?family=${familyKey}'">➕ सदस्य जोड़ें</button>
        <button onclick="location.href='../showmember/show_member.html?family=${familyKey}'">👁 सदस्य देखें</button>
      `;
      list.appendChild(div);
    });
  });
});
