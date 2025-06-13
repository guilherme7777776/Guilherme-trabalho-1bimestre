class produto{
    constructor(id, nome, preco, qtd, imagem, categoria){
        this.id = id
        this.nome = nome
        this.preco = preco
        this.qtd = qtd
        this.imagem = imagem
        this.categoria
    }
}

let listaproduto = [
    new produto(1, "Rust in Peace - Megadeth", 45, 0, "https://preview.redd.it/the-rust-in-peace-album-cover-is-so-great-v0-9fls69h6v6od1.jpeg?width=640&crop=smart&auto=webp&s=fb8a2eff6281801eebc3f03aa8848fe2333f701d", "album"),
    new produto(3, "Weezer(blue album) - Weezer", 58, 0, "https://upload.wikimedia.org/wikipedia/pt/4/4f/Weezer_-_Blue_Album.jpg", "album"),
    new produto(13, "Camisa do Santos", 37, 0, "https://acdn-us.mitiendanube.com/stores/002/152/760/products/camisa-santos-2023-oficial-umbro-branca-preto1-6c52899fb15401485a16841947458043-1024-1024.jpeg", "camisa"),
    new produto(17, "Seven Inches of Satanic Panic - Ghost", 666, 0, "https://upload.wikimedia.org/wikipedia/en/a/af/Ghost_-_Seven_Inches_of_Satanic_Panic.jpg", "EP")
];

  
  
function mostrar(secao) {
    const paginas = document.querySelectorAll('.pagina');
    paginas.forEach(pagina => pagina.classList.remove('ativa'));
    document.getElementById(secao).classList.add('ativa');
}
    
function alterarQuantidade(idProduto, operacao) {
    const quantidade = document.getElementById(idProduto);
    let quant = parseInt(quantidade.textContent);
    quant += operacao;
    if (quant < 0) quant = 0;
    quantidade.textContent = quant;
    for(let i = 0 ; i<listaproduto.length ; i++){
      
      if(idProduto == listaproduto[i].id){
        listaproduto[i].qtd = quant
      }
      console.log(listaproduto[i])
    }
}
  
  
function littlecar() {
    
    sessionStorage.setItem('dadosForm', JSON.stringify(listaproduto));
  
    
    console.log('dadosForm');
    window.location.href="carrinho.html"
}
