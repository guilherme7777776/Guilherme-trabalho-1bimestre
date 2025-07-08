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

    // Nome (texto fixo, sem input)
    const tdNome = document.createElement('td');
    tdNome.textContent = u.nome || '';
    tr.appendChild(tdNome);

    // Senha (texto fixo, sem input)
    const tdSenha = document.createElement('td');
    tdSenha.textContent = u.senha || '';
    tr.appendChild(tdSenha);

    // Tipo (ainda editável via select)
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

    // Ações (botão remover)
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
}

document.getElementById('btn-salvar').addEventListener('click', salvarUsuarios);
document.getElementById('btn-adicionar').addEventListener('click', adicionarUsuario);

window.addEventListener('DOMContentLoaded', carregarUsuarios);
