// Re-verifica las cinco correcciones que pidió el QA (QA-01 a QA-05).
// Requiere Playwright (`npm i -D playwright`) y Google Chrome instalado.
// Uso, desde la raíz del proyecto: node qa/verificar-correcciones.cjs . qa/verificacion.json
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');

const [raiz = '.', salida = 'qa/verificacion.json'] = process.argv.slice(2);
const PUERTO = 8097;
const URL = `http://127.0.0.1:${PUERTO}/`;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(browser, opciones = {}, preparar) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...opciones });
  const page = await ctx.newPage();
  if (preparar) await preparar(page, ctx);
  return { ctx, page };
}

async function esperarScrub(page) {
  await page.waitForFunction(() => document.querySelector('#hero')?.dataset.videoModo === 'scrub', null, { timeout: 30000 });
  await espera(600);
}

(async () => {
  const servidor = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: raiz, stdio: 'ignore' });
  await espera(1200);
  const browser = await chromium.launch({ channel: 'chrome' });
  const r = {};

  try {
    // QA-01 · recargar a mitad de la portada no debe saltar a otra sección
    {
      const { ctx, page } = await abrir(browser);
      await page.goto(URL);
      await esperarScrub(page);
      await page.evaluate(() => window.scrollTo(0, 800));
      await espera(500);
      await page.reload();
      await esperarScrub(page);
      await espera(1500);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      r.qa01_recarga = { antes: 800, despues: y, pasa: Math.abs(y - 800) <= 60 };
      await ctx.close();
    }
    {
      const { ctx, page } = await abrir(browser, {}, async (p) => {
        await p.route('**/hero.mp4', async (route) => { await espera(4000); await route.continue(); });
      });
      await page.goto(URL);
      await page.evaluate(() => window.scrollTo(0, 400));
      await esperarScrub(page);
      await espera(1500);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      r.qa01_cargaLenta = { antes: 400, despues: y, pasa: Math.abs(y - 400) <= 60 };
      await ctx.close();
    }

    // QA-02 · el texto de la portada solo tiene dos estados estables
    {
      const { ctx, page } = await abrir(browser);
      await page.goto(URL);
      await esperarScrub(page);
      const muestras = [];
      for (const p of [0.5, 0.7, 0.77, 0.8, 0.85, 0.9]) {
        await page.evaluate((p) => {
          const h = document.querySelector('#hero');
          const recorrido = h.offsetHeight - window.innerHeight;
          window.scrollTo(0, Math.round(recorrido * p));
        }, p);
        await espera(1200);
        muestras.push(await page.evaluate((p) => {
          const c = document.querySelector('.hero__contenido');
          const v = document.querySelector('.hero__velo');
          return {
            progreso: p,
            opacidadTexto: Number(getComputedStyle(c).opacity),
            opacidadVelo: Number(getComputedStyle(v).opacity),
            ariaHidden: c.getAttribute('aria-hidden') === 'true',
          };
        }, p));
      }
      const pasa = muestras.every((m) =>
        (m.opacidadTexto >= 0.99 && m.opacidadVelo >= 0.99) || (m.opacidadTexto <= 0.01 && m.ariaHidden));
      r.qa02_dosEstados = { muestras, pasa };
      await ctx.close();
    }

    // QA-03 y QA-04 · cifras con decimal y metadatos estáticos sincronizados
    {
      const { ctx, page } = await abrir(browser);
      await page.goto(URL);
      await page.locator('#cifras').scrollIntoViewIfNeeded();
      await espera(2500);
      const cifras = await page.locator('#cifras').innerText();
      r.qa03_cifras = { muestra29_2: /29,2/.test(cifras), muestra330: /330/.test(cifras), pasa: /29,2/.test(cifras) };

      const html = await (await page.request.get(URL)).text();
      const meta = await page.evaluate(() => window.WTM_CONTENIDO.meta);
      const leer = (re) => (html.match(re) || [])[1];
      const estaticos = {
        title: leer(/<title>([^<]*)<\/title>/),
        description: leer(/name="description" content="([^"]*)"/),
        ogTitle: leer(/property="og:title" content="([^"]*)"/),
        ogDescription: leer(/property="og:description" content="([^"]*)"/),
        twitterTitle: leer(/name="twitter:title" content="([^"]*)"/),
      };
      r.qa04_metadatos = {
        estaticos,
        pasa: estaticos.title === meta.titulo && estaticos.ogTitle === meta.titulo && estaticos.twitterTitle === meta.titulo
          && estaticos.description === meta.descripcion && estaticos.ogDescription === meta.descripcion,
      };
      await ctx.close();
    }

    // QA-05 · el día después del evento ya no dice «es hoy»
    {
      const { ctx, page } = await abrir(browser, {}, async (p) => {
        await p.addInitScript(() => {
          const fijo = new Date('2026-10-25T12:00:00-04:00').getTime();
          const D = Date;
          class F extends D { constructor(...a) { super(...(a.length ? a : [fijo])); } static now() { return fijo; } }
          window.Date = F;
        });
      });
      await page.goto(URL);
      await espera(800);
      const mensaje = await page.locator('[data-cuenta-mensaje]').innerText();
      const pasado = await page.evaluate(() => window.WTM_CONTENIDO.evento.cuentaRegresiva.pasado);
      r.qa05_despues = { mensaje, pasa: mensaje.trim() === pasado.trim() && !/es hoy/i.test(mensaje) };
      await ctx.close();
    }

  } finally {
    await browser.close();
    servidor.kill();
  }

  r.fecha = new Date().toISOString();
  fs.writeFileSync(salida, JSON.stringify(r, null, 2));
  console.log(JSON.stringify(r, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
