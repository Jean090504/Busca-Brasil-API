"use strict"

const API_URL = "http://localhost:8080/buscaBrasil"

// Mapeamento dos elementos (Dessa forma deixa imutável)
const elementos = {
    btn: document.getElementById('btnExplorar'),
    input: document.getElementById('ufInput'),
    area: document.getElementById('resultadoArea'),
    carregamento: document.getElementById('carregamento')
} 

//Função contra XSS
const xss = (texto) => {
    const div = document.createElement('div')
    div.textContent = texto
    return div.innerHTML
}

const buscarEstado = async () => {
    const uf = elementos.input.value.trim().toUpperCase()

    //Validação de entrada
    const ufValidacao = /^[A-Z]{2}$/
    if(!ufValidacao.test(uf)){
        alert("Por favor, digite uma UF válida (ex: SP)")
        return
    }

    try{
        //Mostra estado de carregamento
        elementos.carregamento.innerHTML = "<p>Buscando dados...</p>"

        //Requisições paralelas para performace
        const [resEst, resCid] = await Promise.all([
            fetch(`${API_URL}/estadoDesc/${uf}`),
            fetch(`${API_URL}/cidades/${uf}`)
        ])

        if (!resEst.ok || !resCid.ok) 
            throw new Error("Estado não localizado.")
        
        const estado = await resEst.json()
        const cidade = await resCid.json()

        renderizarTela(estado, cidade)

    }catch (error) {
        console.error("Segurança:", error.message)
        alert(error.message)
        elementos.carregamento.innerHTML = "<p>Ocorreu um erro ao buscar os dados.</p>"
    }
}

const renderizarTela = (estado, cidade) => {
    elementos.carregamento.classList.add('hidden')
    elementos.area.classList.remove('hidden')

    // 1. Pegamos a lista bruta
    const listaBruta = cidade.cidades || cidade.cidade || []
    const nomeCapital = estado.capital

    // 2. Separamos a capital do resto da lista
    const apenasCidades = listaBruta.filter(nome => nome !== nomeCapital)
    
    // 3. Ordenamos o resto em ordem alfabética (opcional, mas recomendado)
    apenasCidades.sort((a, b) => a.localeCompare(b))

    // 4. Criamos o HTML das cidades normais
    const cidadesSeguras = apenasCidades
        .map(nome => `<div class="bg-white/5 p-3 rounded-lg text-sm text-center border border-white/10">${xss(nome)}</div>`)
        .join('')

    // Injeção controlada
    elementos.area.innerHTML = `
        <div class="md:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
            <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest">REGIÃO ${xss(estado.regiao)}</span>
            <h2 class="text-6xl font-bold mt-2">${xss(estado.descricao)}</h2>
            <div class="mt-8 flex gap-8">
                <div><p class="text-xs text-slate-500 uppercase">Sigla</p><p class="text-2xl font-semibold text-emerald-400">${xss(estado.uf)}</p></div>
                <div><p class="text-xs text-slate-500 uppercase">Cidades</p><p class="text-2xl font-semibold">${Number(cidade.quantidade_cidades)}</p></div>
            </div>
        </div>

        <div class="glass p-8 rounded-3xl flex flex-col justify-center items-center border-t-4 border-yellow-500 text-center">
            <p class="text-yellow-500 uppercase text-[10px] font-bold tracking-widest mb-2">⭐ Capital do Estado</p>
            <span class="text-3xl font-black text-white">${xss(nomeCapital)}</span>
            <p class="mt-2 text-[10px] text-slate-500 italic uppercase">Sede Administrativa</p>
        </div>

        <div class="md:col-span-3 glass p-8 rounded-3xl">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Municípios de ${xss(estado.descricao)}
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                ${cidadesSeguras}
            </div>
        </div>
    `
}

const buscarCapitaisHistoricas = async () => {
    try {
        const response = await fetch(`${API_URL}/capitalPais`)
        const dados = await response.json()

        const listaOrdenada = dados.capitais.sort((a, b) => b.capital_pais_inicio - a.capital_pais_inicio);
        renderizarCapitaisPais(listaOrdenada)

        if (response.ok) {
            renderizarCapitaisPais(dados.capitais)
        }
    } catch (error) {
        console.error("Erro ao carregar capitais históricas:", error)
    }
}

const renderizarCapitaisPais = (lista) => {
    const container = document.getElementById('resCapitaisPais')
    
    container.innerHTML = lista.map((item) => {
        // Lógica: se o ano de término não existir ou for nulo, é a capital atual
        const ehAtual = !item.capital_pais_termino
        
        return `
        <div class="relative pl-6 border-l border-white/10 pb-6 last:pb-0 mg-bottom[5px]">
            <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full ${ehAtual ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}"></div>
            
            <div class="flex items-center gap-2 mb-1">
                <p class="text-[10px] text-slate-500 font-mono uppercase">
                    ${item.capital_pais_inicio} — ${item.capital_pais_termino || 'Hoje'}
                </p>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${ehAtual ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}">
                    ${ehAtual ? 'Sede Atual' : 'Histórica'}
                </span>
            </div>

            <p class="text-xs text-cyan-500/70 font-medium mt-1">${xss(item.descricao)} (${xss(item.uf)})</p>
        </div>
        `
    }).join('')
}

buscarCapitaisHistoricas()
elementos.btn.addEventListener('click', buscarEstado)
elementos.input.addEventListener('keypress', (e) => e.key === 'Enter' && buscarEstado())


