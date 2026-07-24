/* ==========================================================================
   SUPRA CONSULTING — api.js
   Single source of truth for the backend base URL + a tiny fetch helper.
   Loaded before main.js / admin.html's inline scripts on every page.
   ========================================================================== */

// Change this one line if the API is deployed somewhere other than
// http://localhost:5000 (e.g. a production domain).
//
// Covers three local cases, not just "hostname === localhost":
//  - opened through a dev server on localhost/127.0.0.1
//  - opened by double-clicking the .html file (protocol is "file:",
//    hostname is "" — this is why images/data didn't load before)
//  - opened on a LAN IP like 192.168.x.x while testing from another device
const isLocal =
  window.location.protocol === "file:" ||
  window.location.hostname === "" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(window.location.hostname);

// 👇 EDIT THIS after deploying the backend (e.g. on Render): paste the live
// backend URL here, no trailing slash. Example:
// const PRODUCTION_API_BASE = "https://supra-consulting-api.onrender.com";
const PRODUCTION_API_BASE = "";

const API_BASE = isLocal ? "http://localhost:5000" : PRODUCTION_API_BASE;

/**
 * Small wrapper around fetch() that:
 *  - prefixes every call with API_BASE
 *  - always sends/expects JSON (unless body is FormData, e.g. file uploads)
 *  - throws a readable Error on non-2xx responses instead of failing silently
 */
async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const opts = {
    ...options,
    headers: isFormData
      ? options.headers
      : { "Content-Type": "application/json", ...(options.headers || {}) },
  };

  const res = await fetch(`${API_BASE}${path}`, opts);
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* non-JSON response (e.g. 404 HTML page) — data stays null */
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

/** Resolve an image path returned by the API into a full URL the <img> tag can use. */
function resolveImage(image, fallback = "") {
  if (!image) return fallback;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_BASE}${image}`;
}
