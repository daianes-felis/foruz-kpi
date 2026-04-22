// ============================================================
// FORUZ KPI — auth.js
// Login, sessão e gerenciamento de usuários (admin)
// ============================================================

// ----- LOGIN -----
async function fazerLogin() {
  var cpf   = cpfLimpo(document.getElementById('login-cpf').value || '');
  var senha = document.getElementById('login-senha').value || '';
  var err   = document.getElementById('login-err');
  var btn   = document.getElementById('login-btn');

  err.classList.remove('show'); err.textContent = '';

  if (cpf.length !== 11) { err.textContent = 'CPF invalido.'; err.classList.add('show'); return; }
  if (!senha)            { err.textContent = 'Digite sua senha.'; err.classList.add('show'); return; }

  btn.textContent = 'Entrando...'; btn.disabled = true;

  try {
    var j = await apiGet('login', { cpf: cpf, senha: senha });
    if (j.ok) {
      abrirSessao(j.nome, cpf, j.perfil || 'editor');
    } else {
      err.textContent = j.error || 'CPF ou senha incorretos.';
      err.classList.add('show');
      document.getElementById('login-senha').value = '';
    }
  } catch(e) {
    err.textContent = 'Erro de conexao.';
    err.classList.add('show');
  }

  btn.textContent = 'Entrar'; btn.disabled = false;
}

function abrirSessao(nome, cpf, perfil) {
  AppState.usuario = nome;
  AppState.perfil  = perfil || 'editor';

  localStorage.setItem('foruz-session', JSON.stringify({
    nome: nome, cpf: cpf, perfil: AppState.perfil, ts: Date.now()
  }));

  document.getElementById('login-screen').classList.add('hide');
  document.getElementById('user-nome').textContent = nome;

  var isAdmin = AppState.perfil === 'admin';
  document.getElementById('si-admin').style.display  = isAdmin ? '' : 'none';
  document.getElementById('nav-admin').style.display = isAdmin ? '' : 'none';
  var cfgBtn = document.querySelector('.btn-cfg-top');
  if (cfgBtn) cfgBtn.style.display = isAdmin ? '' : 'none';

  appInit();
}

function fazerLogout() {
  if (!confirm('Deseja sair?')) return;
  localStorage.removeItem('foruz-session');
  AppState.usuario = null; AppState.perfil = 'editor';
  document.getElementById('login-cpf').value   = '';
  document.getElementById('login-senha').value = '';
  document.getElementById('login-screen').classList.remove('hide');
}

function verificarSessao() {
  try {
    var s = localStorage.getItem('foruz-session');
    if (!s) return false;
    var sess = JSON.parse(s);
    if (Date.now() - sess.ts > 8 * 60 * 60 * 1000) {
      localStorage.removeItem('foruz-session'); return false;
    }
    AppState.usuario = sess.nome;
    AppState.perfil  = sess.perfil || 'editor';

    document.getElementById('login-screen').classList.add('hide');
    document.getElementById('user-nome').textContent = sess.nome;

    var isAdmin = AppState.perfil === 'admin';
    document.getElementById('si-admin').style.display  = isAdmin ? '' : 'none';
    document.getElementById('nav-admin').style.display = isAdmin ? '' : 'none';
    var cfgBtn = document.querySelector('.btn-cfg-top');
    if (cfgBtn) cfgBtn.style.display = isAdmin ? '' : 'none';

    return true;
  } catch(e) { return false; }
}

// ----- GERENCIAR USUÁRIOS -----
function abrirModalUsuario(row, nome, cpf, perfil, status) {
  document.getElementById('modal-usuario-titulo').textContent = row ? 'Editar usuario' : 'Novo usuario';
  document.getElementById('u-row').value    = row    || '';
  document.getElementById('u-nome').value   = nome   || '';
  document.getElementById('u-cpf').value    = cpf    || '';
  document.getElementById('u-senha').value  = '';
  document.getElementById('u-perfil').value = perfil || 'editor';
  document.getElementById('u-status').value = status || 'ativo';
  document.getElementById('modal-usuario-msg').className = 'cfg-msg';
  document.getElementById('modal-usuario').classList.add('open');
}

function fecharModalUsuario() {
  document.getElementById('modal-usuario').classList.remove('open');
}

async function salvarUsuario() {
  var nome   = document.getElementById('u-nome').value.trim();
  var cpf    = cpfLimpo(document.getElementById('u-cpf').value);
  var senha  = document.getElementById('u-senha').value.trim();
  var perfil = document.getElementById('u-perfil').value;
  var status = document.getElementById('u-status').value;
  var row    = document.getElementById('u-row').value;
  var msg    = document.getElementById('modal-usuario-msg');

  msg.className = 'cfg-msg';
  if (!nome || cpf.length !== 11 || !senha) {
    msg.textContent = 'Preencha todos os campos.'; msg.className = 'cfg-msg err'; return;
  }

  try {
    var params = { cpf: cpf, nome: nome, senha: senha, perfil: perfil, status: status };
    if (row) params.row = row;
    var j = await apiGet('save_usuario', params);
    if (j.ok) { fecharModalUsuario(); carregarUsuarios(); toast('Usuario salvo!'); }
    else { msg.textContent = j.error || 'Erro ao salvar.'; msg.className = 'cfg-msg err'; }
  } catch(e) { msg.textContent = 'Erro de conexao.'; msg.className = 'cfg-msg err'; }
}

async function carregarUsuarios() {
  try {
    var j = await apiGet('get_usuarios');
    if (!j.ok) return;
    var tbody = document.getElementById('usuarios-body');
    if (!j.data.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text2)">Nenhum usuario cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = j.data.map(function(u) {
      var stCls = u.status === 'inativo' ? 'bbad' : 'bok';
      var nomeSafe = (u.nome || '').replace(/'/g, "\\'");
      var cpfFmt = fmtCPF(u.cpf);
      return '<tr>' +
        '<td style="font-weight:500">' + u.nome + '</td>' +
        '<td style="color:var(--text2)">' + cpfFmt + '</td>' +
        '<td><span class="badge binfo">' + u.perfil + '</span></td>' +
        '<td><span class="badge ' + stCls + '">' + u.status + '</span></td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:11px" ' +
          'onclick="abrirModalUsuario(' + u.row + ',\'' + nomeSafe + '\',\'' + cpfFmt + '\',\'' + u.perfil + '\',\'' + u.status + '\')">' +
          'Editar</button></td>' +
        '</tr>';
    }).join('');
  } catch(e) {}
}
