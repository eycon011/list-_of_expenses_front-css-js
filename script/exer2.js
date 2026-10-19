const formDespesa = document.querySelector('#formDespesa');
const inputDescricao = document.querySelector('#inputDescricao');
const inputValor = document.querySelector('#inputValor');
const inputData = document.querySelector('#inputData');

const inputFiltroData = document.querySelector('#inputFiltroData');
const btnLimparFiltro = document.querySelector('#btnLimparFiltro');
const btnExpurgarDados = document.querySelector('#btnExpurgarDados');

const tabelaCorpo = document.querySelector('#tabelaCorpo');
const totalAcumulado = document.querySelector('#totalAcumulado');

const CHAVE_STORAGE = 'relatorio_despesas_str';

function renderizarTabela(filtroData = '') {
    tabelaCorpo.innerHTML = '';
    let totalGasto = 0;

    const textoBruto = localStorage.getItem(CHAVE_STORAGE);

    if (!textoBruto) {
        tabelaCorpo.innerHTML = `<tr><td colspan="3" class="sem-registro">Nenhuma despesa gravada</td></tr>`;
        totalAcumulado.textContent = '0.00';
        return;
    }

    const vetorDespesas = textoBruto.split('||');

    for (const item of vetorDespesas) {
        if (!item) continue;

        const partes = item.split(':');
        const descricao = partes[0];
        const valorNum = Number(partes[1]);
        const data = partes[2];

        if (filtroData !== '' && data !== filtroData) {
            continue;
        }

        totalGasto += valorNum;

        const dataFormatada = data.split('-').reverse().join('/');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${descricao}</td>
            <td>${valorNum.toFixed(2)}</td>
        `;
        tabelaCorpo.appendChild(tr);
    }

    if (tabelaCorpo.children.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="3" class="sem-registro">Nenhuma despesa gravada</td></tr>`;
    }

    totalAcumulado.textContent = totalGasto.toFixed(2);
}

formDespesa.addEventListener('submit', (e) => {
    e.preventDefault();

    const descricao = inputDescricao.value.trim().replaceAll(':', ' ');
    const valor = Number(inputValor.value);
    const data = inputData.value;

    if (!descricao || isNaN(valor) || valor <= 0 || !data) {
        alert('Preencha todos os campos!');
        return;
    }

    const novoRegistro = `${descricao}:${valor}:${data}`;
    const textoBruto = localStorage.getItem(CHAVE_STORAGE);

    const novoTextoBruto = textoBruto ? `${textoBruto}||${novoRegistro}` : novoRegistro;

    localStorage.setItem(CHAVE_STORAGE, novoTextoBruto);

    formDespesa.reset();
    renderizarTabela(inputFiltroData.value);
});

inputFiltroData.addEventListener('input', () => {
    renderizarTabela(inputFiltroData.value);
});

btnLimparFiltro.addEventListener('click', () => {
    inputFiltroData.value = '';
    renderizarTabela();
});

btnExpurgarDados.addEventListener('click', () => {
    if (confirm('Deseja apagar todas as despesas gravadas?')) {
        localStorage.removeItem(CHAVE_STORAGE);
        inputFiltroData.value = '';
        renderizarTabela();
    }
});

renderizarTabela();