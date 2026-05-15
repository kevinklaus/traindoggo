/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: 'true';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
