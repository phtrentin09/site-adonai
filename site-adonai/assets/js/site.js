(function(){
  var WA = "554130187798";
  var d = document;

  // menu
  var btn = d.querySelector(".menu-btn"), nav = d.querySelector(".nav");
  if (btn && nav) {
    btn.addEventListener("click", function(){
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Fechar" : "Menu";
    });
    nav.addEventListener("click", function(e){
      if (e.target.closest("a")) { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded","false"); btn.textContent = "Menu"; }
    });
  }

  // borda do cabeçalho
  var top = d.querySelector(".top");
  function onScroll(){ if (top) top.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // revelar
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, {rootMargin:"0px 0px -8% 0px"}) : null;
  function watch(root){
    (root || d).querySelectorAll(".reveal:not(.is-in)").forEach(function(el){ io ? io.observe(el) : el.classList.add("is-in"); });
  }
  watch();

  // mapa sob demanda
  d.addEventListener("click", function(e){
    var b = e.target.closest("[data-map]");
    if (!b) return;
    var box = b.closest(".map-box");
    box.innerHTML = '<iframe title="Mapa da Casa de Repouso Adonai" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + encodeURIComponent("Rua Conde de São João das Duas Barras, 1955, Boqueirão, Curitiba PR") + '&output=embed"></iframe>';
  });

  // formulários que abrem o WhatsApp
  d.addEventListener("submit", function(e){
    var f = e.target.closest("form[data-wa]");
    if (!f) return;
    e.preventDefault();
    var v = function(n){ var el = f.elements[n]; return el ? el.value.trim() : ""; };
    var txt;
    if (f.dataset.wa === "visita") {
      txt = "Olá! Meu nome é " + v("nome") + " e gostaria de agendar uma visita na Adonai.";
      if (v("para")) txt += " A vaga seria para " + v("para") + ".";
      if (v("modalidade") && v("modalidade") !== "Ainda não sei") txt += " Tenho interesse em: " + v("modalidade").toLowerCase() + ".";
    } else if (f.dataset.wa === "trabalhe") {
      txt = "Olá! Meu nome é " + v("nome") + " e gostaria de trabalhar na Adonai como " + v("funcao").toLowerCase() + ". Vou mandar meu currículo aqui na conversa.";
    } else {
      txt = "Olá! Meu nome é " + v("nome") + ". " + v("mensagem");
    }
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(txt), "_blank", "noopener");
  });

  // modo revisão: páginas por hash
  var pages = d.querySelectorAll("[data-page]");
  if (pages.length) {
    var show = function(){
      var id = (location.hash || "#inicio").slice(1) || "inicio";
      var found = d.querySelector('[data-page="' + id + '"]') ? id : "inicio";
      pages.forEach(function(p){ p.hidden = p.getAttribute("data-page") !== found; });
      d.querySelectorAll(".nav a[href^='#']").forEach(function(a){
        var r = a.getAttribute("href").slice(1);
        if (r === found || found.indexOf(r + "--") === 0) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
      });
      window.scrollTo(0,0);
      watch(d.querySelector('[data-page="' + found + '"]'));
    };
    window.addEventListener("hashchange", show); show();
  }
})();
