// Classe para representar cada produto
class produto {
    constructor(id, nome, preco, qtd, imagem, categoria) {
      this.id = id;
      this.nome = nome;
      this.preco = preco;
      this.qtd = qtd;
      this.imagem = imagem;
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
      <img src="${prod.imagem}" alt="${prod.nome}">
      <div class="texto">
        <h3>${prod.nome}</h3>
        <p>R$ ${prod.preco.toFixed(2)}</p>
      </div>
      <div class="quantidade-container">
        <button class="botao-adicionar" onclick="alterarQuantidade('${prod.id}', -1)">-</button>
        <span id="${prod.id}" class="quantidade">0</span>
        <button class="botao-adicionar" onclick="alterarQuantidade('${prod.id}', 1)">+</button>
      </div>
    `;
  
    return artigo;
}
  
  
  // Carrega os produtos do servidor e insere na página
async function carregarProdutos() {
    try {
      const resposta = await fetch('/api/produtos');
      const dados = await resposta.json();
  
      listaproduto = dados.map(prod => new produto(
        prod.id,
        prod.nome,
        prod.preco,
        prod.quantidade,
        prod.img,
        prod.categoria.toLowerCase()
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
  

  // Inicia o carregamento dos produtos ao abrir a página
window.addEventListener('DOMContentLoaded', carregarProdutos);

fetch('/api/usuario')
  .then(res => res.json())
  .then(data => {
    if (data.logado) {
    console.log('Usuário logado:', data.usuario.nome, '| Tipo:', data.usuario.tipo);
    } else {
      console.log('Nenhum usuário logado.');
    }
 });


