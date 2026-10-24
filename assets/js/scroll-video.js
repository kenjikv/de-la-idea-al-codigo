/*
 * scroll-video.js — video del hero ligado al scroll.
 *
 * Al bajar, el video avanza; al subir, retrocede. El video nunca se reproduce solo:
 * el scroll es lo único que mueve currentTime.
 *
 * Estados (atributo data-video-modo en la sección hero, útil para depurar y QA):
 *   cargando → esperando metadatos y la prueba real de scrubbing.
 *   scrub    → contenedor alto (300vh) y video pegado (sticky) que sigue al scroll.
 *   poster   → sin video: póster + gradiente animado. data-video-motivo dice por qué
 *              (reduce | error | tiempo | sin-scrub | sin-soporte).
 *
 * Al recargar, la posición se restaura a mano (history.scrollRestoration = "manual"):
 * el navegador la restauraría contra el hero corto de "cargando" y la persona
 * aparecería en otra sección cuando el hero crece a 300vh.
 *
 * Uso: WTMScrollVideo.iniciar({ hero, video, poster, src, posterSrc }).
 */
(function () {
  "use strict";

  var LERP = 0.12;
  // Solo se pide un nuevo cuadro al decodificador si la diferencia supera ~1 cuadro.
  var UMBRAL_S = 1 / 60;
  var ESPERA_CARGA_MS = 6000;
  var ESPERA_PRUEBA_MS = 2500;
  // El texto del hero se oculta de golpe (con transición CSS breve) a partir de este
  // progreso. Una banda de desvanecimiento ligada al scroll deja estados intermedios
  // estables con contraste insuficiente; con un umbral solo existen "legible" u "oculto".
  var OCULTAR_DESDE = 0.78;
  var MOSTRAR_BAJO = 0.76;
  var CLAVE_SCROLL = "wtm-scroll:" + location.pathname;

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function desplazarSinAnimacion(top) {
    try {
      window.scrollTo({ top: top, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, top);
    }
  }

  function leerGuardado() {
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      if (!nav || (nav.type !== "reload" && nav.type !== "back_forward")) return null;
      var g = JSON.parse(sessionStorage.getItem(CLAVE_SCROLL) || "null");
      return g && isFinite(g.y) && g.heroH > 0 ? g : null;
    } catch (e) {
      return null;
    }
  }

  function iniciar(op) {
    var hero = op.hero;
    var video = op.video;
    var poster = op.poster;
    if (!hero) return;
    var contenido = hero.querySelector(".hero__contenido");
    var textoOculto = false;

    var modo = "";
    var usoBlob = false;
    var urlBlob = null;
    var temporizador = null;
    var rafId = 0;
    var actual = 0;
    var duracion = 0;
    var observador = null;

    function fijarModo(nuevo, motivo) {
      modo = nuevo;
      hero.setAttribute("data-video-modo", nuevo);
      if (motivo) hero.setAttribute("data-video-motivo", motivo);
      else hero.removeAttribute("data-video-motivo");
    }

    // Posición equivalente en el layout actual para alguien que estaba en "y" cuando
    // el hero medía "antes": debajo del hero se conserva la sección que tenía delante;
    // dentro del hero se queda donde estaba (si el hero se acorta, sin salirse de él).
    function posicionEquivalente(y, antes, recorridoAntes) {
      var ahora = hero.offsetHeight;
      if (y >= antes) return Math.max(0, y + ahora - antes);
      if (ahora >= antes) return y;
      var recorrido = Math.max(0, ahora - window.innerHeight);
      if (recorridoAntes > 0 && recorrido > 0) return Math.round((y / recorridoAntes) * recorrido);
      return Math.min(y, recorrido);
    }

    // Cambia la altura del hero sin mover la lectura. El anclaje de scroll nativo se
    // apaga durante el cambio para que no sume su propia compensación a la nuestra.
    function cambiarAltura(aplicar) {
      var raiz = document.documentElement;
      var antes = hero.offsetHeight;
      var recorridoAntes = Math.max(0, antes - window.innerHeight);
      var y = window.scrollY;
      raiz.style.overflowAnchor = "none";
      aplicar();
      if (hero.offsetHeight !== antes) {
        var destino = restaurarPendiente() ? null : posicionEquivalente(y, antes, recorridoAntes);
        if (destino !== null && Math.abs(destino - window.scrollY) > 1) desplazarSinAnimacion(destino);
      }
      requestAnimationFrame(function () {
        raiz.style.overflowAnchor = "";
      });
    }

    // Restauración manual tras recargar: se aplica ya contra el hero de "cargando" y,
    // si la persona no se movió mientras tanto, otra vez con la altura definitiva.
    var guardado = leerGuardado();
    var yRestaurada = -1;
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch (e) {}
    window.addEventListener("pagehide", function () {
      try {
        sessionStorage.setItem(
          CLAVE_SCROLL,
          JSON.stringify({ y: window.scrollY, heroH: hero.offsetHeight, vh: window.innerHeight })
        );
      } catch (e) {}
    });

    function restaurarPendiente() {
      if (!guardado) return false;
      var g = guardado;
      if (yRestaurada >= 0 && Math.abs(window.scrollY - yRestaurada) > 2) {
        // La persona ya hizo scroll: su posición manda.
        guardado = null;
        return false;
      }
      yRestaurada = posicionEquivalente(g.y, g.heroH, Math.max(0, g.heroH - g.vh));
      desplazarSinAnimacion(yRestaurada);
      yRestaurada = window.scrollY;
      return true;
    }

    // Cuando el texto del hero no se ve, tampoco se anuncia ni recibe foco.
    function fijarTextoOculto(ocultar) {
      if (!contenido || ocultar === textoOculto) return;
      textoOculto = ocultar;
      hero.classList.toggle("hero--texto-oculto", ocultar);
      if (ocultar) contenido.setAttribute("aria-hidden", "true");
      else contenido.removeAttribute("aria-hidden");
      Array.prototype.forEach.call(contenido.querySelectorAll("a, button"), function (el) {
        if (ocultar) el.setAttribute("tabindex", "-1");
        else el.removeAttribute("tabindex");
      });
    }

    function actualizarTexto(p) {
      if (!contenido) return;
      // Con el foco dentro, el texto sigue visible (y el velo a pleno) hasta que salga.
      var conFoco = contenido.contains(document.activeElement);
      if (textoOculto) fijarTextoOculto(p >= MOSTRAR_BAJO && !conFoco);
      else fijarTextoOculto(p >= OCULTAR_DESDE && !conFoco);
    }

    // Póster: si el archivo no existe, se oculta y queda el gradiente CSS de fondo.
    if (poster && op.posterSrc) {
      poster.addEventListener("error", function () {
        hero.classList.add("hero--sin-poster");
      });
      poster.src = op.posterSrc;
    } else {
      hero.classList.add("hero--sin-poster");
    }

    function caerAPoster(motivo) {
      if (modo === "poster") return;
      clearTimeout(temporizador);
      detenerBucle();
      if (observador) observador.disconnect();
      cambiarAltura(function () {
        hero.classList.remove("hero--scrub", "hero--video-listo");
        hero.classList.add("hero--fallback");
      });
      fijarTextoOculto(false);
      fijarModo("poster", motivo);
      if (video) {
        video.removeAttribute("src");
        try {
          video.load();
        } catch (e) {}
      }
      if (urlBlob) URL.revokeObjectURL(urlBlob);
    }

    fijarModo("cargando");
    restaurarPendiente();

    if (!video || typeof video.play !== "function") {
      caerAPoster("sin-soporte");
      return;
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce && reduce.matches) {
      caerAPoster("reduce");
      return;
    }
    if (reduce && reduce.addEventListener) {
      reduce.addEventListener("change", function (e) {
        if (e.matches) caerAPoster("reduce");
      });
    }

    if (!op.src || !("IntersectionObserver" in window) || !window.requestAnimationFrame) {
      caerAPoster("sin-soporte");
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = false;
    video.loop = false;
    video.preload = "auto";
    // El video no debe reproducirse nunca por su cuenta.
    video.addEventListener("play", function () {
      video.pause();
    });

    function armarEspera() {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        caerAPoster("tiempo");
      }, ESPERA_CARGA_MS);
    }

    video.addEventListener("error", function () {
      if (modo !== "poster") caerAPoster("error");
    });

    video.addEventListener("loadedmetadata", function () {
      if (modo !== "cargando") return;
      clearTimeout(temporizador);
      duracion = video.duration;
      probarScrub().then(function (funciona) {
        if (modo !== "cargando") return;
        if (funciona) {
          activarScrub();
        } else if (!usoBlob && window.fetch && /^https?:$/.test(location.protocol)) {
          // Algunos servidores (p. ej. python -m http.server) no aceptan peticiones por
          // rango y el navegador no puede saltar en el video. Desde un Blob en memoria sí.
          cargarComoBlob();
        } else {
          caerAPoster("sin-scrub");
        }
      });
    });

    // Prueba real: mover currentTime y comprobar que de verdad cambió. Safari en iOS
    // a veces ignora la búsqueda; no se adivina por user agent.
    function probarScrub() {
      return new Promise(function (resolver) {
        if (!isFinite(duracion) || duracion <= 0) {
          resolver(false);
          return;
        }
        var destino = Math.min(duracion * 0.5, 1);
        var listo = false;
        var espera;
        function terminar(ok) {
          if (listo) return;
          listo = true;
          clearTimeout(espera);
          video.removeEventListener("seeked", alBuscar);
          resolver(ok);
        }
        function alBuscar() {
          terminar(Math.abs(video.currentTime - destino) < 0.25 && video.readyState >= 2);
        }
        video.addEventListener("seeked", alBuscar);
        espera = setTimeout(function () {
          terminar(false);
        }, ESPERA_PRUEBA_MS);
        try {
          video.currentTime = destino;
        } catch (e) {
          terminar(false);
        }
      });
    }

    function cargarComoBlob() {
      usoBlob = true;
      armarEspera();
      fetch(op.src)
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.blob();
        })
        .then(function (blob) {
          if (modo !== "cargando") return;
          urlBlob = URL.createObjectURL(blob);
          video.src = urlBlob;
          video.load();
        })
        .catch(function () {
          caerAPoster("error");
        });
    }

    function progreso() {
      var rect = hero.getBoundingClientRect();
      var recorrido = hero.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return 0;
      return clamp(-rect.top / recorrido, 0, 1);
    }

    function cuadro() {
      rafId = requestAnimationFrame(cuadro);
      var p = progreso();
      hero.style.setProperty("--hero-p", p.toFixed(4));
      actualizarTexto(p);
      // Se evita el último instante para que el video no quede en estado "ended".
      var objetivo = p * Math.max(0, duracion - 0.05);
      actual += (objetivo - actual) * LERP;
      if (Math.abs(objetivo - actual) < 0.0005) actual = objetivo;
      if (!video.seeking && Math.abs(video.currentTime - actual) > UMBRAL_S) {
        video.currentTime = actual;
      }
    }

    function iniciarBucle() {
      if (!rafId && modo === "scrub") rafId = requestAnimationFrame(cuadro);
    }

    function detenerBucle() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function activarScrub() {
      cambiarAltura(function () {
        hero.classList.add("hero--scrub");
      });
      fijarModo("scrub");
      guardado = null;
      actual = progreso() * duracion;
      video.currentTime = actual;
      // Se muestra el video solo cuando ya tiene un cuadro pintado: nunca un hueco negro.
      var mostrar = function () {
        hero.classList.add("hero--video-listo");
      };
      if (video.readyState >= 2) mostrar();
      else video.addEventListener("loadeddata", mostrar, { once: true });
      video.addEventListener("seeked", mostrar, { once: true });

      // El bucle de rAF solo corre mientras el hero está en pantalla.
      observador = new IntersectionObserver(function (entradas) {
        if (entradas[0].isIntersecting) iniciarBucle();
        else detenerBucle();
      });
      observador.observe(hero);
    }

    armarEspera();
    video.src = op.src;
    video.load();
  }

  window.WTMScrollVideo = { iniciar: iniciar };
})();
