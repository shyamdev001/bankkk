/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'pdfjs-dist/build/pdf.worker.mjs?url' {
  const url: string;
  export default url;
}
