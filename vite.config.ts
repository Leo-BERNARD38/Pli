import { defineConfig } from 'vite'

// Deux entrées, deux bundles réellement distincts : rien de l'atelier ne doit pouvoir
// atterrir dans le bundle qui part chez elle (docs/architecture.md#deux-entrées).
export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    // Deux appareils connus, iOS 26 et Android 16 : aucun préfixe, aucun polyfill
    // (docs/architecture.md#compatibilité).
    target: 'esnext',
    rollupOptions: {
      input: {
        lecteur: 'index.html',
        atelier: 'atelier/index.html',
      },
    },
  },
})
