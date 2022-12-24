require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatResponse(userQuery){
    console.log("user input: " + userQuery)
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nHere is the question/prompt I need to respond to:\n"+userQuery+"......",
            temperature: 0.9,
            max_tokens: 2622,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["......"],
          })   
        const text = response.data.choices[0].text;
        console.log(text)
        return text
    } catch (error) {
        console.log(error.message)
    }
}
const { MessagingResponse } = require('twilio').twiml;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms/', async (req, res) => {
    console.log("NEW REQUEST==================");
  const twiml = new MessagingResponse();
  const response = await chatResponse(req.body.Body)
  twiml.message(response)
  console.log("END OF REQUEST==================")
  res.type('text/xml').send(twiml.toString());
});

app.listen(8000, () => {
  console.log('Express server listening on port 8000');
});