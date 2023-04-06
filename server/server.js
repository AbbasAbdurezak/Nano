import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,  OpenAIApi } from 'openai';

dotenv.config();

//const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-cGS7d2elOiwgggWRnWvVgEr5",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
//console.log(process.env.OPENAI_API_KEY)

//const configuration = new Configuration({
  //  apiKey: process.env.OPENAI_API_KEY,
//});

//const openai = new OpenAIApi(Configuration);






const app = express();
app.use(cors());
app.use(express.json());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const port = 5050;

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from codex',
    })
});

app.post('/', async(req, res) => {
    try{
        const prompt = req.body.prompt;

        const respoense = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 1,
            max_tokens: 3563,
            top_p: 1,
            best_of: 10,
            frequency_penalty: 0.2,
            presence_penalty: 2,

        });

        res.status(200).send({
            bot: respoense.data.choices[0].text
        })
    } catch (error){
         console.log(error);
         res.status(500).send( {error} )
    }
})

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
});