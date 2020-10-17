import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'faun',
  outputPath: 'docs/dist',
  mode: 'site',
  theme: {
    '@c-primary': '#007bff',
  },
  resolve: {
    includes: ['docs'],
  },
});
