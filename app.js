const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

let messages = [
  {role: "system", content: "Sos mi asistente para todo lo que necesite. Hablas informalmente y de forma muy resumida. Todas las respuestas tienen que tener maximo 10 palabras y no deben perder sentido."}];

const configuration = new Configuration({
  apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

const chatGPT = async prompt => {
  messages.push({role: "user", content: prompt})

  let response;
  try {
    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      messages
    });
  } catch (error) {
    console.log(error)
  }
  
  
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
