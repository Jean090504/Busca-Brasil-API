/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por inicializar o servidor da API Busca Brasil
* Data: 26/03/2026
* Autor: Jean Costa
* Versão 2.0 - Configurado para Deploy (Render)
********************************************************************************************************************************************/

const app = require('./src/app');

const PORT = process.env.PORT || 10000

app.listen(PORT, () => {
    console.log(`
    ====================================================
    🚀 SERVIDOR ONLINE!
    📡 URL Local: http://localhost:${PORT}
    🛠️  Status: Operacional
    ====================================================
    `)
})