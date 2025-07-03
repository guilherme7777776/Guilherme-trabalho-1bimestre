// Classe para representar cada produto
class produto {
    constructor(id, nome, preco, qtd, img, categoria) {
      this.id = id;
      this.nome = nome;
      this.preco = preco;
      this.qtd = qtd;
      this.img = img;
      this.categoria = categoria;
    }
}

function verificarUsuarioLogado() {
  fetch('/api/usuario')
    .then(res => res.json())
    .then(data => {
      if (data.logado) {
        console.log('Usuário logado:', data.usuario.nome, '| Tipo:', data.usuario.tipo);
      } else {
        console.log('Nenhum usuário logado.');
      }
    })
    .catch(err => {
      console.error('Erro ao verificar usuário:', err);
    });
}

// Chame essa função onde quiser, por exemplo, ao carregar a página:
window.addEventListener('DOMContentLoaded', verificarUsuarioLogado);

  
let listaproduto = [];
  
  
  // Cria o elemento HTML para um produto
function criarElementoProduto(prod) {
    const artigo = document.createElement('article');
    artigo.classList.add('produto');
  
    artigo.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}">
      <div class="texto">
        <h3>${prod.nome}</h3>
        <p>R$ ${prod.preco.toFixed(2)}</p>
      </div>
      <div class="quantidade-container">
        <button class="botao-adicionar" onclick="alterarQuantidade('${prod.id}', -1)">-</button>
        <span id="${prod.id}" class="quantidade">${prod.qtd}</span>
        <button class="botao-adicionar" onclick="alterarQuantidade('${prod.id}', 1)">+</button>
      </div>
      <div class="acoes-produto">
      <button onclick="editarProduto('${prod.id}')">Editar</button>
      <button onclick="apagarProduto('${prod.id}')">Apagar</button>
      </div>
    `;
  
    return artigo;
}


function urlSemCache(url) {
  const separador = url.includes('?') ? '&' : '?';
  return url + separador + '_=' + new Date().getTime();
}

  // Carrega os produtos do servidor e insere na página
async function carregarProdutos() {
    try {
      const resposta = await fetch(urlSemCache('/api/produtos')); 
      let dados = await resposta.json();
      const listabruta = sessionStorage.getItem('dadosForm');
      console.log(listabruta);
      sessionStorage.removeItem('dadosForm');
      let lista = JSON.parse(listabruta);
      if (lista) {
        dados.forEach(prod => {
          const correspondente = lista.find(p => p.id == prod.id);
          if (correspondente) {
            prod.qtd = correspondente.qtd;
          }
        });
      }
      


      listaproduto = dados.map(prod => new produto(
        prod.id,
        prod.nome,
        prod.preco,
        prod.qtd,
        prod.img,
        prod.categoria
      ));
      
      
      
  
      const categorias = {};
      listaproduto.forEach(prod => {
        if (!categorias[prod.categoria]) categorias[prod.categoria] = [];
        categorias[prod.categoria].push(prod);
      });
  
      for (const cat in categorias) {
        const container = document.querySelector(`#${cat} section`);
        if (!container) continue;
  
        container.innerHTML = '';
        categorias[cat].forEach(prod => {
          const artigo = criarElementoProduto(prod);
          container.appendChild(artigo);
        });
      }
  
    } catch (erro) {
      console.error('Erro ao carregar produtos:', erro);
    }
}
  
  
  // Alterna entre seções da loja
function mostrar(secao) {
    const paginas = document.querySelectorAll('.pagina');
    paginas.forEach(pagina => pagina.classList.remove('ativa'));
    document.getElementById(secao).classList.add('ativa');
}
  
  
  // Altera a quantidade de um produto na lista e na tela
function alterarQuantidade(idProduto, operacao) {
    const quantidade = document.getElementById(idProduto);
    let quant = parseInt(quantidade.textContent);
    quant += operacao;
    if (quant < 0) quant = 0;
    quantidade.textContent = quant;
  
    for (let i = 0; i < listaproduto.length; i++) {
      if (idProduto == listaproduto[i].id) {
        listaproduto[i].qtd = quant;
      }
    }
}
  

  // Salva no carrinho e redireciona
function littlecar() {
    sessionStorage.setItem('dadosForm', JSON.stringify(listaproduto));
    
    fetch('/api/usuario')
    .then(res => res.json())
    .then(data => {
      if (data.logado) {
        // Se estiver logado, pode ir para o carrinho
        window.location.href = 'carrinho.html';
      } else {
        // Se não estiver logado, redireciona para a tela de login
        alert('Você precisa estar logado para acessar o carrinho.');
        levarParaCarrinho = 1
        sessionStorage.setItem('haveralogin', JSON.stringify(levarParaCarrinho));
        window.location.href = 'login.html';
      }
    })
    .catch(erro => {
      console.error('Erro ao verificar login:', erro);
      alert('Erro ao verificar login. Tente novamente mais tarde.');
    });
}
  

  
window.addEventListener('DOMContentLoaded', carregarProdutos);

//verificar se tem usuario logado
//fetch('/api/usuario')
//  .then(res => res.json())
//  .then(data => {
//    if (data.logado) {
//    console.log('Usuário logado:', data.usuario.nome, '| Tipo:', data.usuario.tipo);
//    } else {
//      console.log('Nenhum usuário logado.');
//    }
// });

function toggleFormulario() {
  const secao = document.getElementById('adicionar-produto');
  const botao = document.getElementById('botao-toggle-formulario');

  if (secao.style.display === 'none') {
    secao.style.display = 'block';
    botao.textContent = 'Fechar';
  } else {
    secao.style.display = 'none';
    botao.textContent = 'Adicionar Produto';
  }
}





function urlSemCache(url) {
  const separador = url.includes('?') ? '&' : '?';
  return url + separador + '_=' + new Date().getTime();
}

let nomeImagemSelecionada = ''; // global para armazenar o nome

function previewImagem(event) {
  const input = event.target;
  const img = document.getElementById('preview-img');

  if (input.files && input.files[0]) {
    const file = input.files[0];
    nomeImagemSelecionada = file.name; // salva o nome do arquivo globalmente
    
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}






fetch('/api/usuario')
.then(res => res.json())
.then(data => {
  if (data.logado && data.usuario.tipo === 'admin') {
    // Mostra o botão só para admin
    document.getElementById('botao-toggle-formulario').style.display = 'inline-block';
  }
})
.catch(err => {
  console.error('Erro ao verificar usuário:', err);
});




// Função para apagar produto
async function apagarProduto(id) {
  if (!confirm('Tem certeza que deseja apagar este produto?')) return;

  try {
    const res = await fetch('/api/apagar-produto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (data.sucesso) {
      alert('Produto apagado com sucesso!');
      await carregarProdutos(); // <-- força a tela a recarregar com o novo CSV
    } else {
      alert('Erro: ' + data.mensagem);
    }
  } catch (err) {
    console.error('Erro ao apagar produto:', err);
    alert('Erro de conexão com o servidor.');
  }
}


function enviarProduto(event) {
  event.preventDefault();

  const form = document.getElementById('form-produto');

  // Cria um objeto FormData e adiciona todos os campos do form automaticamente
  const formData = new FormData(form);
  formData.set('qtd', '0');

  // Se você tem o id para edição, adicione manualmente (se precisar)
  const editId = form.getAttribute('data-edit-id');
  if (editId) {
    formData.append('id', editId);
  } else {
    // Se for adicionar novo produto, pode gerar um id, por exemplo:
    formData.append('id', gerarNovoId());
  }

  fetch(editId ? '/api/editar-produto' : '/api/adicionar-produto', {
    method: 'POST',
    body: formData, // Aqui manda o formData diretamente, sem headers, para o fetch colocar o Content-Type correto automaticamente
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      alert(`Produto ${editId ? 'editado' : 'adicionado'} com sucesso!`);

      // Atualiza a tela e fecha o formulário
      carregarProdutos();
      form.reset();
      form.removeAttribute('data-edit-id');
      document.getElementById('preview-img').src = 'imagens/default.png';
      toggleFormulario();
    } else {
      alert('Erro: ' + data.mensagem);
    }
  })
  .catch(err => {
    console.error('Erro ao salvar produto:', err);
    alert('Erro ao salvar produto.');
  });
}


// Gera um novo ID com base no último ID da lista
function gerarNovoId() {
  let maiorId = 0;
  for (let i = 0; i < listaproduto.length; i++) {
    const idNum = parseInt(listaproduto[i].id);
    if (!isNaN(idNum) && idNum > maiorId) {
      maiorId = idNum;
    }
  }
  return (maiorId + 1).toString();
}


function editarProduto(id) {
  const prod = listaproduto.find(p => p.id == id);
  if (!prod) return alert('Produto não encontrado!');

  toggleFormulario();

  document.getElementById('nome-prod').value = prod.nome;
  document.getElementById('preco-prod').value = prod.preco;
  document.getElementById('cat-prod').value = prod.categoria;

  // Deixa a imagem atual visível no preview
  document.getElementById('preview-img').src = prod.img;
  nomeImagemSelecionada = prod.img.replace('imagens/', '');
  console.log(listaproduto)
  // Marca que estamos editando esse ID
  document.getElementById('form-produto').setAttribute('data-edit-id', prod.id);
}



