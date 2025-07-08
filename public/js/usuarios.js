const tbody = document.querySelector('#tabela-usuarios tbody');
let usuarios = [];

// Busca os usuários do servidor e mostra na tabela
async function carregarUsuarios() {
  try {
    const res = await fetch('/api/usuarios');
    usuarios = await res.json();
    montarTabela();
  } catch (e) {
    alert('Erro ao carregar usuários');
    console.error(e);
  }
}

// Monta a tabela com inputs para editar
function montarTabela() {
  tbody.innerHTML = '';
  usuarios.forEach((user, i) => {
    const tr = document.createElement('tr');

    // Nome editável
    const tdNome = document.createElement('td');
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.value = user.nome || '';
    inputNome.addEventListener('input', e => usuarios[i].nome = e.target.value);
    tdNome.appendChild(inputNome);
    tr.appendChild(tdNome);

    // Senha editável
    const tdSenha = document.createElement('td');
    const inputSenha = document.createElement('input');
    inputSenha.type = 'text';
    inputSenha.value = user.senha || '';
    inputSenha.addEventListener('input', e => usuarios[i].senha = e.target.value);
    tdSenha.appendChild(inputSenha);
    tr.appendChild(tdSenha);

    // Tipo editável
    const tdTipo = document.createElement('td');
    const selectTipo = document.createElement('select');
    ['admin', 'cliente'].forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      if (user.tipo === tipo) option.selected = true;
      selectTipo.appendChild(option);
    });
    selectTipo.addEventListener('change', e => usuarios[i].tipo = e.target.value);
    tdTipo.appendChild(selectTipo);
    tr.appendChild(tdTipo);

    tbody.appendChild(tr);
  });
}

// Envia os dados editados para o backend salvar
async function salvarUsuarios() {
  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarios)
    });
    const json = await res.json();
    if (json.sucesso) {
      alert('Usuários salvos com sucesso!');
    } else {
      alert('Erro ao salvar usuários: ' + (json.erro || ''));
    }
  } catch (e) {
    alert('Erro na comunicação com o servidor');
    console.error(e);
  }
}

document.getElementById('salvar').addEventListener('click', salvarUsuarios);

window.addEventListener('DOMContentLoaded', carregarUsuarios);
