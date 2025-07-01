
function criarconta() {
  const nome = document.getElementById('idnome').value.trim();
  const senha = document.getElementById('idsenha').value.trim();
  const confirmar = document.getElementById('idcenha').value.trim();

  if (!nome || !senha || !confirmar) {
    alert('Preencha todos os campos.');
    return;
  }

  if (senha !== confirmar) {
    alert('As senhas não coincidem.');
    return;
  }

  fetch('/api/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: nome, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        alert('Conta criada com sucesso!');
        window.location.href = 'index.html';
      } else {
        alert(data.mensagem || 'Erro ao criar conta.');
      }
    })
    .catch(err => {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar usuário.');
    });
}

fetch('/api/usuario')
  .then(res => res.json())
  .then(data => {
    if (data.logado) {
    console.log('Usuário logado:', data.usuario.nome, '| Tipo:', data.usuario.tipo);
    } else {
      console.log('Nenhum usuário logado.');
    }
 });