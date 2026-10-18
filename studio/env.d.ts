// Studio environment variables (only SANITY_STUDIO_* reach the browser).
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly SANITY_STUDIO_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
