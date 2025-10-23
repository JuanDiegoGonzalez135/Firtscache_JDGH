// Registro del Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('[SW] Registrado con éxito:', reg.scope))
    .catch(err => console.error('[SW] Error al registrar:', err));
}
