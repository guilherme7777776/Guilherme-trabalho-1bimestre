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
    window.location.href = "p1.html"; // Redireciona para a loja
  } else {
    alert("Login incorreto. Verifique usuário e senha.");
  }
}

// Botão de criar conta ainda não implementado
function foofighters() {
  alert("Cadastro ainda não implementado.");
}
