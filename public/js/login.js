let levarParaCarrinho = sessionStorage.getItem('haveralogin');
console.log(levarParaCarrinho);
async function logar() {
  const nome = document.getElementById("idnome").value;
  const senha = document.getElementById("idsenha").value;

  const resposta = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: nome, senha: senha })
  });

  const resultado = await resposta.json();
  console.log(resultado);
  if (resultado.sucesso) {
    alert("Parabéns, login realizado com sucesso!");
    if(levarParaCarrinho == 1){
      sessionStorage.removeItem("haveralogin")
      window.location.href = "carrinho.html"; // Redireciona para a loja
    }else{
      window.location.href = "index.html"; // Redireciona para a loja
    }
  } else {
    alert("Login incorreto. Verifique usuário e senha.");
  }
}

function foofighters() {
  sessionStorage.setItem('haveralogin', JSON.stringify(levarParaCarrinho));
  window.location.href = "cadastro.html";
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