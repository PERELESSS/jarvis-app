// Jarvis's service worker: only for alerts. It shows what a computer pushes (decrypted by the
// browser) and opens the right screen when one is tapped. It doesn't cache anything, so the app
// always loads the latest version.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let m = {};
  try {
    m = e.data ? e.data.json() : {};
  } catch {
    m = { body: e.data ? e.data.text() : "" };
  }
  // iPhone stops a page's alerts if a push ever arrives without one being shown, so always show one.
  e.waitUntil(
    self.registration.showNotification(m.title || "Jarvis", {
      body: m.body || "",
      tag: m.tag || undefined,
      icon: "icon-192.png",
      badge: "icon-192.png",
      data: { open: m.open || "home", computer: m.computer || "" },
    }),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const { open, computer } = e.notification.data || {};
  const hash = `#open=${encodeURIComponent(open || "home")}&c=${encodeURIComponent(computer || "")}`;
  e.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of list) {
        c.postMessage({ t: "open", open, computer });
        if ("focus" in c) return c.focus();
      }
      return self.clients.openWindow(new URL(`./${hash}`, self.registration.scope).href);
    })(),
  );
});
