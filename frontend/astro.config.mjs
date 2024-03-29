import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const isDev = process.env.PUBLIC_MODE_DEV;

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  build: { 
    assets: isDev === '1' ? "_astro" : "static/styles",
  }
});