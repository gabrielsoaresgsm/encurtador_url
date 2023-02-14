const express = require('express');
const app = express();
const cors = require('cors');
const shortid = require('shortid');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors({ origin: '*' }));
app.use(express.json());

const links = [];

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


app.get('/url/:id', (req, res) => {
  const id = req.params.id;
  const link = links.find(l => l.id === id);
  console.log(link)
  if (!link) {
    res.status(404).json({ error: 'Link não encontrado' });
  } else {
    // res.redirect(link.link);
    res.status(200).json({link_encurtado: `http://localhost:3000/url/${id}`})
  }

});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('API de encurtador de links rodando na porta 3000');
});