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

const params = new URLSearchParams(window.location.search);
const familyKey = params.get("family");

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
  const memberList = document.getElementById("memberList");
  const memberRef = ref(db, `surveys/members/${uid}/${familyKey}`);

  onValue(memberRef, (snapshot) => {
    memberList.innerHTML = "";

    if (!snapshot.exists()) {
      memberList.innerHTML = "<p>कोई सदस्य नहीं मिला।</p>";
      return;
    }

    snapshot.forEach((childSnap) => {
      const data = childSnap.val();
      const key = childSnap.key;

      const div = document.createElement("div");
      div.className = "member-card";
      div.innerHTML = `
        <p><strong>नाम:</strong> ${data.name}</p>
        <p><strong>आधार:</strong> ${data.aadhaar}</p>
        <p><strong>जन्म तिथि:</strong> ${data.dob}</p>
        <p><strong>लिंग:</strong> ${data.gender}</p>
        <p><strong>वैवाहिक स्थिति:</strong> ${data.marital}</p>
        <p><strong>शिक्षा:</strong> ${data.education}</p>
        <p><strong>पेशा:</strong> ${data.occupation}</p>
        <button onclick="window.location.href='../addmember/add_member.html?family=${familyKey}&member=${key}'">✏️ Edit</button>
      `;
      memberList.appendChild(div);
    });
  });
});
