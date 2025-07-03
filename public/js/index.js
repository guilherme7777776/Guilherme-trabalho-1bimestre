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
      console.log(resposta)
      let dados = await resposta.json();
      const listabruta = sessionStorage.getItem('dadosForm');
      sessionStorage.removeItem('dadosForm');
      let lista = JSON.parse(listabruta);
      console.log(dados);
      console.log("a");
      if (lista){
        for(i = 0; i<lista.length; i++){
          dados[i].qtd = lista[i].qtd
        }
        
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


function enviarProduto(event) {
  event.preventDefault();

  let id = 0
  for(let i = 0; i<listaproduto.length; i++){
    id = listaproduto[i].id
  }
  id++
  const nome = document.getElementById('nome-prod').value;
  const preco = document.getElementById('preco-prod').value;
  let qtd = 0;
  const categoria = document.getElementById('cat-prod').value;

  // Usa o nome da imagem do preview
  const img = nomeImagemSelecionada ? `imagens/${nomeImagemSelecionada}` : 'imagens/default.png';

  fetch('/api/adicionar-produto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nome, preco, qtd, img, categoria })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      alert('Produto adicionado com sucesso!');
      carregarProdutos();

      // Limpa o formulário e preview
      document.getElementById('form-produto').reset();
      document.getElementById('preview-img').src = 'imagens/default.png';
      nomeImagemSelecionada = '';
    } else {
      alert('Erro: ' + data.mensagem);
    }
  })
  .catch(err => {
    console.error('Erro ao salvar produto:', err);
    alert('Erro ao salvar produto.');
  });
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
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function enviarProduto(event) {
  event.preventDefault();

  const form = document.getElementById('form-produto');
  const editId = form.getAttribute('data-edit-id');

  const nome = document.getElementById('nome-prod').value;
  const preco = parseFloat(document.getElementById('preco-prod').value);
  const categoria = document.getElementById('cat-prod').value;

  if (editId) {
    // Edição: atualiza produto local
    const prodIndex = listaproduto.findIndex(p => p.id == editId);
    if (prodIndex !== -1) {
      listaproduto[prodIndex].nome = nome;
      listaproduto[prodIndex].preco = preco;
      listaproduto[prodIndex].categoria = categoria;
      // imagem NÃO muda aqui
    }

    alert('Produto editado com sucesso!');
    form.removeAttribute('data-edit-id');

    // Se quiser, aqui pode chamar API para atualizar backend

  } else {
    // Criação do produto
    let novoId = listaproduto.length ? (parseInt(listaproduto[listaproduto.length - 1].id) + 1).toString() : '1';
    const imgPadrao = 'imagens/default.png'; // ou outra imagem padrão que quiser

    const novoProduto = new produto(novoId, nome, preco, 0, imgPadrao, categoria);
    listaproduto.push(novoProduto);

    alert('Produto adicionado com sucesso!');
    // Se quiser, chamar API para adicionar backend
  }

  form.reset();
  document.getElementById('preview-img').src = 'imagens/default.png';
  toggleFormulario();
  carregarProdutos();
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


  // Função para preencher o formulário com os dados do produto para edição
function editarProduto(id) {
  const prod = listaproduto.find(p => p.id == id);
  if (!prod) return alert('Produto não encontrado!');

  toggleFormulario(); // Abre o formulário

  document.getElementById('nome-prod').value = prod.nome;
  document.getElementById('preco-prod').value = prod.preco;
  document.getElementById('cat-prod').value = prod.categoria;

  // NÃO alteramos o preview da imagem, só mantém a que já estava
  // Ou opcionalmente podemos deixar o preview fixo, sem mexer
  console.log(listaproduto);
  console.log("bolod eecenoura");

  // Marca que está editando esse produto
  document.getElementById('form-produto').setAttribute('data-edit-id', id);
}

// Função para apagar produto
function apagarProduto(id) {
  if (!confirm('Tem certeza que deseja apagar este produto?')) return;

  // Remove o produto do array
  listaproduto = listaproduto.filter(p => p.id != id);

  // Recalcula os IDs para ficarem sequenciais (id-1, id-2, ...)
  listaproduto.forEach((prod, index) => {
    prod.id = (index + 1).toString();
  });

  // Atualiza a tela
  carregarProdutos();

  // Opcional: atualizar o backend com os produtos atualizados
  // Aqui você pode fazer um fetch para enviar a lista atualizada
}
