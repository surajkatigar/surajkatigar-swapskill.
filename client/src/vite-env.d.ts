/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module 'three128' {
  export * from 'three';
}
