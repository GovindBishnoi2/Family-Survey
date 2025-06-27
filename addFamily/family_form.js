import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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

  document.getElementById("familyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      familyName: document.getElementById("familyName").value.trim(),
      janAadhar: document.getElementById("janAadhar").value.trim(),
      dharm: document.getElementById("dharm").value.trim(),
      pariwarSankhya: document.getElementById("pariwarSankhya").value.trim(),
      location: document.getElementById("location").value.trim()
    };

    const familyRef = push(ref(db, `surveys/families/${uid}`));
    await set(familyRef, data);

    const familyKey = familyRef.key;
    alert("✅ परिवार जोड़ा गया!");
    window.location.href = `../addmember/add_member.html?family=${familyKey}`;
  });
});
