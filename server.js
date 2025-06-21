const express = require('express');
const session = require('express-session');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares para JSON e urlencoded (útil para login)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração básica da sessão
app.use(session({
  secret: 'segredo-trabalho',
  resave: false,
  saveUninitialized: true
}));

// Função para ler CSV com separador ';'
function lerCSV(caminho) {
  return new Promise((resolve, reject) => {
    const resultados = [];
    fs.createReadStream(caminho)
      .pipe(csv({ separator: ';' }))
      .on('data', data => resultados.push(data))
      .on('end', () => resolve(resultados))
      .on('error', err => reject(err));
  });
}

// Rota para retornar os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const caminhoCSV = path.join(__dirname, 'dados_em_casa', 'crud.csv.csv');
    let produtos = await lerCSV(caminhoCSV);

    produtos = produtos.map(prod => ({
      ...prod,
      preco: Number(prod.preco),
      quantidade: Number(prod.quantidade),
      img: `/imagens/${prod.img}`,  // ajusta caminho para pasta pública
      categoria: prod.categoria.toLowerCase()
    }));

    res.json(produtos);
  } catch (err) {
    console.error('Erro ao ler CSV:', err);
    res.status(500).json({ erro: 'Erro ao ler produtos' });
  }
});

// Aqui você pode adicionar rotas para login, logout e gerenciamento de sessão

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
