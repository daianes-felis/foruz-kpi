// ============================================================
// FORUZ KPI — painel.js
// Dashboard: cálculo, renderização e detalhes dos KPIs
// ============================================================

var _chartAtivo  = null;
var _kpiAberto   = null;

var COR_STATUS = { ok:'#16a34a', warn:'#d97706', bad:'#dc2626', info:'#2563eb', empty:'#9ca3af' };
var BADGE = {
  ok:    ['bok',   'Em meta'],
  warn:  ['bwarn', 'Atencao'],
  bad:   ['bbad',  'Fora da meta'],
  info:  ['binfo', 'Monitorando'],
  empty: ['bempty','Sem dados']
};

// ----- CÁLCULO DOS KPIs -----
function calcularKPIs(mes) {
  var dp  = AppState.db.dp[mes]  || null;
  var fin = AppState.db.fin[mes] || null;
  var kpis = [];

  if (dp) {
    var dP = dp.orc_dem ? (dp.dem_real / dp.orc_dem) * 100 : null;
    kpis.push({ id:'demissoes', area:'dp',
      nome:'Demissoes', fmt:dp.dem_real||'-',
      sub:dp.dem_real+' / meta '+dp.orc_dem,
      st: dP ? (dP<=100?'ok':dP<=115?'warn':'bad') : 'empty',
      bar: dP ? (dP<=100?90:dP<=115?65:35) : 20,
      jan: H_DP[0].dem_real, fev: H_DP[1].dem_real, meta: dp.orc_dem, dp: dp });

    var tC = dp.tmd_real <= dp.tmd_meta ? 'ok' : dp.tmd_real <= dp.tmd_meta*1.5 ? 'warn' : 'bad';
    kpis.push({ id:'tmd', area:'dp',
      nome:'Tempo medio demissao', fmt:dp.tmd_real+' ocorr.',
      sub:'meta: <='+dp.tmd_meta, st:tC,
      bar: tC==='ok'?90:tC==='warn'?60:35,
      jan:H_DP[0].tmd_real, fev:H_DP[1].tmd_real, meta:dp.tmd_meta, dp:dp });

    var uP = dp.unif_dem ? (dp.unif_desc/dp.unif_dem)*100 : 0;
    var uC = uP>=dp.unif_meta?'ok':uP>=dp.unif_meta*0.5?'warn':'bad';
    kpis.push({ id:'uniforme', area:'dp',
      nome:'Desconto uniforme', fmt:uP.toFixed(1)+'%',
      sub:'meta: '+dp.unif_meta+'%', st:uC,
      bar:Math.min(100,Math.max(5,(uP/dp.unif_meta)*100)),
      jan:((H_DP[0].unif_desc/H_DP[0].unif_dem)*100).toFixed(1)+'%',
      fev:((H_DP[1].unif_desc/H_DP[1].unif_dem)*100).toFixed(1)+'%',
      meta:dp.unif_meta+'%', dp:dp });

    var fP = dp.folha_total ? (dp.folha_ajust/dp.folha_total)*100 : 0;
    var fC = fP<=1?'ok':fP<=3?'warn':'bad';
    kpis.push({ id:'folha', area:'dp',
      nome:'Correcoes folha', fmt:fP.toFixed(2)+'%',
      sub:dp.folha_ajust+' de '+dp.folha_total+' HC', st:fC,
      bar:fC==='ok'?90:fC==='warn'?60:35,
      jan:H_DP[0].folha_ajust, fev:H_DP[1].folha_ajust, meta:'<=1%', dp:dp });

    var hT = (+dp.he_op||0)+(+dp.he_adm||0)+(+dp.he_ti||0)+(+dp.he_rh||0);
    kpis.push({ id:'he', area:'dp',
      nome:'Horas extras ADM', fmt:hT.toFixed(1)+'h',
      sub:'total acumulado', st:'info', bar:60,
      jan:(+H_DP[0].he_op||0)+(+H_DP[0].he_adm||0)+(+H_DP[0].he_ti||0),
      fev:(+H_DP[1].he_op||0)+(+H_DP[1].he_adm||0)+(+H_DP[1].he_ti||0),
      meta:null, dp:dp });

    kpis.push({ id:'mktzap', area:'dp',
      nome:'Atendimento MKTZAP', fmt:(dp.mkt_tot||'-')+' atend.',
      sub:'total do mes', st:'info', bar:60,
      jan:H_DP[0].mkt_tot, fev:H_DP[1].mkt_tot, meta:null, dp:dp });
  }

  if (fin) {
    var bP = fin.bol_total ? (fin.bol_ajust/fin.bol_total)*100 : 0;
    var bC = bP<=10?'ok':bP<=20?'warn':'bad';
    kpis.push({ id:'boletim', area:'fin',
      nome:'Correcao boletim', fmt:bP.toFixed(1)+'%',
      sub:fin.bol_ajust+' de '+fin.bol_total, st:bC,
      bar:bC==='ok'?90:bC==='warn'?60:35,
      jan:H_FIN[0].bol_ajust, fev:H_FIN[1].bol_ajust, meta:'<=10%', dp:fin });

    var eP = fin.orc_epi ? (fin.epi_real/fin.orc_epi)*100 : null;
    var eC = eP ? (eP<=105?'ok':eP<=130?'warn':'bad') : 'empty';
    kpis.push({ id:'epi', area:'fin',
      nome:'Uniforme e EPI', fmt:eP?eP.toFixed(1)+'%':'-',
      sub:fmtR(fin.epi_real||0), st:eC,
      bar:eC==='ok'?90:eC==='warn'?60:35,
      jan:H_FIN[0].epi_real, fev:H_FIN[1].epi_real, meta:'100%', dp:fin });

    var xP = fin.orc_exam ? (fin.exam_real/fin.orc_exam)*100 : null;
    var xC = xP ? (xP<=105?'ok':xP<=125?'warn':'bad') : 'empty';
    kpis.push({ id:'exames', area:'fin',
      nome:'Exames', fmt:xP?xP.toFixed(1)+'%':'-',
      sub:fmtR(fin.exam_real||0), st:xC,
      bar:xC==='ok'?90:xC==='warn'?60:35,
      jan:H_FIN[0].exam_real, fev:H_FIN[1].exam_real, meta:'100%', dp:fin });

    var cP = fin.orc_cart ? (fin.cart_real/fin.orc_cart)*100 : null;
    var cC = cP ? (cP<=105?'ok':cP<=125?'warn':'bad') : 'empty';
    kpis.push({ id:'cartao', area:'fin',
      nome:'Cartao e reembolsos', fmt:cP?cP.toFixed(1)+'%':'-',
      sub:fmtR(fin.cart_real||0), st:cC,
      bar:cC==='ok'?90:cC==='warn'?60:35,
      jan:H_FIN[0].cart_real, fev:H_FIN[1].cart_real, meta:'100%', dp:fin });

    var coP = fin.cont_total ? ((fin.cont_total-fin.cont_venc)/fin.cont_total)*100 : null;
    var coC = coP ? (coP>=100?'ok':coP>=90?'warn':'bad') : 'empty';
    kpis.push({ id:'contratos', area:'fin',
      nome:'Contratos fornecedores', fmt:coP?coP.toFixed(1)+'%':'-',
      sub:(fin.cont_total-fin.cont_venc)+' de '+fin.cont_total+' em dia', st:coC,
      bar:coC==='ok'?90:coC==='warn'?60:35,
      jan:H_FIN[0].cont_total-H_FIN[0].cont_venc,
      fev:H_FIN[1].cont_total-H_FIN[1].cont_venc, meta:'100%', dp:fin });

    var ceP = fin.cert_total ? (fin.cert_ok/fin.cert_total)*100 : null;
    var ceC = ceP ? (ceP>=100?'ok':ceP>=80?'warn':'bad') : 'empty';
    kpis.push({ id:'certidoes', area:'fin',
      nome:'Certidoes e licenciamentos', fmt:ceP?ceP.toFixed(1)+'%':'-',
      sub:fin.cert_ok+' de '+fin.cert_total+' validas', st:ceC,
      bar:ceC==='ok'?90:ceC==='warn'?60:35,
      jan:H_FIN[0].cert_ok, fev:H_FIN[1].cert_ok, meta:'100%', dp:fin });
  }

  return kpis;
}

// ----- RENDERIZAÇÃO DO PAINEL -----
function renderPainel() {
  var mes  = document.getElementById('pmes').value;
  var area = document.getElementById('parea').value;
  var kpis = calcularKPIs(mes).filter(function(k) { return area === 'all' || k.area === area; });

  var ok=0, w=0, bad=0, info=0;
  kpis.forEach(function(k) {
    if (k.st==='ok') ok++; else if (k.st==='warn') w++;
    else if (k.st==='bad') bad++; else if (k.st==='info') info++;
  });

  document.getElementById('summ').innerHTML =
    sc('c-ok', ok, 'Em meta') + sc('c-warn', w, 'Atencao') +
    sc('c-bad', bad, 'Fora da meta') + sc('c-info', info, 'Monitorando');

  var ts = (AppState.db.dp[mes] || AppState.db.fin[mes] || {}).ts;
  document.getElementById('lupd').textContent = ts ? 'Atualizado: ' + ts : '';

  // Fechar detalhe aberto
  _kpiAberto = null;
  if (_chartAtivo) { _chartAtivo.destroy(); _chartAtivo = null; }

  var tbody = document.getElementById('kpi-body');
  if (!kpis.length) {
    tbody.innerHTML = '';
    document.getElementById('nodata').style.display = '';
    return;
  }
  document.getElementById('nodata').style.display = 'none';

  tbody.innerHTML = kpis.map(function(k) {
    var b = BADGE[k.st];
    var anexoIcon = k.dp && k.dp.anexo_url
      ? '<a href="' + k.dp.anexo_url + '" target="_blank" onclick="event.stopPropagation()" title="' + (k.dp.anexo_nome||'') + '" style="color:var(--navy)">' +
        '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32"/></svg></a>'
      : '<span style="color:var(--text3)">-</span>';

    return '<tr class="kpi-row" id="krow-' + k.id + '" onclick="toggleDetalhe(\'' + k.id + '\')">' +
      '<td><span class="atag ' + (k.area==='dp'?'tdp':'tfin') + '">' + (k.area==='dp'?'DP':'Fin') + '</span></td>' +
      '<td class="kname">' + k.nome + '</td>' +
      '<td class="kval" style="color:' + COR_STATUS[k.st] + '">' + k.fmt + '</td>' +
      '<td class="ksub">' + k.sub + '</td>' +
      '<td><div class="kbar"><div class="kbarf" style="width:' + k.bar + '%;background:' + COR_STATUS[k.st] + '"></div></div></td>' +
      '<td><span class="badge ' + b[0] + '">' + b[1] + '</span></td>' +
      '<td>' + anexoIcon + '</td>' +
      '<td><span class="kchev"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg></span></td>' +
      '</tr>' +
      '<tr class="det-row" id="kdet-' + k.id + '"><td class="det-cell" colspan="8"><div class="det-inner" id="det-' + k.id + '"></div></td></tr>';
  }).join('');
}

function sc(cls, val, label) {
  return '<div class="sc"><div class="sv ' + cls + '">' + val + '</div><div class="sl">' + label + '</div></div>';
}

// ----- DETALHE DO KPI -----
function toggleDetalhe(id) {
  var row = document.getElementById('krow-' + id);
  var det = document.getElementById('kdet-' + id);

  if (_kpiAberto && _kpiAberto !== id) {
    var pr = document.getElementById('krow-' + _kpiAberto);
    var pd = document.getElementById('kdet-' + _kpiAberto);
    if (pr) pr.classList.remove('active');
    if (pd) pd.classList.remove('open');
    if (_chartAtivo) { _chartAtivo.destroy(); _chartAtivo = null; }
  }

  if (_kpiAberto === id) {
    row.classList.remove('active'); det.classList.remove('open');
    _kpiAberto = null;
    if (_chartAtivo) { _chartAtivo.destroy(); _chartAtivo = null; }
    return;
  }

  row.classList.add('active'); det.classList.add('open'); _kpiAberto = id;
  buildDetalhe(id);
}

function buildDetalhe(id) {
  var mes    = document.getElementById('pmes').value;
  var mesIdx = MS.indexOf(mes);
  var imp    = (IMPACTOS[id] || {})[mesIdx === 0 ? 'jan' : 'fev'] || 'Sem impactos registrados.';
  var acoes  = AppState.acoes[id] || [];
  var kpis   = calcularKPIs(mes);
  var k      = kpis.find(function(x) { return x.id === id; });
  var sCls   = { Concluido:'bok', Andamento:'bwarn', Pendente:'bbad', Apresentada:'binfo' };
  var d      = k ? k.dp : {};

  var dadosHtml = buildDadosHtml(id, d, mes);
  var analista  = d && d.analista ? d.analista : '-';
  var ts        = d && d.ts ? d.ts : '-';
  var anexoHtml = d && d.anexo_url
    ? '<a href="' + d.anexo_url + '" target="_blank" class="det-anexo">' +
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32"/></svg>' +
      d.anexo_nome + '</a>'
    : '<div class="det-empty" style="padding:.5rem 0">Nenhum arquivo anexado.</div>';

  document.getElementById('det-' + id).innerHTML =
    '<div class="det-block"><h4>Dados — ' + mes + '</h4>' + dadosHtml +
      '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text2)">' +
      'Lancado por: <strong>' + analista + '</strong> em ' + ts + '</div></div>' +
    '<div class="det-block"><h4>Evolucao Jan x Fev</h4><div class="det-chart-wrap"><canvas id="chart-' + id + '"></canvas></div></div>' +
    '<div class="det-block"><h4>Principais impactos</h4><div class="det-imp">' + imp + '</div>' +
      '<div style="margin-top:10px"><h4 style="margin-bottom:6px">Evidencia</h4>' + anexoHtml + '</div></div>' +
    '<div class="det-block"><h4>Plano de acao (' + acoes.length + ')</h4>' +
      renderAcoesDetalhe(id, acoes, sCls) +
      '<button class="btn-editar-acao" onclick="toggleEditorAcoes(\'' + id + '\')">' +
      '<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg> ' +
      'Editar acoes</button>' +
      '<div class="acao-editor" id="ae-' + id + '">' +
        '<div id="ae-form-' + id + '"></div>' +
        '<button type="button" class="btn-add-acao" onclick="addAcaoDetalhe(\'' + id + '\')">+ Adicionar acao</button><br>' +
        '<button type="button" class="btn-salvar-acao" onclick="salvarAcoesDetalhe(\'' + id + '\')">Salvar no Sheets</button>' +
        '<div class="acao-saving" id="ae-ok-' + id + '">Salvo!</div>' +
      '</div>' +
    '</div>';

  setTimeout(function() { buildChart(id, k); }, 50);
}

function renderAcoesDetalhe(id, acoes, sCls) {
  if (!acoes.length) return '<div class="det-empty">Sem acoes. Clique em Editar acoes.</div>';
  return '<div id="ae-lista-' + id + '">' + acoes.map(function(a) {
    var txt = a.acao || a.a || '';
    var st  = a.status || a.s || 'Pendente';
    return '<div class="det-acao"><span class="det-acao-txt">' + txt + '</span>' +
      '<span class="badge ' + (sCls[st]||'bempty') + '">' + st + '</span></div>';
  }).join('') + '</div>';
}

// Editor de ações no detalhe
function toggleEditorAcoes(id) {
  var ed = document.getElementById('ae-' + id);
  ed.classList.toggle('open');
  if (ed.classList.contains('open')) buildEditorAcoes(id);
}

function buildEditorAcoes(id) {
  var acoes = AppState.acoes[id] || [];
  var form  = document.getElementById('ae-form-' + id);
  form.innerHTML = acoes.map(function(a, i) {
    var st  = a.status || a.s || 'Pendente';
    var cls = st==='Pendente'?'st-pendente':st==='Andamento'?'st-andamento':'st-concluido';
    return '<div class="acao-step-row">' +
      '<input type="text" id="ae-txt-' + id + '-' + i + '" value="' + (a.acao||a.a||'').replace(/"/g,'&quot;') + '">' +
      '<select id="ae-st-' + id + '-' + i + '" class="' + cls + '" onchange="atualizarCorStatus(this)">' +
        '<option' + (st==='Pendente'?' selected':'') + '>Pendente</option>' +
        '<option' + (st==='Andamento'?' selected':'') + '>Andamento</option>' +
        '<option' + (st==='Concluido'?' selected':'') + '>Concluido</option>' +
      '</select>' +
      '<button type="button" class="acao-step-del" onclick="removeAcaoDetalhe(\'' + id + '\',' + i + ')">x</button>' +
      '</div>';
  }).join('');
}

function addAcaoDetalhe(id) {
  if (!AppState.acoes[id]) AppState.acoes[id] = [];
  AppState.acoes[id].push({ acao:'', status:'Pendente' });
  buildEditorAcoes(id);
}

function removeAcaoDetalhe(id, idx) {
  AppState.acoes[id].splice(idx, 1);
  buildEditorAcoes(id);
}

async function salvarAcoesDetalhe(id) {
  var form  = document.getElementById('ae-form-' + id);
  var items = form.querySelectorAll('.acao-step-row');
  var novas = [];
  items.forEach(function(_, i) {
    var txt = document.getElementById('ae-txt-' + id + '-' + i);
    var st  = document.getElementById('ae-st-' + id + '-' + i);
    if (txt && txt.value.trim()) novas.push({ acao: txt.value.trim(), status: st ? st.value : 'Pendente' });
  });
  AppState.acoes[id] = novas;

  var sCls = { Concluido:'bok', Andamento:'bwarn', Pendente:'bbad', Apresentada:'binfo' };
  var lista = document.getElementById('ae-lista-' + id);
  if (lista) lista.innerHTML = renderAcoesDetalhe(id, novas, sCls);

  try {
    await apiGet('save_acoes', { kpi: id, acoes: JSON.stringify(novas) });
    var ok = document.getElementById('ae-ok-' + id);
    ok.style.display = 'block'; ok.textContent = 'Salvo no Sheets!';
    setTimeout(function() { ok.style.display = 'none'; }, 2500);
    toast('Plano de acao atualizado!');
  } catch(e) { toast('Erro ao salvar.'); }
}

function atualizarCorStatus(sel) {
  sel.className = sel.value==='Pendente'?'st-pendente':sel.value==='Andamento'?'st-andamento':'st-concluido';
}

// Dados numéricos no detalhe
function buildDadosHtml(id, d, mes) {
  if (!d) return '<div class="det-empty">Sem dados lancados.</div>';
  var rows = [];
  var ds = function(l, v, cor) {
    return '<div class="det-stat"><span class="det-stat-lbl">' + l + '</span>' +
      '<span class="det-stat-val"' + (cor?' style="color:' + cor + '"':'') + '>' + (v||'-') + '</span></div>';
  };
  var ok = '#16a34a', bad = '#dc2626';
  if (id==='demissoes') {
    rows = [ds('Orcado',d.orc_dem), ds('Realizado',d.dem_real,d.dem_real>d.orc_dem?bad:ok),
      ds('Variacao',(d.dem_real&&d.orc_dem?(d.dem_real-d.orc_dem>0?'+':'')+((d.dem_real||0)-(d.orc_dem||0)):'-')),
      ds('Custo orcado',fmtR(d.orc_demC)), ds('Custo real',fmtR(d.dem_custo),d.dem_custo>d.orc_demC?bad:ok)];
  } else if (id==='tmd') {
    rows = [ds('Total demissoes',d.tmd_total), ds('Ocorr. >7 dias',d.tmd_real,d.tmd_real>d.tmd_meta?bad:ok),
      ds('Meta (max)',d.tmd_meta), ds('% do total',d.tmd_total?((d.tmd_real/d.tmd_total)*100).toFixed(1)+'%':'-')];
  } else if (id==='uniforme') {
    var up = d.unif_dem ? ((d.unif_desc/d.unif_dem)*100).toFixed(1) : 0;
    rows = [ds('Total demissoes',d.unif_dem), ds('Com desconto',d.unif_desc),
      ds('Meta',d.unif_meta+'%'), ds('% atingido',up+'%',parseFloat(up)>=d.unif_meta?ok:bad)];
  } else if (id==='folha') {
    var fp = d.folha_total ? ((d.folha_ajust/d.folha_total)*100).toFixed(2)+'%' : '-';
    rows = [ds('HC total',d.folha_total), ds('Ajustes',d.folha_ajust,d.folha_ajust>3?bad:ok),
      ds('Taxa',fp), ds('Meta','<=1%')];
  } else if (id==='he') {
    var tot = (+d.he_op||0)+(+d.he_adm||0)+(+d.he_ti||0)+(+d.he_rh||0);
    rows = [ds('Total H.E.',tot.toFixed(1)+'h'), ds('Operacao',(d.he_op||0)+'h'),
      ds('ADM',(d.he_adm||0)+'h'), ds('TI',(d.he_ti||0)+'h'),
      ds('H.E./colab.',d.he_hc?(tot/d.he_hc).toFixed(1)+'h':'-')];
  } else if (id==='mktzap') {
    rows = [ds('Total',d.mkt_tot), ds('DP',d.mkt_dp), ds('R&S',d.mkt_rs), ds('Demais',d.mkt_demais)];
  } else if (id==='boletim') {
    var bp = d.bol_total ? ((d.bol_ajust/d.bol_total)*100).toFixed(1)+'%' : '-';
    rows = [ds('Total boletins',d.bol_total), ds('Ajustados',d.bol_ajust,d.bol_ajust>3?bad:ok), ds('% ajustados',bp), ds('Meta','<=10%')];
  } else if (id==='epi') {
    var ep = d.orc_epi ? ((d.epi_real/d.orc_epi)*100).toFixed(1)+'%' : '-';
    rows = [ds('Orcado',fmtR(d.orc_epi)), ds('Realizado',fmtR(d.epi_real),d.epi_real>d.orc_epi?bad:ok),
      ds('% do orcado',ep), ds('Variacao',fmtR(d.epi_real-d.orc_epi))];
  } else if (id==='exames') {
    var xp = d.orc_exam ? ((d.exam_real/d.orc_exam)*100).toFixed(1)+'%' : '-';
    rows = [ds('Orcado',fmtR(d.orc_exam)), ds('Realizado',fmtR(d.exam_real),d.exam_real>d.orc_exam?bad:ok), ds('% do orcado',xp)];
  } else if (id==='cartao') {
    var cp = d.orc_cart ? ((d.cart_real/d.orc_cart)*100).toFixed(1)+'%' : '-';
    rows = [ds('Orcado',fmtR(d.orc_cart)), ds('Realizado',fmtR(d.cart_real),d.cart_real>d.orc_cart?bad:ok), ds('% do orcado',cp)];
  } else if (id==='contratos') {
    var em_dia = (d.cont_total||0) - (d.cont_venc||0);
    rows = [ds('Total',d.cont_total), ds('Em dia',em_dia,d.cont_venc>0?bad:ok), ds('Pendentes',d.cont_venc,d.cont_venc>0?bad:ok)];
  } else if (id==='certidoes') {
    rows = [ds('Total',d.cert_total), ds('Validas',d.cert_ok,ok), ds('Vencidas',d.cert_venc,d.cert_venc>0?bad:ok)];
  }
  return rows.join('');
}

function buildChart(id, k) {
  var ctx = document.getElementById('chart-' + id);
  if (!ctx || !k) return;
  if (_chartAtivo) { _chartAtivo.destroy(); }
  var jan  = typeof k.jan === 'number' ? k.jan : parseFloat(k.jan) || 0;
  var fev  = typeof k.fev === 'number' ? k.fev : parseFloat(k.fev) || 0;
  var meta = typeof k.meta === 'number' ? k.meta : null;
  var datasets = [
    { label:'Janeiro', data:[jan,null], backgroundColor:'#bfdbfe', borderRadius:4 },
    { label:'Fevereiro', data:[null,fev], backgroundColor:COR_STATUS[k.st]||'#6b7280', borderRadius:4 }
  ];
  if (meta) datasets.push({ label:'Meta', data:[meta,meta], type:'line', borderColor:'#f59e0b', borderDash:[5,3], borderWidth:2, pointRadius:0, fill:false });
  _chartAtivo = new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Janeiro','Fevereiro'], datasets: datasets },
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend: { labels: { font: { size:10 } } } },
      scales: { x: { ticks: { font:{size:11} } }, y: { beginAtZero:true, ticks: { font:{size:10} } } }
    }
  });
}

// Carregar ações do Sheets
async function carregarAcoes() {
  try {
    var j = await apiGet('get_acoes');
    if (j.ok && j.data) {
      Object.keys(j.data).forEach(function(kpi) {
        if (j.data[kpi].length) AppState.acoes[kpi] = j.data[kpi];
      });
    }
  } catch(e) {}
}
