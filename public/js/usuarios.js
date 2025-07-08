let usuarios = [];

async function carregarUsuarios() {
  try {
    const res = await fetch('/api/usuarios');
    if (!res.ok) throw new Error('Falha ao buscar usuários');
    usuarios = await res.json();

    renderizarTabela();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    alert('Erro ao carregar usuários, veja o console.');
  }
}

function renderizarTabela() {
  const tbody = document.querySelector('#tabela-usuarios tbody');
  tbody.innerHTML = '';

  usuarios.forEach((u, idx) => {
    const tr = document.createElement('tr');

    // Nome
    const tdNome = document.createElement('td');
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.value = u.nome || '';
    inputNome.addEventListener('input', e => usuarios[idx].nome = e.target.value);
    tdNome.appendChild(inputNome);
    tr.appendChild(tdNome);

    // Senha
    const tdSenha = document.createElement('td');
    const inputSenha = document.createElement('input');
    inputSenha.type = 'text';
    inputSenha.value = u.senha || '';
    inputSenha.addEventListener('input', e => usuarios[idx].senha = e.target.value);
    tdSenha.appendChild(inputSenha);
    tr.appendChild(tdSenha);

    // Tipo
    const tdTipo = document.createElement('td');
    const selectTipo = document.createElement('select');
    ['admin', 'cliente'].forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      if (u.tipo === tipo) option.selected = true;
      selectTipo.appendChild(option);
    });
    selectTipo.addEventListener('change', e => usuarios[idx].tipo = e.target.value);
    tdTipo.appendChild(selectTipo);
    tr.appendChild(tdTipo);

    // Ações
    const tdAcoes = document.createElement('td');
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => {
      usuarios.splice(idx, 1);
      renderizarTabela();
    });
    tdAcoes.appendChild(btnRemover);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

async function salvarUsuarios() {
  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarios)
    });

    if (!res.ok) throw new Error('Falha ao salvar usuários');

    const data = await res.json();

    if (data.sucesso) {
      alert('Usuários salvos com sucesso!');
      carregarUsuarios();
    } else {
      alert('Erro ao salvar usuários.');
    }
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    alert('Erro ao salvar usuários, veja o console.');
  }
}

function adicionarUsuario() {
  usuarios.push({ nome: '', senha: '', tipo: 'cliente' });
  renderizarTabela();
}

document.getElementById('btn-salvar').addEventListener('click', salvarUsuarios);
document.getElementById('btn-adicionar').addEventListener('click', adicionarUsuario);

window.addEventListener('DOMContentLoaded', carregarUsuarios);
