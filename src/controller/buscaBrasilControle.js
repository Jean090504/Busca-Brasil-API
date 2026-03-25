/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por buscar cidades, estados e afins do brasil
* Data: 18/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

//Importando banco de dados 
const { listaDeEstados } = require("../../model/estados_cidades")
const bancoDeDados = listaDeEstados

exports.getListaDeEstados = (req, res) =>{
    let listaSiglas = []

    bancoDeDados.estados.forEach((itemEstados) => {
        listaSiglas.push(itemEstados.sigla)
    })

    res.status(200).json({
        uf: listaSiglas,           
        quantidade: listaSiglas.length
    })
}

exports.getDadosEstado = (req,res) =>{
    let siglaBusca = req.params.uf
    let estadoEncontrado = false

    if (!siglaBusca) 
        return res.status(404).json({ message: "A sigla do estado é obrigatória." })

    bancoDeDados.estados.forEach((itemEstado) => {
        if (itemEstado.sigla.toUpperCase() == siglaBusca.toUpperCase()) {
            estadoEncontrado = {
                uf: itemEstado.sigla,
                descricao: itemEstado.nome,
                capital: itemEstado.capital,
                regiao: itemEstado.regiao
            }
        }
       
    })
    
    if(estadoEncontrado){
        res.status(200).json(estadoEncontrado)
    }else{
        res.status(404).json({
            status: 404,
            message: "Não foi possível encontrar o estado solicitado!"
        })
    }

}

exports.getCapitalEstado = (req, res) =>{
    let siglaBusca = req.params.uf

    // O .find() para assim que encontra o primeiro item correspondente
    const itemEstado = bancoDeDados.estados.find(item => 
        item.sigla.toUpperCase() === siglaBusca.toUpperCase()
    )

    if (itemEstado) {
        res.status(200).json({
            uf: itemEstado.sigla,
            descricao: itemEstado.nome,
            capital: itemEstado.capital
        })
    } else {
        res.status(404).json({ status: 404, message: "Estado não encontrado!" })
    }
}

exports.getEstadosRegiao = (req, res) =>{
    let regiaoBusca = req.params.regiao
    let estadosEncontrados = []
    let nomeRegiao = ""
    let regiaoEncontrada = false

    if (!regiaoEncontrada) 
        return res.status(404).json({ message: "A regiao do estado é obrigatória." })

    bancoDeDados.estados.forEach((itemRegiao) => {
        // Verifica se o estado pertence à região buscada
        if (itemRegiao.regiao.toLowerCase() == regiaoBusca.toLowerCase()) {
            regiaoEncontrada = true
            nomeRegiao = itemRegiao.regiao
            
            //  Adiciona o objeto formatado ao nosso array acumulador
            estadosEncontrados.push({
                uf: itemRegiao.sigla,
                descricao: itemRegiao.nome
            })
        }
    })

    if (regiaoEncontrada) {
        res.status(200).json({
            regiao: nomeRegiao,
            estados: estadosEncontrados
    })
    } else{
        res.status(404).json({
            status: 404,
            message: "Não foi possível encontrar o estado solicitado!"
        })
    }
}

exports.getCapitalPais = (req, res) =>{
    let capitaisEncontradas = []
    let capitalErro = false

    bancoDeDados.estados.forEach((itemCapitais) =>{

        if (itemCapitais.capital_pais) {
            capitalErro = true

            capitaisEncontradas.push({
                capital_atual: itemCapitais.capital_pais.capital,
                uf: itemCapitais.sigla,
                descricao: itemCapitais.nome,
                capital: itemCapitais.capital,
                regiao: itemCapitais.regiao,
                capital_pais_inicio: itemCapitais.capital_pais.ano_inicio,
                capital_pais_termino: itemCapitais.capital_pais.ano_fim
            })
        }
    })
    
    if (capitalErro) {
        res.status(200).json({
            quantidade: capitaisEncontradas.length,
            capitais: capitaisEncontradas
    })
    } else{
        res.status(404).json({
            status: 404,
            message: "Não foi possível encontrar o estado solicitado!"
        })
    }
}

exports.getListaCidades = (req, res) =>{
    let siglaBusca = req.params.uf
    let cidadesEncontradas = []
    let sigla = ""
    let descricao = ""
    let quantidade 
    let statusEncontrado = false

    if (siglaBusca == undefined || siglaBusca == "") 
        return res.status(400).json({ message: "A sigla do estado é obrigatória." })
    
    bancoDeDados.estados.forEach((itemSigla) => {
        if(itemSigla.sigla.toUpperCase() == siglaBusca.toUpperCase()){
            statusEncontrado = true

            sigla = itemSigla.sigla
            descricao = itemSigla.nome
                
            itemSigla.cidades.forEach((cidadeEncontrada) => {
                cidadesEncontradas.push(cidadeEncontrada.nome)
            })

            quantidade = cidadesEncontradas.length

        }
    })

    if (statusEncontrado) {
        res.status(200).json({
            uf: sigla,
            descricao: descricao,
            quantidade_cidades: quantidade,
            cidades: cidadesEncontradas
    })
    } else{
        res.status(404).json({
            status: 404,
            message: "Não foi possível encontrar o estado solicitado!"
        })
    }
}
