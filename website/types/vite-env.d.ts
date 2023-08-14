/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Prettier {
  format(
    code: string,
    options: {
      parser: string;
      plugins: any[];
      singleQuote?: boolean;
      tabWidth?: number;
    }
  ): string;
}

interface Window {
  readonly terminal: any;
  readonly prettier: Prettier;
  readonly prettierPlugins: any;
}

interface Response<T> {
  code: number;
  data: T;
}
