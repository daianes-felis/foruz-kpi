
// ============================================================
// FORUZ KPI — config.js
// Constantes, URL do backend e dados históricos
// ============================================================

// URL do Apps Script — altere aqui se reimplantar
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5OBHILv9OuLLerv55lw2rgxAVzocz00EznbpAwnmOGCcif16zaN3Gs8_4nwpRulw7mw/exec';

const MS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Orçados mensais
const ORC = {
  dem:  [110,109,99,97,89,88,93,93,106,125,127,127],
  demC: [171075,168921,153408,149960,137463,137033,144789,143927,164181,194345,196500,196500],
  tmd:  [30,30,30,30,30,30,30,30,30,30,30,30],
  unif: [50,50,50,50,50,50,50,50,50,50,50,50],
  epi:  [54000,54000,54000,64000,64000,74000,81000,81000,67000,65000,65000,65000],
  exam: [23500,23500,23500,23500,23500,23500,29000,36000,36000,26000,26000,26000],
  cart: [22400,22400,22400,22400,22400,22400,22400,22400,22400,22400,22400,22400]
};

// Histórico Jan/Fev extraído do Excel
const H_DP = [
  { orc_dem:110, dem_real:129, orc_demC:171075, dem_custo:246910,
    tmd_meta:30, tmd_total:129, tmd_real:37,
    unif_meta:50, unif_dem:129, unif_desc:5,
    folha_total:352, folha_ajust:3,
    he_op:110.4, he_adm:1.9, he_ti:13.1, he_rh:0, he_hc:19,
    mkt_tot:866, mkt_dp:0, mkt_rs:0, mkt_demais:0,
    analista:'Excel', ts:'Janeiro/2026' },
  { orc_dem:109, dem_real:95, orc_demC:168921, dem_custo:0,
    tmd_meta:30, tmd_total:97, tmd_real:55,
    unif_meta:50, unif_dem:97, unif_desc:3,
    folha_total:327, folha_ajust:5,
    he_op:212.3, he_adm:13.5, he_ti:18.9, he_rh:0, he_hc:19,
    mkt_tot:661, mkt_dp:0, mkt_rs:0, mkt_demais:0,
    analista:'Excel', ts:'Fevereiro/2026' }
];

const H_FIN = [
  { bol_total:34, bol_ajust:7,
    orc_epi:54000, epi_real:50499,
    orc_exam:23500, exam_real:29231,
    orc_cart:22400, cart_real:31856,
    cont_total:15, cont_venc:1,
    cert_total:6, cert_ok:6, cert_venc:0,
    analista:'Excel', ts:'Janeiro/2026' },
  { bol_total:37, bol_ajust:5,
    orc_epi:54000, epi_real:90963,
    orc_exam:23500, exam_real:27342,
    orc_cart:22400, cart_real:27034,
    cont_total:15, cont_venc:1,
    cert_total:6, cert_ok:5, cert_venc:1,
    analista:'Excel', ts:'Fevereiro/2026' }
];

// Impactos históricos por KPI
const IMPACTOS = {
  demissoes: {
    jan: '129 rescisoes. 12% CLT (84k extras). 14 rescisoes CLT com custo medio de R$6.030.',
    fev: '95 rescisoes. BR 34% (32 demissoes, 15 por reducao de safra). KN 19% (18 demissoes).'
  },
  tmd: {
    jan: 'Impacto na previsibilidade financeira e pressao no prazo legal de 10 dias.',
    fev: '55 demissoes com +7 dias: 40 travadas pelo fechamento da folha (24 BR, 9 CTL, 6 KN L).'
  },
  uniforme: {
    jan: 'Aplicacao nao padronizada do termo vigente. Perda financeira por nao devolucao.',
    fev: 'Escoamento de recursos financeiros em Uniformes. Sem desconto o valor vira custo alto.'
  },
  folha: {
    jan: 'Somente 3 ajustes frente a 352 HC ativos.',
    fev: '5 ajustes frente a 327 HC ativos: BR falta/ausencia abonada; RBS tratativa de ponto.'
  },
  he: {
    jan: 'Operacao 88% das H.E. (110h). RBS e KN L principais clientes.',
    fev: '244h total / 19 colaboradores. OP 86.8% (212h), TI 7.7% (18h), ADM 5.5% (13h).'
  },
  mktzap: {
    jan: '73% concentrados em 2 pessoas: Larissa 49% (427) e Karly 24% (209).',
    fev: 'Larissa 69.7% (461), Radyla 19.8% (131), Luan 6.8% (45).'
  },
  boletim: {
    jan: 'Retrabalho interno e impacto na credibilidade das informacoes enviadas ao cliente.',
    fev: '5 boletins ajustados: H.E. Nexti incorretas (BR P), inclusao postos ADM/Terminal.'
  },
  epi: {
    jan: 'Jan: 94% do orcado. EPI: Botas Brado/Rumo incorretas.',
    fev: '169% do orcado. Uniformes: 2 parcelas em 15 dias. EPI R$16k: Botas Brado, EPIs Hidrovias.'
  },
  exames: {
    jan: 'Consequencia direta do aumento de movimentacao (admissoes/desligamentos).',
    fev: 'R$27.341 total. 91% admissionais. Por regiao: 58% Rondo, 29% RMC, 13% Baixada.'
  },
  cartao: {
    jan: 'Despesas remanescentes de dezembro. Viagens para MT.',
    fev: 'RMC (combustivel) e MT (combustivel + correios para uniformes Edeia).'
  },
  contratos: {
    jan: '15 contratos ativos, 1 pendente (aluguel barracao). Aguardando analise estrategica.',
    fev: 'Aluguel barracao pendente. Analise estrategica de mudanca de local em andamento.'
  },
  certidoes: {
    jan: 'CND ativa ate 12/07/2026. CND Municipal ativa ate 07/02/26.',
    fev: 'CND Municipal com erro: conflito de recolhimento de ISS entre Campinas e Cubatao.'
  }
};

// Plano de ação inicial (carregado do Sheets depois)
const ACOES_INICIAL = {
  demissoes: [{acao:'Identificar padrao recorrente com a Operacao',status:'Concluido'},{acao:'Mapear motivo de desligamento por cliente',status:'Concluido'}],
  tmd:       [{acao:'Antecipar desligamentos mapeados com a Operacao',status:'Pendente'},{acao:'Acompanhamento no Sisfor nas reunioes diarias',status:'Andamento'}],
  uniforme:  [{acao:'Controle de Evidencia',status:'Pendente'},{acao:'Atualizacao do Termo',status:'Pendente'},{acao:'Alinhamento com Operacao e R&S',status:'Pendente'}],
  folha:     [{acao:'Alinhar processo de ponto semanal com Operacao',status:'Pendente'},{acao:'Verificar contagem automatica NEXTI',status:'Andamento'}],
  he:        [{acao:'Mapear clientes com maior volume de H.E.',status:'Pendente'},{acao:'Acompanhamento de banco de horas',status:'Andamento'}],
  mktzap:    [{acao:'Ajustar MKTZAP para fluxo enxuto',status:'Andamento'},{acao:'Treinamento e alinhamento de uso padrao',status:'Pendente'}],
  boletim:   [{acao:'BR - Recalculo dos pontos antes de imprimir',status:'Concluido'},{acao:'RS - Ajuste no NEXTI para bloqueio H.E.',status:'Pendente'}],
  epi:       [{acao:'Repasse de custos botas ao cliente Brado',status:'Andamento'},{acao:'Garantir intervalo minimo 30 dias com fornecedor',status:'Andamento'}],
  exames:    [{acao:'Cruzar custo de exames por Regiao e Tipo',status:'Concluido'}],
  cartao:    [{acao:'Planejamento estrategico de agendas de viagens',status:'Concluido'},{acao:'Ajuste de limite do cartao corporativo',status:'Concluido'}],
  contratos: [{acao:'Analise comparativa: manter ou mudar local',status:'Andamento'},{acao:'Definir prazo para decisao estrategica',status:'Pendente'}],
  certidoes: [{acao:'Pagar guia em Campinas e solicitar restituicao',status:'Pendente'}]
};

// Estado global da aplicação
const AppState = {
  url: SCRIPT_URL,
  db: { dp: {}, fin: {} },
  acoes: JSON.parse(JSON.stringify(ACOES_INICIAL)),
  usuario: null,
  perfil: 'editor'
};

// Inicializar DB com histórico
H_DP.forEach(function(h, i) { AppState.db.dp[MS[i]] = h; });
H_FIN.forEach(function(h, i) { AppState.db.fin[MS[i]] = h; });

// Helpers
function toast(msg, dur) {
  dur = dur || 2500;
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, dur);
}

function fmtR(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); }
function fmtCPF(cpf) {
  var v = String(cpf).replace(/\D/g, '');
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function cpfLimpo(cpf) { return cpf.replace(/\D/g, ''); }
function mascaraCPF(el) {
  var v = el.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  el.value = v;
}

// API calls
async function apiGet(action, params) {
  var url = AppState.url + '?action=' + action;
  if (params) {
    Object.keys(params).forEach(function(k) {
      url += '&' + k + '=' + encodeURIComponent(params[k]);
    });
  }
  var r = await fetch(url);
  return r.json();
}

async function sendDP(mes, dados) {
  await apiGet('set_dp', { mes: mes, dados: JSON.stringify(dados) });
}

async function sendFin(mes, dados) {
  await apiGet('set_fin', { mes: mes, dados: JSON.stringify(dados) });
}

async function uploadFileToSheets(file, mes, area) {
  if (!file) return null;
  try {
    toast('Enviando arquivo...', 5000);
    var base64 = await new Promise(function(res, rej) {
      var r = new FileReader();
      r.onload = function() { res(r.result); };
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    var payload = {
      action: 'upload',
      fileData: base64.split(',')[1],
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      mes: mes, kpi: area
    };
    var resp = await fetch(AppState.url, { method: 'POST', body: JSON.stringify(payload) });
    var j = await resp.json();
    if (j.ok) { toast('Arquivo salvo no Drive!'); return { nome: file.name, url: j.url }; }
  } catch(e) { toast('Erro no upload: ' + e.message); }
  return null;
}
