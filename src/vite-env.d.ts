/// <reference types="vite/client" />

// Ambient declarations for the environment variables this app reads at build
// time. `vite/client` already types `import.meta.env` (including BASE_URL),
// but the concrete VITE_* keys are project-specific and must be declared so
// they are not treated as `any`.
interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
