/*******************************************************************************************************************************************
* Objetivo: Desenvolver uma API de Busca informativa Brasil
* Data: 25/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const buscaBrasilrotas = require('./routes/buscaBrasilrotas.js') 
const helmet = require('helmet')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

// Define o prefixo global da sua API
app.use('/buscaBrasil', buscaBrasilrotas)

module.exports = app