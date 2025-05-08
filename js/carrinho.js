// Recupera os dados do sessionStorage
let dados = sessionStorage.getItem('dadosForm');
let texto = document.getElementById("totalPreco")
if (dados) {
  let produtos = JSON.parse(dados);
  let produtosNoCarrinho = produtos.filter(produto => produto.qtd > 0);
  
  const carrinhoElement = document.getElementById('carrinho');

  if (produtosNoCarrinho.length > 0) {
    let totalCompra = 0
    
    produtosNoCarrinho.forEach(produto => {
      const itemCarrinho = document.createElement('div');
      itemCarrinho.classList.add('produto');
      
      const totalProduto = produto.preco * produto.qtd;
      
      totalCompra = totalProduto;
      
      itemCarrinho.innerHTML = `
        <h3>${produto.nome}</h3>
        <img src="${produto.imagem}" style="max-width: 150px; max-height: 150px;">
        <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
        <p>Quantidade: ${produto.qtd}</p>
        <p>Total: R$ ${totalProduto.toFixed(2)}</p>
      `;

      carrinhoElement.appendChild(itemCarrinho);
    });

    // Aqui preenche a div existente com o total
  
    texto.textContent = `Total da Compra: R$ ${totalCompra.toFixed(2)}`;
  
    console.log(totalCompra, totalPreco);

  } else {
    carrinhoElement.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }

} else {
  alert('Nenhum produto encontrado no carrinho.');
}

function querycode(){
  window.location.href = "qr.html"
}
