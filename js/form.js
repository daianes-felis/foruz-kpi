// ============================================================
// FORUZ KPI — form.js
// Lançamento individual de KPI por modal
// ============================================================

var _setorAtual  = 'dp';
var _kpiAtualId  = null;
var _formFile    = null;
var _formAcoes   = [];

var KPI_CONFIG = {
  dp: [
    { id:'demissoes', num:1, titulo:'Demissoes',           desc:'Quantidade orcada vs realizada no mes' },
    { id:'tmd',       num:2, titulo:'Tempo medio demissao', desc:'Ocorrencias acima de 7 dias (etapas 1 a 3)' },
    { id:'uniforme',  num:3, titulo:'Desconto de uniforme', desc:'% de rescisoes com desconto (meta 50%)' },
    { id:'folha',     num:4, titulo:'Correcoes de folha',   desc:'Ajustes na folha vs total HC ativos' },
    { id:'he',        num:5, titulo:'Horas extras ADM',     desc:'Total e distribuicao por setor' },
    { id:'mktzap',    num:6, titulo:'Atendimento MKTZAP',   desc:'Total e distribuicao por setor' }
  ],
  fin: [
    { id:'boletim',   num:1, titulo:'Correcao de boletim',        desc:'% de boletins com ajustes' },
    { id:'epi',       num:2, titulo:'Uniforme e EPI — R$',         desc:'Valor realizado vs orcado' },
    { id:'exames',    num:3, titulo:'Exames',                      desc:'Custo realizado vs orcado' },
    { id:'cartao',    num:4, titulo:'Cartao e reembolsos',          desc:'Valor realizado vs orcado' },
    { id:'contratos', num:5, titulo:'Contratos com fornecedores',  desc:'% em dia em relacao ao total' },
    { id:'certidoes', num:6, titulo:'Certidoes e licenciamentos',  desc:'% de certidoes validas' }
  ]
};

// Mapa de campo de impacto por KPI
var IMP_KEY = {
  demissoes:'dem', tmd:'tmd', uniforme:'unif', folha:'folha', he:'he', mktzap:'mkt',
  boletim:'bol', epi:'epi', exames:'exam', cartao:'cart', contratos:'cont', certidoes:'cert'
};

function selecionarSetor(s) {
  _setorAtual = s;
  document.getElementById('ftab-dp').className  = 'area-tab dp'  + (s==='dp'  ? ' on' : '');
  document.getElementById('ftab-fin').className = 'area-tab fin' + (s==='fin' ? ' on' : '');
  renderListaKpis();
}

function renderListaKpis() {
  var mes  = document.getElementById('form-mes').value;
  var kpis = KPI_CONFIG[_setorAtual];
  var cor  = _setorAtual === 'dp' ? 'var(--navy)' : 'var(--green)';
  var dbMes = _setorAtual === 'dp' ? AppState.db.dp[mes] : AppState.db.fin[mes];
  var temDados = dbMes && Object.keys(dbMes).length > 2;

  document.getElementById('form-kpi-list').innerHTML =
    '<div class="fkpi-list">' +
    kpis.map(function(k) {
      return '<div class="fkpi-item" onclick="abrirKpi(\'' + k.id + '\')">' +
        '<div class="fkpi-item-left">' +
          '<div class="fkpi-item-num" style="background:' + cor + '">' + k.num + '</div>' +
          '<div class="fkpi-item-info"><h4>' + k.titulo + '</h4><p>' + k.desc + '</p></div>' +
        '</div>' +
        '<div class="fkpi-item-right">' +
          '<span class="badge ' + (temDados?'bok':'bempty') + '">' + (temDados?'Lancado':'Sem dados') + '</span>' +
          '<button class="fkpi-edit-btn">Lancar / Editar</button>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>';
}

// ----- MODAL KPI -----
function abrirKpi(kpiId) {
  _kpiAtualId = kpiId;
  _formFile   = null;
  _formAcoes  = (AppState.acoes[kpiId] || []).map(function(a) {
    return { acao: a.acao||a.a||'', status: a.status||a.s||'Pendente' };
  });
  if (!_formAcoes.length) _formAcoes = [{ acao:'', status:'Pendente' }];

  var mes = document.getElementById('form-mes').value;
  var cfg = KPI_CONFIG[_setorAtual].find(function(k) { return k.id === kpiId; });
  var d   = _setorAtual === 'dp' ? (AppState.db.dp[mes]||null) : (AppState.db.fin[mes]||null);
  var impSalvo = d && d['imp_' + IMP_KEY[kpiId]] ? d['imp_' + IMP_KEY[kpiId]] : '';

  document.getElementById('modal-kpi-titulo').textContent = cfg.titulo;
  document.getElementById('modal-kpi-desc').textContent   = mes + '/2026 — ' + cfg.desc;
  document.getElementById('modal-kpi-msg').className      = 'cfg-msg';
  document.getElementById('modal-kpi-body').innerHTML     = buildFormHtml(kpiId, mes, d, impSalvo);
  document.getElementById('modal-kpi').classList.add('open');
}

function fecharKpi() {
  document.getElementById('modal-kpi').classList.remove('open');
  _kpiAtualId = null; _formFile = null;
}

// Constrói HTML dos campos do formulário
function buildFormHtml(id, mes, d, impSalvo) {
  var i   = MS.indexOf(mes);
  var campos = '';

  if (id === 'demissoes') {
    campos = fg([
      { l:'Orcado', id:'orc', val:ORC.dem[i], ro:true },
      { l:'Realizado', id:'real', val:d?d.dem_real:'' },
      { l:'Custo Orc R$', id:'corc', val:ORC.demC[i], ro:true },
      { l:'Custo Real R$', id:'creal', val:d?d.dem_custo:'' }
    ]);
  } else if (id === 'tmd') {
    campos = fg([
      { l:'Meta (max)', id:'meta', val:ORC.tmd[i], ro:true },
      { l:'Total demissoes', id:'tot', val:d?d.tmd_total:'' },
      { l:'Qtd acima 7 dias', id:'real', val:d?d.tmd_real:'' }
    ]);
  } else if (id === 'uniforme') {
    campos = fg([
      { l:'Meta %', id:'meta', val:ORC.unif[i], ro:true },
      { l:'Total demissoes', id:'dem', val:d?d.unif_dem:'' },
      { l:'Qtd com desconto', id:'desc', val:d?d.unif_desc:'' }
    ]);
  } else if (id === 'folha') {
    campos = fg([
      { l:'HC Total', id:'tot', val:d?d.folha_total:'' },
      { l:'Ajustes', id:'aj', val:d?d.folha_ajust:'' }
    ]);
  } else if (id === 'he') {
    campos = fg([
      { l:'Operacao (h)', id:'op', val:d?d.he_op:'' },
      { l:'ADM (h)', id:'adm', val:d?d.he_adm:'' },
      { l:'TI (h)', id:'ti', val:d?d.he_ti:'' },
      { l:'RH (h)', id:'rh', val:d?d.he_rh:'' },
      { l:'HC Equipe', id:'hc', val:d?d.he_hc:'' }
    ], true);
  } else if (id === 'mktzap') {
    campos = fg([
      { l:'Total', id:'tot', val:d?d.mkt_tot:'' },
      { l:'DP', id:'dp', val:d?d.mkt_dp:'' },
      { l:'R&S', id:'rs', val:d?d.mkt_rs:'' },
      { l:'Demais Areas', id:'out', val:d?d.mkt_demais:'' }
    ], true);
  } else if (id === 'boletim') {
    campos = fg([
      { l:'Total boletins', id:'tot', val:d?d.bol_total:'' },
      { l:'Ajustados', id:'aj', val:d?d.bol_ajust:'' }
    ]);
  } else if (id === 'epi') {
    campos = fg([
      { l:'Orcado R$', id:'orc', val:ORC.epi[i], ro:true },
      { l:'Realizado R$', id:'real', val:d?d.epi_real:'' }
    ]);
  } else if (id === 'exames') {
    campos = fg([
      { l:'Orcado R$', id:'orc', val:ORC.exam[i], ro:true },
      { l:'Realizado R$', id:'real', val:d?d.exam_real:'' }
    ]);
  } else if (id === 'cartao') {
    campos = fg([
      { l:'Orcado R$', id:'orc', val:ORC.cart[i], ro:true },
      { l:'Realizado R$', id:'real', val:d?d.cart_real:'' }
    ]);
  } else if (id === 'contratos') {
    campos = fg([
      { l:'Total contratos', id:'tot', val:d?d.cont_total:'' },
      { l:'Pendentes', id:'venc', val:d?d.cont_venc:'' }
    ]);
  } else if (id === 'certidoes') {
    campos = fg([
      { l:'Total', id:'tot', val:d?d.cert_total:'' },
      { l:'Validas', id:'ok', val:d?d.cert_ok:'' },
      { l:'Vencidas', id:'venc', val:d?d.cert_venc:'' }
    ]);
  }

  return campos +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">' +
      '<div>' +
        '<label class="fi-label">Principais impactos</label>' +
        '<textarea id="kf-imp" placeholder="Descreva os principais impactos...">' + (impSalvo||'') + '</textarea>' +
      '</div>' +
      '<div>' +
        '<label class="fi-label">Plano de acao</label>' +
        '<div style="border:1px solid var(--border);border-radius:8px;padding:8px;background:var(--bg)">' +
          '<div id="kf-acoes-list">' + buildAcoesHtml() + '</div>' +
          '<button type="button" class="btn-add-acao" onclick="addFormAcao()">+ Adicionar acao</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:12px">' +
      '<label class="fi-label">Evidencia (opcional)</label>' +
      '<div class="upload-area" id="kf-upload" ondragover="event.preventDefault()" ' +
           'ondrop="event.preventDefault();kfArquivo(event.dataTransfer.files[0])" ' +
           'onclick="document.getElementById(\'kf-file\').click()">' +
        '<input type="file" id="kf-file" style="display:none" onchange="kfArquivo(this.files[0])">' +
        '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" ' +
             'style="width:20px;height:20px;margin:0 auto;display:block;color:var(--text3)">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>' +
        '</svg>' +
        '<p style="font-size:11px;color:var(--text2);text-align:center;margin-top:4px">Clique ou arraste</p>' +
      '</div>' +
      '<div id="kf-preview" style="display:none"></div>' +
    '</div>';
}

function fg(fields, small) {
  var cols = small ? 'repeat(auto-fit,minmax(110px,1fr))' : 'repeat(auto-fit,minmax(150px,1fr))';
  return '<div style="display:grid;grid-template-columns:' + cols + ';gap:10px">' +
    fields.map(function(f) {
      var v   = f.val !== null && f.val !== undefined && f.val !== '' ? f.val : '';
      var cls = f.ro ? ' class="orc"' : '';
      var ro  = f.ro ? ' readonly' : '';
      return '<div class="fi"><label>' + f.l + (f.ro ? '<span class="ba">auto</span>' : '') + '</label>' +
        '<input type="' + (f.ro?'text':'number') + '" id="kf-' + f.id + '" value="' + v + '"' + cls + ro + '></div>';
    }).join('') +
    '</div>';
}

function gv(id) {
  var el = document.getElementById('kf-' + id);
  return el ? el.value : '';
}

function buildAcoesHtml() {
  return _formAcoes.map(function(a, i) {
    var st  = a.status || 'Pendente';
    var cls = st==='Pendente'?'st-pendente':st==='Andamento'?'st-andamento':'st-concluido';
    return '<div class="acao-step-row">' +
      '<input type="text" id="kfa-' + i + '" value="' + a.acao.replace(/"/g,'&quot;') + '" ' +
             'oninput="_formAcoes[' + i + '].acao=this.value">' +
      '<select id="kfas-' + i + '" class="' + cls + '" ' +
              'onchange="_formAcoes[' + i + '].status=this.value;atualizarCorStatus(this)">' +
        '<option' + (st==='Pendente'  ?' selected':'') + '>Pendente</option>'  +
        '<option' + (st==='Andamento' ?' selected':'') + '>Andamento</option>' +
        '<option' + (st==='Concluido' ?' selected':'') + '>Concluido</option>' +
      '</select>' +
      '<button type="button" class="acao-step-del" onclick="remFormAcao(' + i + ')">x</button>' +
    '</div>';
  }).join('');
}

function addFormAcao() {
  _formAcoes.push({ acao:'', status:'Pendente' });
  document.getElementById('kf-acoes-list').innerHTML = buildAcoesHtml();
}

function remFormAcao(i) {
  _formAcoes.splice(i, 1);
  if (!_formAcoes.length) _formAcoes = [{ acao:'', status:'Pendente' }];
  document.getElementById('kf-acoes-list').innerHTML = buildAcoesHtml();
}

function kfArquivo(file) {
  if (!file) return;
  _formFile = file;
  var kb  = Math.round(file.size / 1024);
  var sz  = kb > 1024 ? (kb/1024).toFixed(1)+' MB' : kb+' KB';
  var prev = document.getElementById('kf-preview');
  prev.style.display = 'block';
  prev.innerHTML = '<div class="upload-preview">' +
    '<span class="up-name">' + file.name + '</span>' +
    '<span class="up-size">' + sz + '</span>' +
    '<button class="up-remove" onclick="_formFile=null;document.getElementById(\'kf-preview\').style.display=\'none\'">x</button>' +
    '</div>';
}

// ----- SALVAR KPI -----
async function salvarKpi() {
  var mes = document.getElementById('form-mes').value;
  var i   = MS.indexOf(mes);
  var btn = document.getElementById('modal-kpi-salvar');
  var msg = document.getElementById('modal-kpi-msg');
  var an  = AppState.usuario || 'Analista';
  var now = new Date();
  var ts  = mes + '/2026 - ' + now.getDate() + '/' + (now.getMonth()+1) + ' ' +
            now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');

  msg.className = 'cfg-msg'; btn.textContent = 'Salvando...'; btn.disabled = true;

  // Coletar ações
  var acoesFinal = _formAcoes.filter(function(a) { return a.acao.trim(); });

  var imp    = gv('imp') || '';
  var anexo  = _formFile ? await uploadFileToSheets(_formFile, mes, _setorAtual.toUpperCase()) : null;
  var impKey = 'imp_' + IMP_KEY[_kpiAtualId];

  var existente = _setorAtual === 'dp'
    ? (AppState.db.dp[mes] || {})
    : (AppState.db.fin[mes] || {});

  var dados = Object.assign({}, existente);
  dados.analista = an; dados.ts = ts;
  if (imp)   dados[impKey]     = imp;
  if (anexo) { dados.anexo_nome = anexo.nome; dados.anexo_url = anexo.url; }

  // Campos específicos do KPI
  var mapa = {
    demissoes: { orc_dem:ORC.dem[i], dem_real:+gv('real')||null, orc_demC:ORC.demC[i], dem_custo:+gv('creal')||null },
    tmd:       { tmd_meta:ORC.tmd[i], tmd_total:+gv('tot')||null, tmd_real:+gv('real')||null },
    uniforme:  { unif_meta:ORC.unif[i], unif_dem:+gv('dem')||null, unif_desc:+gv('desc')||null },
    folha:     { folha_total:+gv('tot')||null, folha_ajust:+gv('aj')||null },
    he:        { he_op:+gv('op')||0, he_adm:+gv('adm')||0, he_ti:+gv('ti')||0, he_rh:+gv('rh')||0, he_hc:+gv('hc')||19 },
    mktzap:    { mkt_tot:+gv('tot')||null, mkt_dp:+gv('dp')||0, mkt_rs:+gv('rs')||0, mkt_demais:+gv('out')||0 },
    boletim:   { bol_total:+gv('tot')||null, bol_ajust:+gv('aj')||null },
    epi:       { orc_epi:ORC.epi[i], epi_real:+gv('real')||null },
    exames:    { orc_exam:ORC.exam[i], exam_real:+gv('real')||null },
    cartao:    { orc_cart:ORC.cart[i], cart_real:+gv('real')||null },
    contratos: { cont_total:+gv('tot')||null, cont_venc:+gv('venc')||0 },
    certidoes: { cert_total:+gv('tot')||null, cert_ok:+gv('ok')||null, cert_venc:+gv('venc')||0 }
  };

  Object.assign(dados, mapa[_kpiAtualId] || {});

  if (_setorAtual === 'dp') {
    AppState.db.dp[mes] = dados;
    await sendDP(mes, dados);
  } else {
    AppState.db.fin[mes] = dados;
    await sendFin(mes, dados);
  }

  // Salvar ações
  if (acoesFinal.length) {
    AppState.acoes[_kpiAtualId] = acoesFinal;
    try { await apiGet('save_acoes', { kpi: _kpiAtualId, acoes: JSON.stringify(acoesFinal) }); } catch(e) {}
  }

  localStorage.setItem('foruz-bkp', JSON.stringify(AppState.db));
  toast('Salvo com sucesso!');
  fecharKpi();
  renderListaKpis();
  renderPainel();

  btn.textContent = 'Salvar'; btn.disabled = false;
}
