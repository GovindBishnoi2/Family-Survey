const CACHE_NAME = "family-survey-v1";

const urlsToCache = [
  "/",                          // Root
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",

  // 🔧 Global JS & CSS
  "/firebase.js",
  "/script.js",
  "/style.css",

  // 👨‍👩‍👧‍👦 Add Family
  "/addFamily/family_form_page.html",
  "/addFamily/family_form.js",
  "/addFamily/family_style.css",

  // 👤 Add Member
  "/addmember/add_member.html",
  "/addmember/add_member.js",
  "/addmember/add_member.css",

  // 🏠 Dashboard
  "/dashboard/dashboard.html",
  "/dashboard/dashboard.js",
  "/dashboard/dashboard.css",

  // 📋 Show Member
  "/showmember/show_member.html",
  "/showmember/show_member.js",
  "/showmember/show_member.css",

  // 📄 Show Survey
  "/showSurvey/show_survey.html",
  "/showSurvey/show_survey.js",
  "/showSurvey/show_survey.css",

  // 🔑 Password Reset
  "/resetpassword/reset_password.html",
  "/resetpassword/reset_password.js",

  // 📝 Signup
  "/signup/signup.html",
  "/signup/signup.js",
  "/signup/signup.css",

  // 🖼️ Icons & Images
  "/Images/eye-close.png",
  "/Images/eye-open.png",
  "/Images/icon-72.png",
  "/Images/icon-96.png",
  "/Images/icon-128.png",
  "/Images/icon-144.png",
  "/Images/icon-192.png",
  "/Images/icon-512.png"
];

// ✅ Install: Cache all essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ✅ Activate: Clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: Serve from cache, update in background
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update cache in background
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, networkResponse.clone())
          );
          return networkResponse;
        })
        .catch(() => caches.match("/offline.html")); // Fallback offline page

      return cachedResponse || fetchPromise;
    })
  );
});
