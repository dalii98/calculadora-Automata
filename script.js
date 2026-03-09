const operaciones = {
    alfabeto: ['Subconjunto', 'Pertenencia', 'Unión', 'Intersección', 'Complemento', 'Diferencia', 'Diferencia Simétrica'],
    cadena: ['Longitud', 'Concatenación', 'Potencia', 'Inversa'],
    lenguaje: ['Concatenación', 'Potenciación', 'Inversa', 'Unión', 'Intersección', 'Resta', 'Clausura de Kleene', 'Clausura Positiva']
};

const mainNav = document.getElementById('main-nav');
const sidebar = document.getElementById('sidebar');
const btnLimpiar = document.getElementById('btn-limpiar');
const inputsContainer = document.getElementById('inputs-container');
const tituloOperacion = document.getElementById('titulo-operacion');
const resultadoContainer = document.getElementById('resultado-container');
const resultadoTexto = document.getElementById('resultado-texto');

// EVENTOS PRINCIPALES
mainNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        cambiarSeccion(e.target.getAttribute('data-seccion'));
    }
});

btnLimpiar.addEventListener('click', limpiar);


/** INICIO SECCION DE ALFABETO **/
function procesarAlfabeto(op, val1, val2) {
    const A = convertirAConjunto(val1);
    const B = convertirAConjunto(val2);
    let resultadoRaw = [];

    switch (op) {

        case 'Subconjunto':
            return verificarSubconjunto(A, B);

        case 'Pertenencia':
            return verificarPertenencia(val2, A);

        case 'Unión':
            resultadoRaw = calcularUnion(A, B);
            return formatearSalida("A ∪ B", resultadoRaw);

        case 'Intersección':
            resultadoRaw = calcularInterseccion(A, B);
            return formatearSalida("A ∩ B", resultadoRaw);

        case 'Complemento':
            // En este caso val1 es el Universo y val2 el conjunto B
            resultadoRaw = calcularComplemento(A, B);
            return formatearSalida("B'", resultadoRaw);

        case 'Diferencia':
            resultadoRaw = calcularDiferencia(A, B);
            return formatearSalida("A \\ B", resultadoRaw);

        case 'Diferencia Simétrica':
            resultadoRaw = calcularDiferenciaSimetrica(A, B);
            return formatearSalida("A ⊕ B", resultadoRaw);

        default:
            return "Operación no reconocida";
    }
}

function verificarSubconjunto(A, B) {
    // B es subconjunto de A si TODOS los elementos de B están en A
    const esSub = B.every(elemento => A.includes(elemento));
    return esSub ? "B ⊆ A (Es subconjunto)" : "B ⊈ A (No es subconjunto)";
}

function verificarPertenencia(elemento, conjunto) {
    const e = elemento.trim().toLowerCase();
    if (conjunto.includes(e)) {
        return `El elemento "${elemento}" ∈(Pertenece) al conjunto`;
    }
    return `El elemento "${elemento}" ∉(No Pertenece) al conjunto`;
}

function calcularUnion(A, B) {
    const combinacion = [...A, ...B];
    return [...new Set(combinacion)];
}

function calcularInterseccion(A, B) {
    return A.filter(elemento => B.includes(elemento));
}

function calcularComplemento(Universo, B) {
    // El complemento son los elementos que están en el Universo pero NO en A
    return calcularDiferencia(Universo, B);
}

function calcularDiferencia(A, B) {
    return A.filter(elemento => !B.includes(elemento));
}

function calcularDiferenciaSimetrica(A, B) {
    // (A - B) U (B - A)
    const parte1 = calcularDiferencia(A, B);
    const parte2 = calcularDiferencia(B, A);
    return calcularUnion(parte1, parte2);
}
/** FIN SECCION DE ALFABETO **/

/** INICIO SECCION DE CADENA **/
function procesarCadena(op, val1, val2) {
    // val1 cadena principal (w)
    // val2 cadena secundaria o el exponente (n)
    switch (op) {
        case 'Longitud':
            const len = obtenerLongitud(val1);
            return `|w| = ${len}`;

        case 'Concatenación':
            const concat = concatenarCadenas(val1, val2);
            return `w₁w₂ = ${concat}`;

        case 'Potencia':
            const pot = calcularPotenciaCadena(val1, val2);
            const nDisplay = val2 || 'n';
            // Si el resultado contiene el paréntesis de advertencia, lo usamos tal cual
            return `w^${nDisplay} = ${pot}`;

        case 'Inversa':
            const inv = obtenerInversa(val1);
            return `w⁻¹ = ${inv}`;

        default:
            return "Operación de cadena no reconocida";
    }
}

function obtenerLongitud(w) {
    return (w.length === 0) ? 'λ' : w.length;
}

function obtenerInversa(w) {
    // split('') convierte a array, reverse() lo voltea, join('') lo vuelve string
    return w.split('').reverse().join('');
}

function concatenarCadenas(w1, w2) {
    return w1 + w2;
}

function calcularPotenciaCadena(w, n) {
    const exponente = parseInt(n);
    const limite_visual = 100;
    // En lenguajes formales, la potencia 0 de cualquier cadena es la cadena vacía (λ)
    if (isNaN(exponente) || exponente <= 0) {
        return "λ";
    }

    let resultadoReal = w.repeat(exponente);
    if (resultadoReal.length > limite_visual) {
        const truncado = resultadoReal.substring(0, limite_visual);
        return `${truncado}... (Resultado truncado por rendimiento. Longitud total: ${resultadoReal.length})`;
    }

    return resultadoReal;
}
/** FIN SECCION DE CADENA **/

/** INICIO SECCION DE LENGUAJE **/
function procesarLenguaje(op, val1, val2) {
    const L1 = convertirAConjunto(val1);
    const L2 = convertirAConjunto(val2);
    let resultadoRaw = [];
    let prefijo = "";

    switch (op) {
        case 'Unión':
            resultadoRaw = calcularUnion(L1, L2); // Reutiliza la de Alfabetos
            return formatearSalida("L₁ ∪ L₂", resultadoRaw);

        case 'Intersección':
            resultadoRaw = calcularInterseccion(L1, L2); // Reutiliza la de Alfabetos
            return formatearSalida("L₁ ∩ L₂", resultadoRaw);

        case 'Resta':
            resultadoRaw = calcularDiferencia(L2, L1); // Reutiliza la de Alfabetos
            return formatearSalida("L₂ - L₁", resultadoRaw);

        case 'Inversa':
            resultadoRaw = calcularInversaLenguaje(L1);
            return formatearSalida("L⁻¹", resultadoRaw);

        case 'Concatenación':
            resultadoRaw = concatenarLenguajes(L1, L2);
            return formatearSalida("L₁L₂", resultadoRaw);

        case 'Potenciación':
            const resPotencia = calcularPotenciaLenguaje(L2, val1);
            const mensajeExtra = resPotencia.includes("...") ? " (Muestra parcial)" : "";
            return formatearSalida(`L^${val1 || 'n'}`, resPotencia) + mensajeExtra;

        case 'Clausura de Kleene':
            resultadoRaw = calcularClausuras(L1, 'Clausura de Kleene');
            return `${formatearSalida("L*", resultadoRaw).replace('}', '')} ... }`;

        case 'Clausura Positiva':
            resultadoRaw = calcularClausuras(L1, 'Clausura Positiva');
            return `${formatearSalida("L⁺", resultadoRaw).replace('}', '')} ... }`;

        default:
            return "Operación de lenguaje no encontrada";
    }
}

function concatenarLenguajes(L1, L2) {
    let resultado = [];
    // Producto cartesiano de ambos conjuntos de cadenas
    L1.forEach(cadena1 => {
        L2.forEach(cadena2 => {
            resultado.push(cadena1 + cadena2);
        });
    });
    // Quitamos duplicados antes de retornar
    return [...new Set(resultado)];
}

function calcularInversaLenguaje(L) {
    // Invertimos cada cadena dentro del lenguaje
    return L.map(cadena => cadena.split('').reverse().join(''));
}

function calcularPotenciaLenguaje(L, n) {
    const exponente = parseInt(n);
    const limite_calculo = 500; // Máximo de elementos que permitiremos procesar
    const limite_visual = 25;   // Máximo de elementos que mostraremos en pantalla

    // 1. Manejo de casos base (Potencia 0 o inválida)
    if (isNaN(exponente) || exponente <= 0) {
        return ["λ"];
    }
    // 2. Lógica de cálculo
    let resultado = L;
    for (let i = 1; i < exponente; i++) {
        // Reutilizamos la función de concatenación que ya tenemos
        let proximoPaso = concatenarLenguajes(resultado, L);
        // Seguridad: Si el conjunto crece demasiado, detenemos el cálculo
        if (proximoPaso.length > limite_calculo) {
            resultado = proximoPaso; // Guardamos lo que llevamos
            break; // Salimos del bucle para no colapsar la memoria
        }
        resultado = proximoPaso;
    }

    // 3. Aplicar límite visual para el retorno
    if (resultado.length > limite_visual) {
        const truncado = resultado.slice(0, limite_visual);
        // Agregamos un indicador de que hay más elementos
        truncado.push(`... (y ${resultado.length - limite_visual} elementos más)`);
        return truncado;
    }

    return resultado;
}

function calcularClausuras(L, tipo) {
    const LIMITE_ITERACIONES = 3; // Seguridad para no bloquear el PC
    let clausura = new Set();

    if (tipo === 'Clausura de Kleene') {
        clausura.add("λ");
    }

    let actual = [""];
    for (let i = 0; i < LIMITE_ITERACIONES; i++) {
        actual = concatenarLenguajes(actual, L);
        actual.forEach(cadena => clausura.add(cadena));
    }

    return Array.from(clausura);
}

/** FIN SECCION DE LENGUAJE **/


function cambiarSeccion(seccion) {
    sidebar.innerHTML = '';
    operaciones[seccion].forEach(op => {
        const btn = document.createElement('button');
        btn.innerText = op;
        btn.addEventListener('click', () => mostrarFormulario(op, seccion));
        sidebar.appendChild(btn);
    });
}

function mostrarFormulario(op, cat) {
    tituloOperacion.innerText = `${cat.toUpperCase()}: ${op}`;
    resultadoContainer.style.display = 'none';

    const esSimple = ['Longitud', 'Inversa', 'Clausura de Kleene', 'Clausura Positiva'].includes(op);
    const esPotencia = ['Potenciación', 'Potencia'].includes(op);
    const esComplemento = (op === 'Complemento');

    let html = '';

    // Agregamos una pequeña ayuda visual según la operación
    let ayudaVisual = "";
    if (op === 'Subconjunto') ayudaVisual = `<p class="ayuda-input">Verificar si <b>B ⊆ A</b></p>`;
    if (op === 'Pertenencia') ayudaVisual = `<p class="ayuda-input">Verificar si el elemento <b>x ∈ B</b></p>`;

    if (esSimple) {
        html = `<input type="text" id="in1" placeholder="Ingrese valor...">`;
    } else if (esPotencia || esComplemento) {
        html = `
            <input type="text" id="in2" placeholder="Base / Conjunto">
            <input type="text" id="in1" placeholder="${esComplemento ? 'Universo Σ' : 'Exponente n'}">
        `;
    } else {
        html = `
            ${ayudaVisual}
            <input type="text" id="in1" placeholder="Conjunto A">
            <input type="text" id="in2" placeholder="Conjunto B">
        `;
    }

    html += `<button id="btn-ejecutar" class="btn-calcular">Calcular</button>`;
    inputsContainer.innerHTML = html;

    document.getElementById('btn-ejecutar').addEventListener('click', () => {
        const v1 = document.getElementById('in1')?.value || "";
        const v2 = document.getElementById('in2')?.value || "";
        llamarMotor(op, cat, v1, v2);
    });
}

function llamarMotor(op, cat, v1, v2) {
    let finalRes = "";
    try {
        if (cat === 'alfabeto') finalRes = procesarAlfabeto(op, v1, v2);
        else if (cat === 'cadena') finalRes = procesarCadena(op, v1, v2);
        else if (cat === 'lenguaje') finalRes = procesarLenguaje(op, v1, v2);
    } catch (err) {
        finalRes = "Error en el procesamiento de datos.";
    }

    resultadoContainer.style.display = 'block';
    resultadoTexto.innerText = finalRes;
}

// Convierte el texto de entrada en un array limpio (Set)
function convertirAConjunto(texto) {
    if (!texto) return [];
    // Convertimos a minúsculas para que la comparación sea justa
    const elementos = texto.split(',').map(item => item.trim().toLowerCase());
    return [...new Set(elementos.filter(item => item !== ""))];
}

// Formatea el array para mostrarlo como conjunto matemático {a, b, c}
function formatearSalida(prefijo, array) {
    let contenido = "";
    if (!array || array.length === 0) {
        contenido = "{ Ø }";
    } else {
        contenido = `{ ${array.join(', ')} }`;
    }
    return `${prefijo} = ${contenido}`;
}

function limpiar() {
    const inputs = inputsContainer.querySelectorAll('input');
    inputs.forEach(i => i.value = '');
    resultadoContainer.style.display = 'none';
}