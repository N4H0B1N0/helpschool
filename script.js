/* Help School — protótipo funcional (sem back-end; dados no localStorage) */
const $ = (s) => document.querySelector(s);
const KEY = "helpschool:v1";

// ---------- Estado persistido ----------
function carregar() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { inscritos: {}, certificados: {} }; }
  catch { return { inscritos: {}, certificados: {} }; }
}
let estado = carregar();
const salvar = () => localStorage.setItem(KEY, JSON.stringify(estado));
const curso = (id) => CURSOS.find((c) => c.id === id);
let cursoAtual = null, aulaAtual = 0;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.remove("oculto");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add("oculto"), 2500);
}
function pct(id) {
  const ins = estado.inscritos[id]; if (!ins) return 0;
  return Math.round((ins.concluidas.length / curso(id).aulas.length) * 100);
}

// ---------- Navegação ----------
function ir(view) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("oculto"));
  $("#view-" + view).classList.remove("oculto");
  const aba = view === "curso" ? "meus" : view;
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("ativo", b.dataset.view === aba));
  if (view === "catalogo") renderCatalogo();
  if (view === "meus") renderMeus();
}
document.querySelectorAll(".nav-btn").forEach((b) => b.addEventListener("click", () => ir(b.dataset.view)));
$("#voltar-meus").addEventListener("click", () => ir("meus"));

/* =====================================================
   FUNCIONALIDADE 1 — Catálogo e inscrição em 1 clique (RF01)
   ===================================================== */
[...new Set(CURSOS.map((c) => c.categoria))].forEach((cat) => {
  const o = document.createElement("option"); o.value = o.textContent = cat; $("#categoria").appendChild(o);
});
function renderCatalogo() {
  const q = $("#busca").value.toLowerCase().trim(), cat = $("#categoria").value;
  const lista = CURSOS.filter((c) => (!cat || c.categoria === cat) &&
    (c.titulo + " " + c.descricao).toLowerCase().includes(q));
  $("#lista-cursos").innerHTML = lista.length ? lista.map((c) => `
    <div class="card">
      <span class="tag">${c.categoria}</span>
      <h3>${c.titulo}</h3><p>${c.descricao}</p>
      <div class="meta">${c.aulas.length} aulas · ${c.horas}h</div>
      ${estado.inscritos[c.id]
        ? `<span class="inscrito">✔ Inscrito</span><button data-abrir="${c.id}">Continuar</button>`
        : `<button data-insc="${c.id}">Inscrever-se</button>`}
    </div>`).join("") : "<p>Nenhum curso encontrado.</p>";
}
$("#busca").addEventListener("input", renderCatalogo);
$("#categoria").addEventListener("change", renderCatalogo);
$("#lista-cursos").addEventListener("click", (e) => {
  const i = e.target.dataset.insc, a = e.target.dataset.abrir;
  if (i) {
    estado.inscritos[i] = { concluidas: [], nota: null };
    salvar(); renderCatalogo(); toast("Inscrição realizada!");
  }
  if (a) abrirCurso(a);
});

/* =====================================================
   FUNCIONALIDADE 2 — Aulas com progresso automático (RF02 + RF03)
   ===================================================== */
function renderMeus() {
  const ids = Object.keys(estado.inscritos);
  $("#lista-meus").innerHTML = ids.length ? ids.map((id) => {
    const c = curso(id), p = pct(id);
    return `<div class="card"><span class="tag">${c.categoria}</span><h3>${c.titulo}</h3>
      <div class="mini"><div style="width:${p}%"></div></div>
      <div class="meta">${p}% concluído${estado.certificados[id] ? " · 🏅 Certificado emitido" : ""}</div>
      <button data-abrir="${id}">${p ? "Continuar" : "Começar"}</button></div>`;
  }).join("") : "<p>Você ainda não se inscreveu em nenhum curso. Vá ao Catálogo.</p>";
}
$("#lista-meus").addEventListener("click", (e) => { if (e.target.dataset.abrir) abrirCurso(e.target.dataset.abrir); });

function abrirCurso(id) {
  cursoAtual = id;
  const c = curso(id), ins = estado.inscritos[id];
  aulaAtual = Math.min(ins.concluidas.length, c.aulas.length - 1); // retoma de onde parou
  ir("curso"); $("#curso-titulo").textContent = c.titulo;
  renderCurso();
}
function renderCurso() {
  const c = curso(cursoAtual), ins = estado.inscritos[cursoAtual], a = c.aulas[aulaAtual];
  $("#lista-aulas").innerHTML = c.aulas.map((x, i) => `
    <div class="item-aula ${i === aulaAtual ? "atual" : ""} ${ins.concluidas.includes(i) ? "feita" : ""}" data-i="${i}">
      <span class="ck">${ins.concluidas.includes(i) ? "✓" : ""}</span>${i + 1}. ${x.titulo}</div>`).join("");
  $("#aula-titulo").textContent = `Aula ${aulaAtual + 1}: ${a.titulo}`;
  $("#aula-corpo").textContent = a.texto;
  $("#btn-anterior").disabled = aulaAtual === 0;
  $("#btn-proxima").textContent = aulaAtual === c.aulas.length - 1 ? "Concluir curso ✓" : "Concluir e próxima →";
  const p = pct(cursoAtual);
  $("#barra-progresso").style.width = p + "%"; $("#pct-progresso").textContent = p + "%";
  renderFinal();
}
$("#lista-aulas").addEventListener("click", (e) => {
  const el = e.target.closest(".item-aula"); if (el) { aulaAtual = +el.dataset.i; renderCurso(); }
});
$("#btn-anterior").addEventListener("click", () => { aulaAtual--; renderCurso(); });
$("#btn-proxima").addEventListener("click", () => {
  const c = curso(cursoAtual), ins = estado.inscritos[cursoAtual];
  if (!ins.concluidas.includes(aulaAtual)) ins.concluidas.push(aulaAtual); // marcação automática
  salvar();
  if (aulaAtual < c.aulas.length - 1) aulaAtual++;
  else toast("Todas as aulas concluídas! Faça a avaliação final.");
  renderCurso();
});

/* =====================================================
   FUNCIONALIDADE 3 — Quiz com correção automática e certificado com hash (RF04 + RF05)
   ===================================================== */
function renderFinal() {
  const c = curso(cursoAtual), ins = estado.inscritos[cursoAtual];
  const liberado = ins.concluidas.length === c.aulas.length;
  $("#area-final").classList.toggle("oculto", !liberado);
  if (!liberado) return;
  $("#quiz-info").textContent = `Nota mínima para aprovação: ${NOTA_MINIMA}%.` +
    (ins.nota !== null ? ` Sua melhor nota: ${ins.nota}%.` : "");
  $("#quiz-form").innerHTML = c.quiz.map((q, i) => `
    <fieldset class="pergunta" data-q="${i}"><legend>${i + 1}. ${q.p}</legend>
      ${q.o.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}
    </fieldset>`).join("");
  $("#quiz-resultado").innerHTML = "";
  if (estado.certificados[cursoAtual]) mostrarBotaoCertificado();
}
$("#btn-corrigir").addEventListener("click", async () => {
  const c = curso(cursoAtual), ins = estado.inscritos[cursoAtual];
  if (!c.quiz.every((_, i) => document.querySelector(`input[name=q${i}]:checked`))) {
    toast("Responda todas as perguntas."); return;
  }
  let acertos = 0;
  c.quiz.forEach((q, i) => {
    const r = document.querySelector(`input[name=q${i}]:checked`);
    const ok = r && +r.value === q.c; if (ok) acertos++;
    document.querySelector(`[data-q="${i}"]`).className = "pergunta " + (ok ? "certa" : "errada");
  });
  const nota = Math.round((acertos / c.quiz.length) * 100);
  ins.nota = Math.max(ins.nota ?? 0, nota); salvar();
  const box = $("#quiz-resultado");
  if (nota >= NOTA_MINIMA) {
    box.innerHTML = `<div class="resultado ok">Aprovado! Nota: ${nota}% (${acertos}/${c.quiz.length}). Certificado liberado.</div>`;
    if (!estado.certificados[cursoAtual]) await emitirCertificado(c);
    mostrarBotaoCertificado();
  } else {
    box.innerHTML = `<div class="resultado erro">Nota: ${nota}% — abaixo do mínimo (${NOTA_MINIMA}%). Revise e tente novamente.</div>`;
  }
});

async function sha256(txt) {
  if (crypto && crypto.subtle) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  let h = 0; for (const ch of txt) h = (h * 31 + ch.charCodeAt(0)) >>> 0; // fallback simples
  return h.toString(16).padStart(8, "0").repeat(8);
}
async function emitirCertificado(c) {
  let nome = "";
  while (!nome) nome = (prompt("Digite seu nome completo para o certificado:") || "").trim();
  const data = new Date().toLocaleDateString("pt-BR");
  const seed = `${nome}|${c.id}|${c.horas}|${Date.now()}|${Math.random()}`;
  const hash = "HS-" + (await sha256(seed)).slice(0, 16).toUpperCase();
  estado.certificados[c.id] = { nome, curso: c.titulo, horas: c.horas, data, nota: estado.inscritos[c.id].nota, hash };
  salvar();
}
function mostrarBotaoCertificado() {
  $("#quiz-resultado").innerHTML += `<p><button id="btn-ver-cert">🏅 Ver certificado</button></p>`;
  $("#btn-ver-cert").onclick = () => abrirCertificado(cursoAtual);
}
function qrSvg(texto) {
  if (typeof qrcode === "undefined") return "";
  const q = qrcode(0, "M"); q.addData(texto); q.make(); return q.createSvgTag(3, 0);
}
function abrirCertificado(id) {
  const ct = estado.certificados[id];
  const url = location.href.split("#")[0].split("?")[0] + "?verificar=" + ct.hash;
  $("#certificado").innerHTML = `
    <div class="cert">
      <h2>CERTIFICADO</h2><div>A Help School certifica que</div>
      <div class="nome">${ct.nome}</div>
      <div>concluiu o curso <b>${ct.curso}</b> com carga horária de <b>${ct.horas} horas</b>,<br>
      com aproveitamento de <b>${ct.nota}%</b>, em ${ct.data}.</div>
      <div class="rodape">
        <div class="qr">${qrSvg(url)}</div>
        <div>Código de verificação:<div class="hash">${ct.hash}</div><div>Valide na aba “Verificar certificado”.</div></div>
        <div class="assin">Help School</div>
      </div>
    </div>`;
  $("#modal").classList.remove("oculto");
  $("#btn-linkedin").onclick = () => {
    const d = new Date();
    window.open("https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=" +
      encodeURIComponent(ct.curso) + "&organizationName=" + encodeURIComponent("Help School") +
      "&issueYear=" + d.getFullYear() + "&issueMonth=" + (d.getMonth() + 1) +
      "&certId=" + ct.hash + "&certUrl=" + encodeURIComponent(url), "_blank");
  };
}
$("#btn-imprimir").addEventListener("click", () => window.print());
$("#btn-fechar").addEventListener("click", () => $("#modal").classList.add("oculto"));

// Verificação pública por código
function verificar(codigo) {
  codigo = codigo.trim().toUpperCase();
  const ct = Object.values(estado.certificados).find((x) => x.hash === codigo);
  $("#verificar-resultado").innerHTML = ct
    ? `<div class="resultado ok">✔ Certificado AUTÊNTICO<br>${ct.nome} — ${ct.curso} (${ct.horas}h), emitido em ${ct.data}.</div>`
    : `<div class="resultado erro">✘ Código não encontrado. Certificado inválido.</div>`;
}
$("#btn-verificar").addEventListener("click", () => verificar($("#hash-input").value));

// Abre direto na verificação se vier do QR Code (?verificar=HS-...)
const pv = new URLSearchParams(location.search).get("verificar");
if (pv) { ir("verificar"); $("#hash-input").value = pv; verificar(pv); } else ir("catalogo");
