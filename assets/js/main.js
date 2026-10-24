/*
 * main.js — pinta el sitio desde WTM_CONTENIDO (contenido.js) y conecta las
 * interacciones: menú móvil, acordeón, cuenta regresiva, contadores, revelado
 * al hacer scroll y el video del hero (scroll-video.js).
 */
(function () {
  "use strict";

  var C = window.WTM_CONTENIDO;
  if (!C) {
    console.error("WTM: falta WTM_CONTENIDO. ¿Se cargó assets/js/contenido.js antes que main.js?");
    return;
  }

  var raiz = document.documentElement;
  var movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- utilidades ---------- */

  function obtener(ruta) {
    return ruta.split(".").reduce(function (obj, clave) {
      return obj == null ? undefined : obj[clave];
    }, C);
  }

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto != null) el.textContent = texto;
    return el;
  }

  function texto(el, valor) {
    var vacio = valor == null || valor === "";
    el.textContent = vacio ? "" : String(valor);
    // Un campo vacío en contenido.js oculta su elemento en vez de dejar un hueco.
    el.hidden = vacio;
  }

  function configurarEnlace(a, href, nuevaPestana) {
    a.setAttribute("href", href || "#hero");
    if (nuevaPestana && !/^#/.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  }

  // Enteros como siempre; con parte decimal, exactamente un decimal (29,2).
  function formatoCifra(valor) {
    return Number.isInteger(valor)
      ? new Intl.NumberFormat("es-BO")
      : new Intl.NumberFormat("es-BO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function configurarRegistro(a) {
    configurarEnlace(a, C.registro.url, C.registro.nuevaPestana);
  }

  /* ---------- metadatos ---------- */

  function fijarMeta(selector, valor) {
    var el = $(selector);
    if (el && valor) el.setAttribute("content", valor);
  }

  function aplicarMeta() {
    var m = C.meta || {};
    var tituloEstatico = document.title;
    if (m.titulo) document.title = m.titulo;
    fijarMeta('meta[name="description"]', m.descripcion);
    fijarMeta('meta[name="theme-color"]', m.themeColor);
    fijarMeta('meta[property="og:title"]', m.titulo);
    fijarMeta('meta[property="og:description"]', m.descripcion);
    fijarMeta('meta[property="og:image"]', m.ogImagen);
    fijarMeta('meta[property="og:image:alt"]', m.ogImagenAlt);
    fijarMeta('meta[name="twitter:title"]', m.titulo);
    fijarMeta('meta[name="twitter:description"]', m.descripcion);
    fijarMeta('meta[name="twitter:image"]', m.ogImagen);
    fijarMeta('meta[name="twitter:image:alt"]', m.ogImagenAlt);
    // index.html y meta.* se sincronizan a mano (README-DEV.md): en local se avisa si
    // el título estático, el que leen los rastreadores, quedó desactualizado.
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && m.titulo && tituloEstatico !== m.titulo) {
      console.warn("WTM: el <title> de index.html no coincide con meta.titulo de contenido.js.", {
        indexHtml: tituloEstatico,
        contenidoJs: m.titulo,
      });
    }
    if (m.url) {
      var og = document.createElement("meta");
      og.setAttribute("property", "og:url");
      og.setAttribute("content", m.url);
      document.head.appendChild(og);
      var canon = document.createElement("link");
      canon.rel = "canonical";
      canon.href = m.url;
      document.head.appendChild(canon);
    }
  }

  /* ---------- pintado de textos, enlaces e imágenes ---------- */

  function pintarTextos() {
    $$("[data-t]").forEach(function (el) {
      texto(el, obtener(el.getAttribute("data-t")));
    });
    $$("[data-aria]").forEach(function (el) {
      el.setAttribute("aria-label", obtener(el.getAttribute("data-aria")) || "");
    });
    $$("[data-parrafos]").forEach(function (el) {
      (obtener(el.getAttribute("data-parrafos")) || []).forEach(function (p) {
        el.appendChild(crear("p", null, p));
      });
    });
    $$("[data-registro]").forEach(configurarRegistro);
    $$("[data-cta]").forEach(function (a) {
      var cta = obtener(a.getAttribute("data-cta")) || {};
      texto(a, cta.texto);
      if (cta.usaRegistro) configurarRegistro(a);
      else configurarEnlace(a, cta.href, cta.nuevaPestana);
    });

    // El enlace al mapa solo existe si hay URL: nunca un <a> sin destino.
    var mapa = $("[data-mapa]");
    if (mapa && C.evento.mapaUrl) {
      var a = crear("a", "enlace dato__mapa", C.evento.mapaTexto);
      configurarEnlace(a, C.evento.mapaUrl, true);
      mapa.appendChild(a);
    }
  }

  function pintarImagenes() {
    $$("[data-img]").forEach(function (img) {
      var datos = obtener(img.getAttribute("data-img"));
      var contenedor = img.parentElement;
      if (!datos || !datos.src) {
        contenedor.classList.add("medio--vacio");
        img.hidden = true;
        return;
      }
      var decorativa = !datos.alt;
      img.alt = decorativa ? "" : datos.alt;
      if (decorativa) img.setAttribute("aria-hidden", "true");
      if (datos.ancho) img.width = datos.ancho;
      if (datos.alto) img.height = datos.alto;
      // Si la imagen aún no existe, el contenedor muestra su gradiente de respaldo.
      img.addEventListener("error", function () {
        contenedor.classList.add("medio--vacio");
        img.hidden = true;
      });
      img.addEventListener("load", function () {
        contenedor.classList.add("medio--cargado");
      });
      img.src = datos.src;
    });
  }

  /* ---------- listas ---------- */

  var ICONOS = {
    instagram:
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.6-1.5H17V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.3H8.5v3H11V21"/>',
    linkedin:
      '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1-3 2.5-3s2.5 1 2.5 3V17"/>',
    x: '<path d="M4 4l6.6 8.8L4.3 20M20 4l-6.3 6.9M4 4h4l12 16h-4z"/>',
    youtube:
      '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.4 4.6 5 5"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.6 5.7 3.6 9s-1.1 6.3-3.6 9M12 3c-2.5 2.7-3.6 5.7-3.6 9s1.1 6.3 3.6 9"/>',
  };

  function icono(nombre) {
    return (
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONOS[nombre] || ICONOS.web) +
      "</svg>"
    );
  }

  function pintarListas() {
    var nav = $('[data-lista="nav"]');
    C.sitio.nav.forEach(function (item) {
      var li = crear("li");
      var a = crear("a", "menu__enlace", item.texto);
      a.href = item.href;
      li.appendChild(a);
      nav.appendChild(li);
    });

    var tarjetas = $('[data-lista="wtm.tarjetas"]');
    C.wtm.tarjetas.forEach(function (t, i) {
      var li = crear("li", "tarjeta revelar");
      li.style.setProperty("--retraso", i * 90 + "ms");
      li.appendChild(crear("span", "tarjeta__num", String(i + 1).padStart(2, "0"))).setAttribute("aria-hidden", "true");
      li.appendChild(crear("h3", "tarjeta__titulo", t.titulo));
      li.appendChild(crear("p", "tarjeta__texto", t.texto));
      tarjetas.appendChild(li);
    });

    var linea = $('[data-lista="agenda.bloques"]');
    C.agenda.bloques.forEach(function (b) {
      var li = crear("li", "linea__item revelar");
      li.appendChild(crear("p", "linea__hora", b.hora));
      var cuerpo = crear("div", "linea__cuerpo");
      cuerpo.appendChild(crear("h3", "linea__titulo", b.titulo));
      if (b.descripcion) cuerpo.appendChild(crear("p", "linea__texto", b.descripcion));
      if (b.ponente) cuerpo.appendChild(crear("p", "linea__ponente", b.ponente));
      li.appendChild(cuerpo);
      linea.appendChild(li);
    });

    var cifras = $('[data-lista="cifras.items"]');
    C.cifras.items.forEach(function (c, i) {
      var formato = formatoCifra(c.valor);
      var li = crear("li", "cifra revelar");
      li.style.setProperty("--retraso", i * 90 + "ms");
      var valor = crear("p", "cifra__valor");
      var visible = crear("span", null);
      visible.setAttribute("aria-hidden", "true");
      visible.appendChild(document.createTextNode(c.prefijo || ""));
      var numero = crear("span", "cifra__numero", formato.format(c.valor));
      numero.setAttribute("data-contador", c.valor);
      visible.appendChild(numero);
      visible.appendChild(document.createTextNode(c.sufijo || ""));
      valor.appendChild(visible);
      // El lector de pantalla oye el valor final, no la animación del conteo.
      valor.appendChild(crear("span", "sr-only", (c.prefijo || "") + formato.format(c.valor) + (c.sufijo || "")));
      li.appendChild(valor);
      li.appendChild(crear("p", "cifra__etiqueta", c.etiqueta));
      cifras.appendChild(li);
    });

    var redes = $('[data-lista="footer.redes"]');
    C.footer.redes.forEach(function (r) {
      var li = crear("li");
      var a = crear("a", "red");
      configurarEnlace(a, r.url, true);
      a.innerHTML = icono(r.icono);
      a.appendChild(crear("span", "red__nombre", r.nombre));
      li.appendChild(a);
      redes.appendChild(li);
    });
  }

  /* ---------- acordeón (patrón WAI-ARIA) ---------- */

  function pintarAcordeon() {
    var cont = $("[data-acordeon]");
    var botones = [];
    C.faq.preguntas.forEach(function (item, i) {
      var idBoton = "faq-boton-" + (i + 1);
      var idPanel = "faq-panel-" + (i + 1);
      var bloque = crear("div", "acordeon__item revelar");
      var h3 = crear("h3", "acordeon__encabezado");
      var boton = crear("button", "acordeon__boton");
      boton.type = "button";
      boton.id = idBoton;
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-controls", idPanel);
      boton.appendChild(crear("span", "acordeon__pregunta", item.pregunta));
      boton.appendChild(crear("span", "acordeon__icono")).setAttribute("aria-hidden", "true");
      h3.appendChild(boton);

      var panel = crear("div", "acordeon__panel");
      panel.id = idPanel;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", idBoton);
      panel.hidden = true;
      panel.appendChild(crear("p", null, item.respuesta));

      boton.addEventListener("click", function () {
        var abrir = boton.getAttribute("aria-expanded") !== "true";
        boton.setAttribute("aria-expanded", String(abrir));
        panel.hidden = !abrir;
      });

      bloque.appendChild(h3);
      bloque.appendChild(panel);
      cont.appendChild(bloque);
      botones.push(boton);
    });

    // Flechas, Inicio y Fin mueven el foco entre preguntas.
    cont.addEventListener("keydown", function (e) {
      var i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      var destino = null;
      if (e.key === "ArrowDown") destino = botones[(i + 1) % botones.length];
      else if (e.key === "ArrowUp") destino = botones[(i - 1 + botones.length) % botones.length];
      else if (e.key === "Home") destino = botones[0];
      else if (e.key === "End") destino = botones[botones.length - 1];
      if (destino) {
        e.preventDefault();
        destino.focus();
      }
    });
  }

  /* ---------- cabecera y menú móvil ---------- */

  function iniciarCabecera() {
    var cabecera = $("[data-cabecera]");
    var pendiente = false;
    function actualizar() {
      pendiente = false;
      cabecera.classList.toggle("cabecera--solida", window.scrollY > 24);
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!pendiente) {
          pendiente = true;
          requestAnimationFrame(actualizar);
        }
      },
      { passive: true }
    );
    actualizar();
  }

  function iniciarMenu() {
    var cabecera = $("[data-cabecera]");
    var boton = $("[data-menu-boton]");
    var menu = $("[data-menu]");
    var etiqueta = $("[data-menu-etiqueta]");
    var fondo = [$("main"), $(".pie")];
    var escritorio = window.matchMedia("(min-width: 960px)");
    var abierto = false;

    etiqueta.textContent = C.sitio.menuAbrir;

    function enfocables() {
      return [boton].concat($$("a[href], button:not([disabled])", menu));
    }

    function abrir() {
      abierto = true;
      boton.setAttribute("aria-expanded", "true");
      etiqueta.textContent = C.sitio.menuCerrar;
      cabecera.classList.add("cabecera--menu");
      raiz.classList.add("menu-abierto");
      // Lo que queda detrás del menú no se puede alcanzar con teclado ni lector.
      fondo.forEach(function (el) {
        el.inert = true;
        el.setAttribute("aria-hidden", "true");
      });
      var primero = $("a", menu);
      if (primero) primero.focus();
    }

    function cerrar(devolverFoco) {
      if (!abierto) return;
      abierto = false;
      boton.setAttribute("aria-expanded", "false");
      etiqueta.textContent = C.sitio.menuAbrir;
      cabecera.classList.remove("cabecera--menu");
      raiz.classList.remove("menu-abierto");
      fondo.forEach(function (el) {
        el.inert = false;
        el.removeAttribute("aria-hidden");
      });
      if (devolverFoco) boton.focus();
    }

    boton.addEventListener("click", function () {
      if (abierto) cerrar(true);
      else abrir();
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrar(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!abierto) return;
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar(true);
        return;
      }
      if (e.key !== "Tab") return;
      // Foco atrapado: Tab y Shift+Tab giran dentro del menú mientras está abierto.
      var lista = enfocables();
      var primero = lista[0];
      var ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      } else if (lista.indexOf(document.activeElement) < 0) {
        e.preventDefault();
        primero.focus();
      }
    });

    function alCambiarAncho(e) {
      if (e.matches) cerrar(false);
    }
    if (escritorio.addEventListener) escritorio.addEventListener("change", alCambiarAncho);
    else escritorio.addListener(alCambiarAncho);
  }

  /* ---------- sección activa en la navegación ---------- */

  function iniciarSeccionActiva() {
    if (!("IntersectionObserver" in window)) return;
    var enlaces = $$(".menu__enlace");
    var porId = {};
    enlaces.forEach(function (a) {
      porId[a.getAttribute("href").slice(1)] = a;
    });
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          var a = porId[en.target.id];
          if (a && en.isIntersecting) {
            enlaces.forEach(function (otro) {
              otro.classList.toggle("es-activo", otro === a);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(porId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  }

  /* ---------- cuenta regresiva ---------- */

  function iniciarCuenta() {
    var cfg = C.evento.cuentaRegresiva;
    var titulo = $(".cuenta__titulo");
    var reloj = $("[data-cuenta-reloj]");
    var mensaje = $("[data-cuenta-mensaje]");
    var celdas = {};
    $$("[data-cuenta-unidad]").forEach(function (el) {
      celdas[el.getAttribute("data-cuenta-unidad")] = el;
    });
    var objetivo = C.evento.fechaISO ? Date.parse(C.evento.fechaISO) : NaN;
    var dia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(C.evento.fechaDia || "");
    var intervalo = null;

    function mostrarMensaje(txt) {
      clearInterval(intervalo);
      reloj.hidden = true;
      titulo.hidden = true;
      mensaje.textContent = txt;
      mensaje.hidden = false;
    }

    function dos(n) {
      return String(n).padStart(2, "0");
    }

    function tic() {
      var resta = objetivo - Date.now();
      if (resta <= 0) {
        mostrarMensaje(cfg.pasado);
        return;
      }
      var s = Math.floor(resta / 1000);
      celdas.dias.textContent = dos(Math.floor(s / 86400));
      celdas.horas.textContent = dos(Math.floor((s % 86400) / 3600));
      celdas.minutos.textContent = dos(Math.floor((s % 3600) / 60));
      celdas.segundos.textContent = dos(s % 60);
    }

    if (isNaN(objetivo)) {
      // Sin hora no hay cuenta regresiva; con el día del evento sí se sabe si ya pasó.
      // Se compara la fecha local de hoy (AAAA-MM-DD) con fechaDia.
      var hoy = new Date();
      var hoyTexto = hoy.getFullYear() + "-" + dos(hoy.getMonth() + 1) + "-" + dos(hoy.getDate());
      mostrarMensaje(dia && hoyTexto > dia[0] ? cfg.pasado : cfg.sinFecha);
      return;
    }
    tic();
    if (objetivo > Date.now()) intervalo = setInterval(tic, 1000);
  }

  /* ---------- contadores y revelado ---------- */

  function animarContador(el) {
    var final = Number(el.getAttribute("data-contador"));
    var formato = formatoCifra(final);
    var redondear = Number.isInteger(final)
      ? Math.round
      : function (v) {
          return Math.round(v * 10) / 10;
        };
    var duracion = 1600;
    var inicio = null;
    function paso(t) {
      if (inicio === null) inicio = t;
      var x = Math.min(1, (t - inicio) / duracion);
      var suave = 1 - Math.pow(1 - x, 3);
      el.textContent = formato.format(x < 1 ? redondear(final * suave) : final);
      if (x < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function iniciarContadores() {
    var contadores = $$("[data-contador]");
    if (movimientoReducido.matches || !("IntersectionObserver" in window)) return;
    contadores.forEach(function (el) {
      el.textContent = formatoCifra(Number(el.getAttribute("data-contador"))).format(0);
    });
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            obs.unobserve(en.target);
            animarContador(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    contadores.forEach(function (el) {
      obs.observe(el);
    });
  }

  function iniciarRevelado() {
    if (movimientoReducido.matches || !("IntersectionObserver" in window)) return;
    raiz.classList.add("revelar-activo");
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("es-visible");
            obs.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    $$(".revelar").forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ---------- aviso para enlaces pendientes ---------- */

  function iniciarAviso() {
    var aviso = $("[data-aviso]");
    var textoAviso = $("[data-aviso-texto]");
    var vivo = $("[data-aviso-vivo]");
    var cerrarBtn = $("[data-aviso-cerrar]");
    var espera = null;

    function ocultar() {
      clearTimeout(espera);
      aviso.hidden = true;
    }

    cerrarBtn.addEventListener("click", ocultar);

    // Mientras no existan los enlaces reales, los "#...-pendiente" avisan en vez de navegar.
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href$="-pendiente"]');
      if (!a) return;
      e.preventDefault();
      textoAviso.textContent = C.sitio.avisoPendiente;
      vivo.textContent = "";
      // Se vacía y se vuelve a escribir para que el lector lo anuncie aunque se repita.
      setTimeout(function () {
        vivo.textContent = C.sitio.avisoPendiente;
      }, 50);
      aviso.hidden = false;
      clearTimeout(espera);
      espera = setTimeout(ocultar, 5000);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !aviso.hidden) ocultar();
    });
  }

  /* ---------- arranque ---------- */

  aplicarMeta();
  pintarTextos();
  pintarImagenes();
  pintarListas();
  pintarAcordeon();
  iniciarCabecera();
  iniciarMenu();
  iniciarSeccionActiva();
  iniciarCuenta();
  iniciarContadores();
  iniciarRevelado();
  iniciarAviso();

  if (window.WTMScrollVideo) {
    window.WTMScrollVideo.iniciar({
      hero: $("[data-hero]"),
      video: $("[data-hero-video]"),
      poster: $("[data-hero-poster]"),
      src: C.hero.video.src,
      posterSrc: C.hero.video.poster,
    });
  }
})();
