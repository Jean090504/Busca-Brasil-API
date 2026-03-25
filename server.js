/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar local do meu servidor
* Data: 25/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const app = require('./src/app')
const PORT = 8080

app.listen(PORT, () => {
    console.log(`
        *******************************************************
        * API Busca Brasil - Jean Costa                       *
        * Servidor rodando na porta ${PORT}                      *
        * Acesse: http://localhost:${PORT}/buscaBrasil/estados  *
        *******************************************************
        `)
})