// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrV_RYGOZqu_PBVDcbBJjmXxmUX4NEc5w",
  authDomain: "gvmm-57297.firebaseapp.com",
  databaseURL: "https://gvmm-57297-default-rtdb.firebaseio.com",
  projectId: "gvmm-57297",
  storageBucket: "gvmm-57297.appspot.com",
  messagingSenderId: "128465029455",
  appId: "1:128465029455:web:5fe5bf87f0364edb631d3a",
  measurementId: "G-DV26XSZ9WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Show user info on dashboard
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html"; // not logged in, redirect
    return;
  }

  try {
    const uid = user.uid;
    const snapshot = await get(ref(db, "users/" + uid));
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById("displayUsername").textContent = data.username;
      document.getElementById("displayEmail").textContent = data.email;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
});

// ✅ Logout button handling
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("🚪 Logged out successfully.");
      window.location.href = "../index.html";
    } catch (error) {
      alert("❌ Logout failed: " + error.message);
    }
  });
}
