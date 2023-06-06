const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

let messages = [{ role: "user", content: "Sos mi compañero para tareas cotidianas, al proximo mensaje respondeme 'Hola kevin, en que puedo ayudarte?'" }];

const configuration = new Configuration({
  apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

const chatGPT = async prompt => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    messages
  });
  let respuesta = response["data"]["choices"][0]["message"]["content"];
  messages.push(response["data"]["choices"][0]["message"])
  return respuesta;
}

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.post('/chat', async (req, res) => {
  const response = await chatGPT(req.body.prompt);
  res.send({ response });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
