const express = require('express');
const app = express();
const cors = require('cors');
const shortid = require('shortid');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors());
app.use(express.json());

const links = [];

app.post('/url', (req, res) => {
  const link = req.body.link;
  const id = shortid.generate();

  links.push({id, link});

  res.status(201).json({id});
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const link = links.find(l => l.id === id);

  if (!link) {
    res.status(404).json({error: 'Link não encontrado'});
  } else {
    res.redirect(link.link);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('API de encurtador de links rodando na porta 3000');
});