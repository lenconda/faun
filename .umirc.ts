import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'faun',
  outputPath: 'docs/dist',
  mode: 'site',
  publicPath: '/',
  base: '/',
  hash: true,
  locales: [
    ['en', 'English'],
    ['zh', '中文'],
  ],
  theme: {
    '@c-primary': '#007bff',
  },
  resolve: {
    includes: ['docs'],
    previewLangs: [],
  },
  navs: {
    en: [
      null,
      {
        title: 'GitHub',
        path: 'https://github.com/lenconda/faun',
      },
    ],
    zh: [
      null,
      {
        title: 'GitHub',
        path: 'https://github.com/lenconda/faun',
      },
    ],
  },
  logo: false,
  exportStatic: {},
});
