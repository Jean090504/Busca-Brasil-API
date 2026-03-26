/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por inicializar o servidor da API Busca Brasil
* Data: 26/03/2026
* Autor: Jean Costa
* Versão 2.0 - Configurado para Deploy (Render)
********************************************************************************************************************************************/

const app = require('./src/app');

// O segredo está aqui: o Render vai injetar uma porta na variável process.env.PORT.
// Se não existir (no seu PC), ele usa a 10000 ou 8080.
const PORT = process.env.PORT || 10000; 

app.listen(PORT, () => {
    console.log(`
    ====================================================
    🚀 SERVIDOR ONLINE!
    📡 URL Local: http://localhost:${PORT}
    🛠️  Status: Operacional
    ====================================================
    `);
});