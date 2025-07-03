const express = require('express');
const session = require('express-session');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const fsPromises = require('fs/promises');
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
    console.log('PRODUTOS LIDOS:', produtos); // <---- AQUI

    produtos = produtos.map(prod => ({
      ...prod,
      preco: Number(prod.preco),
      qtd: Number(prod.qtd),
      img: `/imagens/${prod.img}`,
      categoria: prod.categoria
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
        nome: user.nome,
        tipo: user.tipo.toLowerCase()
      };
      res.json({ sucesso: true, nome:user.nome, tipo: user.tipo.toLowerCase() });
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

//cadastro
app.post('/api/cadastrar', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.json({ sucesso: false, mensagem: 'Dados inválidos' });
  }

  try {
    const caminhoUsuarios = path.join(__dirname, 'dados_em_casa', 'usuarios.csv');
    const usuarios = await lerCSV(caminhoUsuarios);

    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
      return res.json({ sucesso: false, mensagem: 'Nome de usuário já existe.' });
    }

    // Adiciona novo usuário com tipo "cliente"
    const linhaNova = `\n${usuario};${senha};cliente`;
    await fsPromises.appendFile(caminhoUsuarios, linhaNova, 'utf8');

    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar.' });
  }
});

app.post('/api/adicionar-produto', async (req, res) => {
  const { id, nome, preco, qtd, img, categoria } = req.body;

  if (!nome || !preco || !img || !categoria) {
    return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const caminhoCSV = path.join(__dirname, 'dados_em_casa', 'backup.csv.csv');

    // Linha no formato: id;nome;preco;quantidade;img;categoria
    const novaLinha = `\n${id};${nome};${preco};${qtd};${img};${categoria}`;
    await fsPromises.appendFile(caminhoCSV, novaLinha, 'utf8');

    res.json({ sucesso: true, mensagem: 'Produto adicionado com sucesso!' });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar produto.' });
  }
});




const salvarCSV = async (caminho, dados) => {
  const cabecalho = 'id;nome;preco;qtd;img;categoria\n';

  const linhas = dados.map(prod =>
    `${prod.id};${prod.nome};${prod.preco};${prod.qtd};${prod.img.replace(/^\/?imagens\//, '')};${prod.categoria}`
  );

  const conteudo = cabecalho + linhas.join('\n');

  await fsPromises.writeFile(caminho, conteudo, 'utf8');
};


app.post('/api/editar-produto', async (req, res) => {
  const { id, nome, preco, qtd, img, categoria } = req.body;

  if (!id || !nome || !preco || !img || !categoria) {
    return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const caminhoCSV = path.join(__dirname, 'dados_em_casa', 'backup.csv.csv');
    let produtos = await lerCSV(caminhoCSV);
    console.log(produtos)
    const index = produtos.findIndex(prod => prod.id == id);
    if (index === -1) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
    }

    produtos[index] = { id, nome, preco, qtd, img, categoria };

    // Aqui você chama salvarCSV com os dados atualizados
    await salvarCSV(caminhoCSV, produtos);

    res.json({ sucesso: true, mensagem: 'Produto editado com sucesso!' });
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao editar produto.' });
  }
});


app.post('/api/apagar-produto', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do produto obrigatório' });
  }

  try {
    const caminhoCSV = path.join(__dirname, 'dados_em_casa', 'backup.csv.csv');

    // Lê todos os produtos
    let produtos = await lerCSV(caminhoCSV);

    // Remove o produto pelo id
    produtos = produtos.filter(prod => prod.id != id);

    // Reatribui ids sequenciais a partir de 1 (opcional)
    produtos.forEach((prod, i) => {
      prod.id = (i + 1).toString();
    });

    // Recria o conteúdo do CSV (com cabeçalho)
    const cabecalho = 'id;nome;preco;qtd;img;categoria\n';
    const linhas = produtos.map(p => `${p.id};${p.nome};${p.preco};${p.qtd};${p.img};${p.categoria}`);

    // Sobrescreve o CSV inteiro
    await fsPromises.writeFile(caminhoCSV, cabecalho + linhas.join('\n'), 'utf8');

    res.json({ sucesso: true, mensagem: 'Produto apagado com sucesso!' });
  } catch (err) {
    console.error('Erro ao apagar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao apagar produto.' });
  }
});
