import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Páginas internas, servidas a partir de <pasta>/index.html.
const pages = ['orcamento-bubbles'];

// Sem a barra final, o Vite não encontra a página e cai no fallback da home.
// Este plugin redireciona /pagina para /pagina/ no dev e no preview.
function trailingSlash() {
  const redirect = (req, res, next) => {
    const [path, query] = (req.url ?? '').split('?');
    const page = path.replace(/^\//, '');
    if (!pages.includes(page)) return next();
    res.statusCode = 302;
    res.setHeader('Location', `/${page}/${query ? `?${query}` : ''}`);
    res.end();
  };
  return {
    name: 'trailing-slash',
    configureServer(server) { server.middlewares.use(redirect); },
    configurePreviewServer(server) { server.middlewares.use(redirect); },
  };
}

export default defineConfig({
  plugins: [trailingSlash()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ...Object.fromEntries(pages.map(page => [page, fileURLToPath(new URL(`./${page}/index.html`, import.meta.url))])),
      },
    },
  },
});
