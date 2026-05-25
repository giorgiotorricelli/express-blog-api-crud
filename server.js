import express from 'express';
import router from './routers/postsRouter.js';
import { sendMail } from './utils/mailSender.js';


const app = express();

const server_port = process.env.SERVER_PORT; 

app.use('/posts' , router); 

app.get('/send-mail', (request, response) => {
    sendMail(
        'samuelpanicucci88@gmail.com',
        'HAI VINTO 1 MILIONE DI EURO CLICCA SUL LINK!!!',
        'https://www.youtube.com/watch?v=S3Co7XLnIJM&list=RDS3Co7XLnIJM&start_radio=1'
    ).then(mailInfo => {
        console.log(mailInfo);
        response.json({
            messaggio: 'mail inviata correttamente'
        })
    });
});



app.listen(server_port, (error) => {
    if (error) {
        console.error(`ERRORE: la porta ${server_port} è già in utilizzo`);
        return;
    }

    console.log(`Messo in ascolto sulla porta ${server_port}`);
    
})