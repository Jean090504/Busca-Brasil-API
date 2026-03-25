/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API
* Data: 25/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerBusca = require('../controller/buscaBrasilControle.js')


// Listar estados
rota.get('/estados', controllerBusca.getListaDeEstados)

// Buscar dados do estado (Ex: /buscaBrasil/estado/SP)
rota.get('/estadoDesc/:uf', controllerBusca.getDadosEstado)

// Buscar CAPITAL do estado 
rota.get('/capital/estado/:uf', controllerBusca.getCapitalEstado)

// Buscar por região
rota.get('/estados/regiao/:regiao', controllerBusca.getEstadosRegiao)

// Capitais do País
rota.get('/capitalPais', controllerBusca.getCapitalPais)

// Listar Cidades
rota.get('/cidades/:uf', controllerBusca.getListaCidades)

module.exports = rota