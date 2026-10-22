(function () {
  "use strict";

  var D = window.PORTFOLIO;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ------------------------------------------------------------
     1. Render content from data.js
  ------------------------------------------------------------ */
  function renderContent() {
    $("#profile").textContent = D.profile;
    $("#gh-hero").href = D.github;
    $("#gh-contact").href = D.github;
    $("#mail-btn").href = "mailto:" + D.email;
    $("#year").textContent = new Date().getFullYear();

    $("#stats").innerHTML = D.stats.map(function (s) {
      return '<div class="stat"><div class="num grad" data-count="' + s.value + '">0</div><div class="lbl">' + esc(s.label) + "</div></div>";
    }).join("");

    $("#project-grid").innerHTML = D.projects.map(function (p, i) {
      var href = p.repo || D.github;
      var label = p.repo ? "View on GitHub ↗" : "More on GitHub ↗";
      return (
        '<article class="card reveal"><div class="glare"></div><div class="card-inner">' +
        '<span class="idx mono">' + pad(i + 1) + "</span>" +
        "<h3>" + esc(p.title) + "</h3>" +
        "<p>" + esc(p.blurb) + "</p>" +
        '<ul class="tags">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<a class="link" href="' + esc(href) + '" target="_blank" rel="noopener">' + label + "</a>" +
        "</div></article>"
      );
    }).join("");

    $("#skills-list").innerHTML = D.skills.map(function (g) {
      return "<div><h3>" + esc(g.group) + '</h3><ul class="chips">' +
        g.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
    }).join("");

    $("#edu-years").textContent = D.education.years;
    $("#edu-school").textContent = D.education.school;
    $("#edu-degree").textContent = D.education.degree;
    $("#cert-list").innerHTML = D.certifications.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    $("#hack-list").innerHTML = D.hackathons.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
  }

  /* ------------------------------------------------------------
     2. Typing effect
  ------------------------------------------------------------ */
  function startTyping() {
    var el = $("#typed");
    var roles = D.roles;
    if (reduceMotion) { el.textContent = roles[0]; return; }
    var r = 0, c = 0, deleting = false;
    (function tick() {
      var word = roles[r];
      el.textContent = word.slice(0, c);
      var delay = deleting ? 28 : 65;
      if (!deleting && c === word.length) { deleting = true; delay = 1500; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      else { c += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* ------------------------------------------------------------
     3. 3D neural-network background (Three.js)
        - the camera flies through layers of nodes as you scroll
        - the mouse gives parallax
        - small glowing "signals" travel along the connections
  ------------------------------------------------------------ */
  var scrollTarget = 0, scrollCur = 0;
  var mouse = { x: 0, y: 0 };

  function initScene() {
    var canvas = $("#bg");
    if (!window.THREE) { canvas.style.display = "none"; return; }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      canvas.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x07080d, 1);

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080d, 0.032);
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);

    var LAYERS = 8, SPACING = 7, PER_LAYER = 20;
    var group = new THREE.Group();
    scene.add(group);

    // soft round sprite for points
    function makeSprite() {
      var s = document.createElement("canvas");
      s.width = s.height = 64;
      var g = s.getContext("2d");
      var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(s);
    }
    var sprite = makeSprite();

    // nodes
    var nodes = [];
    var layerIndex = [];
    var posArr = new Float32Array(LAYERS * PER_LAYER * 3);
    var colArr = new Float32Array(LAYERS * PER_LAYER * 3);
    var cA = new THREE.Color(0x7c5cff), cB = new THREE.Color(0x22d3ee), tmp = new THREE.Color();
    var n = 0;
    for (var l = 0; l < LAYERS; l++) {
      layerIndex.push([]);
      for (var k = 0; k < PER_LAYER; k++) {
        var p = new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 12,
          -l * SPACING + (Math.random() - 0.5) * 2
        );
        nodes.push(p);
        layerIndex[l].push(n);
        posArr[n * 3] = p.x; posArr[n * 3 + 1] = p.y; posArr[n * 3 + 2] = p.z;
        tmp.copy(cA).lerp(cB, Math.random() * 0.6 + (l / LAYERS) * 0.4);
        colArr[n * 3] = tmp.r; colArr[n * 3 + 1] = tmp.g; colArr[n * 3 + 2] = tmp.b;
        n++;
      }
    }
    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    var nodeMat = new THREE.PointsMaterial({
      size: 0.55, map: sprite, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // edges: each node links to its 2 nearest neighbours in the next layer
    var edges = [];
    for (var l2 = 0; l2 < LAYERS - 1; l2++) {
      layerIndex[l2].forEach(function (ai) {
        var a = nodes[ai];
        var sorted = layerIndex[l2 + 1].slice().sort(function (x, y) {
          return a.distanceToSquared(nodes[x]) - a.distanceToSquared(nodes[y]);
        });
        edges.push([ai, sorted[0]], [ai, sorted[1]]);
      });
    }
    var linePos = new Float32Array(edges.length * 6);
    edges.forEach(function (e, i) {
      var a = nodes[e[0]], b = nodes[e[1]];
      linePos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0x6d6bff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false
    })));

    // signals travelling along edges
    var SIGNALS = 90;
    var sig = [];
    for (var s = 0; s < SIGNALS; s++) {
      sig.push({ e: Math.floor(Math.random() * edges.length), t: Math.random(), v: 0.12 + Math.random() * 0.25 });
    }
    var sigPos = new Float32Array(SIGNALS * 3);
    var sigGeo = new THREE.BufferGeometry();
    sigGeo.setAttribute("position", new THREE.BufferAttribute(sigPos, 3));
    group.add(new THREE.Points(sigGeo, new THREE.PointsMaterial({
      size: 0.42, map: sprite, color: 0x7ff3ff, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })));

    // distant dust
    var DUST = 700;
    var dustPos = new Float32Array(DUST * 3);
    for (var d = 0; d < DUST; d++) {
      dustPos[d * 3] = (Math.random() - 0.5) * 90;
      dustPos[d * 3 + 1] = (Math.random() - 0.5) * 50;
      dustPos[d * 3 + 2] = 10 - Math.random() * (LAYERS * SPACING + 40);
    }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.12, map: sprite, color: 0x9aa3ff, transparent: true, opacity: 0.55,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })));

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    var startZ = 9, endZ = -(LAYERS - 1) * SPACING + 5;
    var clock = new THREE.Clock();
    var running = true;
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { clock.getDelta(); loop(); }
    });

    function frame(dt, t) {
      scrollCur += (scrollTarget - scrollCur) * 0.06;

      // signals
      if (!reduceMotion) {
        for (var i = 0; i < SIGNALS; i++) {
          var sg = sig[i];
          sg.t += sg.v * dt;
          if (sg.t >= 1) { sg.t = 0; sg.e = Math.floor(Math.random() * edges.length); }
        }
      }
      for (var j = 0; j < SIGNALS; j++) {
        var g = sig[j], ed = edges[g.e], a = nodes[ed[0]], b = nodes[ed[1]];
        sigPos[j * 3] = a.x + (b.x - a.x) * g.t;
        sigPos[j * 3 + 1] = a.y + (b.y - a.y) * g.t;
        sigPos[j * 3 + 2] = a.z + (b.z - a.z) * g.t;
      }
      sigGeo.attributes.position.needsUpdate = true;

      // camera flies through the layers
      var z = startZ + (endZ - startZ) * scrollCur;
      var sway = Math.sin(scrollCur * Math.PI * 2) * 2.2;
      camera.position.x += (sway + mouse.x * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.05;
      camera.position.z = z;
      camera.lookAt(camera.position.x * 0.35, camera.position.y * 0.35, z - 10);

      if (!reduceMotion) {
        group.rotation.z = Math.sin(t * 0.12) * 0.05;
        group.rotation.y = Math.sin(t * 0.09) * 0.04;
      }
      renderer.render(scene, camera);
    }

    function loop() {
      if (!running) return;
      var dt = Math.min(clock.getDelta(), 0.05);
      frame(dt, clock.elapsedTime);
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     4. Scroll, pointer and card interactions
  ------------------------------------------------------------ */
  function initInteractions() {
    var bar = $("#progress-bar");
    function onScroll() {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      scrollTarget = p;
      bar.style.transform = "scaleX(" + p + ")";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    scrollCur = scrollTarget;

    window.addEventListener("pointermove", function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // 3D tilt on project cards (skipped on touch devices)
    if (!window.matchMedia("(hover: none)").matches && !reduceMotion) {
      document.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          card.style.transform =
            "perspective(800px) rotateX(" + ((0.5 - py) * 9).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 11).toFixed(2) + "deg) translateY(-4px)";
          card.style.setProperty("--mx", (px * 100) + "%");
          card.style.setProperty("--my", (py * 100) + "%");
        });
        card.addEventListener("pointerleave", function () {
          card.style.transform = "";
        });
      });
    }

    // active nav link
    var links = {};
    document.querySelectorAll(".nav nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && links[en.target.id]) {
            Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
            links[en.target.id].classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(links).forEach(function (id) {
        var s = document.getElementById(id);
        if (s) io.observe(s);
      });
    }
  }

  /* ------------------------------------------------------------
     5. GSAP animations (content stays visible if GSAP fails to load)
  ------------------------------------------------------------ */
  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
      // just show the numbers
      document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("js-anim");

    gsap.from(".name .word", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.1 });
    gsap.from([".eyebrow", ".role", ".lead", ".hero .cta", ".scrollhint"], {
      opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.5
    });

    ScrollTrigger.batch(".reveal", {
      start: "top 90%",
      once: true,
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.09, overwrite: true });
      }
    });

    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () {
          gsap.to(o, { v: target, duration: 1.4, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
        }
      });
    });
  }

  /* ------------------------------------------------------------ */
  renderContent();
  startTyping();
  initInteractions();
  initGsap();
  initScene();
})();
