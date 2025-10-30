/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Puedes agregar más variables aquí si las necesitas en el futuro
  // readonly VITE_OTRA_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
