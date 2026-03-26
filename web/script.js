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
    
    // Limpa a área para a nova animação de entrada
    elementos.area.innerHTML = ""

    const listaFinal = cidade.cidades || []
    const nomeCapital = estado.capital

    // Criando o container com efeito de fade
    const dashboardHTML = `
        <div class="animate-in grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="neo-card md:col-span-2 p-10 bg-emerald-500 text-black relative overflow-hidden">
                <h2 class="text-8xl font-black italic uppercase tracking-tighter opacity-20 absolute -right-4 -bottom-4 leading-none">${xss(estado.uf)}</h2>
                <span class="font-mono text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1">Origin: ${xss(estado.regiao)}</span>
                <h2 class="text-6xl font-black uppercase mt-4">${xss(estado.descricao)}</h2>
            </div>

            <div class="neo-card p-8 flex flex-col justify-center items-center text-center border-yellow-400">
                <div class="w-20 h-20 rounded-full border-2 border-yellow-400 flex items-center justify-center animate-pulse mb-4">
                    <span class="text-3xl">⭐</span>
                </div>
                <p class="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Capital Principal</p>
                <h3 class="text-4xl font-black text-white">${xss(nomeCapital)}</h3>
            </div>

            <div class="neo-card p-8 flex flex-col justify-center items-center text-center">
                <span class="text-6xl font-black text-white">${listaFinal.length}</span>
                <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Cidades Mapeadas</p>
            </div>

            <div class="neo-card md:col-span-2 p-8">
                <h3 class="font-bold text-xl text-white mb-6 flex items-center gap-4">
                    MUNICÍPIOS <div class="h-px flex-1 bg-white/10"></div>
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                    ${listaFinal.map(c => `
                        <div class="bg-white/5 border border-white/10 p-3 text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all cursor-crosshair">
                            ${xss(c)}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `

    elementos.area.innerHTML = dashboardHTML
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


