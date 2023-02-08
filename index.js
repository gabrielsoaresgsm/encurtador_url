const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(bodyParser.json());

const urlShortener = {};
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BASE = ALPHABET.length;

function generateShortUrl(id) {
  let shortUrl = '';
  while (id > 0) {
    shortUrl = ALPHABET[id % BASE] + shortUrl;
    id = Math.floor(id / BASE);
  }
  return shortUrl;
}

app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json({message: 'Usuário cadastrado com sucesso!'});
});

app.post('/url', (req, res) => {
  const longUrl = req.body.url;
  let id = users.length;
  let shortUrl = generateShortUrl(id);
  urlShortener[shortUrl] = longUrl;
  res.status(201).json({shortUrl});
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('API de cadastro de usuários rodando na porta 3000');
});