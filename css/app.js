// ============================================================
// FORUZ KPI — app.js
// Navegação, sincronização com Sheets e inicialização
// ============================================================

// ----- SYNC -----
function setSync(s) {
  var dot = document.getElementById('sdot');
  var txt = document.getElementById('sstatus');
  if (s === 'ok')   { dot.className = 'dot';      txt.textContent = 'Conectado ao Google Sheets'; }
  if (s === 'err')  { dot.className = 'dot err';  txt.textContent = 'Sem conexao'; }
  if (s === 'load') { dot.className = 'dot load'; txt.textContent = 'Sincronizando...'; }
}

async function syncDados() {
  setSync('load');
  try {
    var j = await apiGet('get');
    if (j.ok && j.data) {
      Object.keys(j.data.dp  || {}).forEach(function(m) { if (Object.keys(j.data.dp[m]).length>2)  AppState.db.dp[m]  = j.data.dp[m];  });
      Object.keys(j.data.fin || {}).forEach(function(m) { if (Object.keys(j.data.fin[m]).length>2) AppState.db.fin[m] = j.data.fin[m]; });
      localStorage.setItem('foruz-bkp', JSON.stringify(AppState.db));
      setSync('ok');
      toast('Dados atualizados!');
    } else { setSync('err'); }
  } catch(e) { setSync('err'); }
  renderPainel();
}

// ----- CONFIGURAÇÃO -----
function abrirCfg() {
  document.getElementById('cfg-overlay').classList.add('open');
  document.getElementById('surl').value = AppState.url;
  document.getElementById('cfg-msg').className = 'cfg-msg';
}
function fecharCfg() { document.getElementById('cfg-overlay').classList.remove('open'); }

function cfgMsg(msg, tipo) {
  var el = document.getElementById('cfg-msg');
  el.textContent = msg; el.className = 'cfg-msg ' + tipo;
}

async function testarConexao() {
  var u = document.getElementById('surl').value.trim();
  if (!u) { cfgMsg('Cole o URL primeiro.', 'err'); return; }
  cfgMsg('Testando...', 'info');
  try {
    var j = await fetch(u + '?action=ping').then(function(r) { return r.json(); });
    if (j.ok) cfgMsg('Conexao OK! Clique em Salvar.', 'ok');
    else cfgMsg('Resposta inesperada.', 'err');
  } catch(e) { cfgMsg('Erro: ' + e.message, 'err'); }
}

async function salvarCfg() {
  var u = document.getElementById('surl').value.trim();
  if (!u || !u.includes('script.google.com')) { cfgMsg('URL invalido.', 'err'); return; }
  AppState.url = u;
  cfgMsg('Configurando planilha...', 'info');
  try {
    await fetch(u + '?action=init');
    // Enviar histórico Jan/Fev
    await fetch(u + '?action=set_dp&mes=Janeiro&dados='  + encodeURIComponent(JSON.stringify(H_DP[0])));
    await fetch(u + '?action=set_dp&mes=Fevereiro&dados='+ encodeURIComponent(JSON.stringify(H_DP[1])));
    await fetch(u + '?action=set_fin&mes=Janeiro&dados=' + encodeURIComponent(JSON.stringify(H_FIN[0])));
    await fetch(u + '?action=set_fin&mes=Fevereiro&dados='+ encodeURIComponent(JSON.stringify(H_FIN[1])));
    cfgMsg('Configurado! Jan/Fev enviados.', 'ok');
    setSync('ok');
    fecharCfg();
    syncDados();
  } catch(e) { cfgMsg('Erro: ' + e.message, 'err'); }
}

// ----- NAVEGAÇÃO -----
function navPg(id, el) {
  document.querySelectorAll('.pg').forEach(function(p) { p.classList.remove('on'); });
  document.querySelectorAll('.nav-tab, .sb-icon').forEach(function(t) { t.classList.remove('on'); });
  document.getElementById('pg-' + id).classList.add('on');
  if (el) el.classList.add('on');
  document.querySelectorAll('.nav-tab').forEach(function(t) {
    var txt = t.textContent.toLowerCase();
    if ((id==='painel' && txt.includes('painel')) ||
        (id==='form'   && txt.includes('lancar')) ||
        (id==='admin'  && txt.includes('usuario'))) t.classList.add('on');
  });
  var si = document.getElementById('si-' + id);
  if (si) si.classList.add('on');

  if (id === 'painel') renderPainel();
  if (id === 'form')   renderListaKpis();
  if (id === 'admin')  carregarUsuarios();
}

function irPainel() { navPg('painel', null); }

// ----- INICIALIZAÇÃO -----
function appInit() {
  syncDados();
  carregarAcoes();
}

// Ponto de entrada
(function() {
  if (verificarSessao()) {
    appInit();
  }
  // Se não tiver sessão, a tela de login fica visível aguardando
})();
