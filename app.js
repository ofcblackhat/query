const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal que renderiza a página inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para execução da query
app.post('/execute-query', (req, res) => {
  const { host, port, user, password, database, query } = req.body;

  // Configuração do MySQL com pool de conexões baseado nos dados fornecidos
  const db = mysql.createPool({
    connectionLimit: 10, // número máximo de conexões simultâneas
    host,
    port,
    user,
    password,
    database
  });

  // Executa a query no banco de dados utilizando pool
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Erro ao executar a query' });
    } else {
      res.status(200).json({ success: true, data: result });
    }
  });
});

// Inicia o servidor com nodemon
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
