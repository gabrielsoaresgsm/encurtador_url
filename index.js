const express = require('express');
const app = express();
const cors = require('cors');
const shortid = require('shortid');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors({ origin: '*' }));
app.use(express.json());

const links = [];
const users = [];

app.post('/url', (req, res) => {
  if (!req.body.link) {
    res.status(400).json({ error: 'O link é obrigatório' });
    return;
  }
  const link = req.body.link;
  const id = shortid.generate();

  links.push({ id, link });

  res.status(201).json({ link: `http://localhost:3000/url/${id}` });
});

app.post('/users', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' });
    return;
  }
  const user = users.find(u => u.email === email);
  if (user) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return;
  }
  users.push({ email, password });
  res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' });
    return;
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }
  res.status(200).json({ message: 'Login realizado com sucesso' });
});

// Método GET de usuários através do email
app.get('/users/:email', (req, res) => {
  const email = req.params.email;
  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  } else {
    res.status(200).json({ email: user.email });
  }
});

app.get('/url/:id', (req, res) => {
  const id = req.params.id;
  const link = links.find(l => l.id === id);
  if (!link) {
    res.status(404).json({ error: 'Link não encontrado' });
  } else {
    res.status(200).json({link_encurtado: `http://localhost:3000/url/${id}`})
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('API de encurtador de links rodando na porta 3000');
});