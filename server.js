const express = require('express');
const session = require('express-session');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: 'segredo-trabalho',
  resave: false,
  saveUninitialized: true
}));

// Função para ler qualquer CSV com separador ;
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

// Rota: Produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const caminhoCSV = path.join(__dirname, 'dados_em_casa', 'backup.csv.csv');
    let produtos = await lerCSV(caminhoCSV);

    produtos = produtos.map(prod => ({
      ...prod,
      preco: Number(prod.preco),
      quantidade: Number(prod.quantidade),
      img: `/imagens/${prod.img}`,
      categoria: prod.categoria.toLowerCase()
    }));

    res.json(produtos);
  } catch (err) {
    console.error('Erro ao ler CSV:', err);
    res.status(500).json({ erro: 'Erro ao ler produtos' });
  }
});

// Rota: Login
app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const caminhoUsuarios = path.join(__dirname, 'dados_em_casa', 'usuarios.csv');
    
    const usuarios = await lerCSV(caminhoUsuarios);
    
    const user = usuarios.find(u => u.nome === usuario && u.senha === senha);
    console.log(user);
    if (user) {
      req.session.usuario = {
        nome: user.usuario,
        tipo: user.tipo.toLowerCase()
      };
      res.json({ sucesso: true, tipo: user.tipo.toLowerCase() });
    } else {
      res.json({ sucesso: false });
    }
  } catch (err) {
    console.error('Erro ao processar login:', err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
});

// Rota: Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ sucesso: true });
  });
});

// Rota: Verificação de login
app.get('/api/usuario', (req, res) => {
  if (req.session.usuario) {
    res.json({ logado: true, usuario: req.session.usuario });
  } else {
    res.json({ logado: false });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

