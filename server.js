/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar local do meu servidor
* Data: 25/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const app = require('./src/app')

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => console.log(`Servidor em https://localhost:${PORT}`));