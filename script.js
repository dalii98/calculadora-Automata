const operaciones = {
    alfabeto: ['Subconjunto', 'Pertenencia', 'Unión', 'Intersección', 'Complemento', 'Diferencia', 'Diferencia Simétrica'],
    cadena: ['Longitud', 'Concatenación', 'Potencia', 'Inversa'],
    lenguaje: ['Concatenación', 'Potenciación', 'Inversa', 'Unión', 'Intersección', 'Resta', 'Clausura de Kleene', 'Clausura Positiva']
};

const descripciones = {
    alfabeto: {
        'Subconjunto': 'B es subconjunto de A si todos los elementos de B están presentes en A. Verificar si B ⊆ A',
        'Pertenencia': 'Determina si un elemento específico se encuentra dentro del conjunto A. Verificar si el elemento x ∈ B',
        'Unión': 'Conjunto que contiene todos los elementos de A y de B sin repetir.',
        'Intersección': 'Conjunto que contiene solo los elementos que están en A y en B simultáneamente.',
        'Complemento': 'Elementos que le faltan al conjunto B para ser igual al conjunto Universo (A).',
        'Diferencia': 'Elementos que pertenecen a A pero que no están en B.',
        'Diferencia Simétrica': 'Elementos que están en A o en B, pero no en ambos.'
    },
    cadena: {
        'Longitud': 'Representa el número de caracteres que componen la cadena (λ si es vacía).',
        'Concatenación': 'Une dos cadenas de texto pegando la segunda al final de la primera.',
        'Potencia': 'Concatena la cadena consigo misma "n" veces.',
        'Inversa': 'Escribe la cadena en orden contrario (reflejo).'
    },
    lenguaje: {
        'Concatenación': 'Forma un nuevo lenguaje combinando cada palabra de L1 con cada palabra de L2.',
        'Potenciación': 'Es el producto cartesiano del lenguaje consigo mismo n veces.',
        'Inversa': 'Invierte cada una de las palabras que pertenecen al lenguaje.',
        'Unión': 'Agrupa todas las palabras de ambos lenguajes.',
        'Intersección': 'Palabras que aparecen en ambos lenguajes al mismo tiempo.',
        'Resta': 'Palabras que están en el segundo lenguaje pero no en el primero.',
        'Clausura de Kleene': 'Conjunto de todas las cadenas posibles sobre el lenguaje, incluyendo la cadena vacía.',
        'Clausura Positiva': 'Conjunto de todas las cadenas posibles sobre el lenguaje, excluyendo la cadena vacía.'
    }
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

/**------------------------ INICIO SECCION DE ALFABETO --------------------------**/
function procesarAlfabeto(op, val1, val2) {
    const A = convertirAConjunto(val1);
    const B = convertirAConjunto(val2);
    let resultadoRaw = [];
    let error = null;

    switch (op) {

        case 'Subconjunto':
 	    const errorSub = validarEntradas(A, B, { n1: "Conjunto A", n2: "Conjunto B" });
            if (errorSub) return errorSub;
            return verificarSubconjunto(A, B);

        case 'Pertenencia':
	    const errorPer = validarEntradas(val2, A, { n1: "Elemento", n2: "Conjunto A" });
            if (errorPer) return errorPer;
            return verificarPertenencia(val2, A);

        case 'Unión':
            error = validarEntradas(A, B);
            if (error) return error;
            return formatearSalida("A ∪ B", calcularUnion(A, B));

        case 'Intersección':
            error = validarEntradas(A, B);
            if (error) return error;
            return formatearSalida("A ∩ B", calcularInterseccion(A, B));

        case 'Complemento':
            // val1 es Universo, val2 es B
            error = validarEntradas(A, B, { n1: "Universo Σ", n2: "Conjunto B" });
            if (error) return error;
            return formatearSalida("B'", calcularComplemento(A, B));

        case 'Diferencia':
            error = validarEntradas(A, B);
            if (error) return error;
            return formatearSalida("A \\ B", calcularDiferencia(A, B));

        case 'Diferencia Simétrica':
            error = validarEntradas(A, B);
            if (error) return error;
            return formatearSalida("A ⊕ B", calcularDiferenciaSimetrica(A, B));

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
    // Si el elemento contiene una coma, asumimos que intentó ingresar varios
    if (elemento.includes(',')) {
        return "Error: Para Pertenencia, solo debe ingresar UN elemento en el segundo campo.";
    }

    // Normalizamos para la comparación
    const e = elemento.trim().toLowerCase();

    // Convertimos el conjunto a minúsculas para una comparación justa
    const conjuntoNormalizado = conjunto.map(item => item.trim().toLowerCase());

    if (conjuntoNormalizado.includes(e)) {
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
    // El complemento son los elementos que están en el Universo pero NO en B
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

/**------------------------ FIN SECCION DE ALFABETO ------------------------**/

/**------------------------ INICIO SECCION DE CADENA --------------------------**/
function procesarCadena(op, val1, val2) {
    // val1 cadena principal (w)
    // val2 cadena secundaria o el exponente (n)
    let error = null;
    switch (op) {
        case 'Longitud':
            if (!val1.trim()) return "( λ ) Por favor ingrese la cadena de texto";
            return `|w| = ${obtenerLongitud(val1)}`;

        case 'Concatenación':
            error = validarEntradas(val1, val2, { n1: "Cadena w₁", n2: "Cadena w₂" });
            if (error) return error;
            return `w₁w₂ = ${concatenarCadenas(val1, val2)}`;

        case 'Potencia':
            // Validamos que ambos campos tengan datos
            const errorPotCadena = validarEntradas(val1, val2, { n1: "Cadena w", n2: "Exponente n" });
            if (errorPotCadena) return errorPotCadena;

            // Validación extra: ¿Es n un número?
            if (isNaN(val2) || parseInt(val2) < 0) {
        	return "Error: El exponente n debe ser un número entero (0 o mayor).";
            }

            const pot = calcularPotenciaCadena(val1, val2);
            return `w^${val2} = ${pot}`;

        case 'Inversa':
            if (!val1.trim()) return "Por favor ingrese la cadena w";
            return `w⁻¹ = ${obtenerInversa(val1)}`;

        default:
            return "Operación de cadena no reconocida";
    }
}

function obtenerLongitud(w) {
    return (w.length === 0) ? 'λ' : w.length;
}

function obtenerInversa(w) {
    const limite_print = 100;
    
    // split('') convierte a array, reverse() lo voltea, join('') lo vuelve string
    let inversaCompleta = w.split('').reverse().join('');

    // 2. Aplicamos la restricción de salida
    if (inversaCompleta.length > limite_print) {
        // Tomamos los primeros 20 caracteres y añadimos puntos suspensivos
        const truncado = inversaCompleta.substring(0, limite_print);
        return `${truncado}... (Truncado, longitud total: ${inversaCompleta.length})`;
    }

    return inversaCompleta;
}

function concatenarCadenas(w1, w2) {
    return w1 + w2;
}

function calcularPotenciaCadena(w, n) {
    const exponente = parseInt(n);
    const limite_visual = 100;
    const LIMITE_SEGURIDAD_EXPONENTE = 10000;
    // En lenguajes formales, la potencia 0 de cualquier cadena es la cadena vacía (λ)
    if (isNaN(exponente) || exponente <= 0) {
        return "λ";
    }

    // Validación de seguridad para evitar RangeError
    if (exponente > LIMITE_SEGURIDAD_EXPONENTE) {
        const longitudEstimada = w.length * exponente;
        return `w^${exponente} = ${w.repeat(5)}... (Resultado demasiado grande para procesar. Longitud total estimada: ${longitudEstimada})`;
    }

    let resultadoReal = w.repeat(exponente);
    if (resultadoReal.length > limite_visual) {
        const truncado = resultadoReal.substring(0, limite_visual);
        return `${truncado}... (Resultado truncado por rendimiento. Longitud total: ${resultadoReal.length})`;
    }

    return resultadoReal;
}

/**------------------------ FIN SECCION DE CADENA ------------------------**/

/**----------------------- INICIO SECCION DE LENGUAJE ---------------------**/
function procesarLenguaje(op, val1, val2) {
    const L1 = convertirAConjunto(val1);
    const L2 = convertirAConjunto(val2);
    let resultadoRaw = [];
    let prefijo = "";

    switch (op) {
        case 'Unión':
            error = validarEntradas(L1, L2, { n1: "Lenguaje L₁", n2: "Lenguaje L₂" });
            if (error) return error;
            return formatearSalida("L₁ ∪ L₂", calcularUnion(L1, L2));

        case 'Intersección':
            error = validarEntradas(L1, L2, { n1: "Lenguaje L₁", n2: "Lenguaje L₂" });
            if (error) return error;
            return formatearSalida("L₁ ∩ L₂", calcularInterseccion(L1, L2));

        case 'Resta':
            error = validarEntradas(L1, L2, { n1: "Lenguaje L₁", n2: "Lenguaje L₂" });
            if (error) return error;
            return formatearSalida("L₂ - L₁", calcularDiferencia(L2, L1));

        case 'Inversa':
            if (L1.length === 0) return "Por favor ingrese el Lenguaje L₁";
            return formatearSalida("L⁻¹", calcularInversaLenguaje(L1));

        case 'Concatenación':
            error = validarEntradas(L1, L2, { n1: "Lenguaje L₁", n2: "Lenguaje L₂" });
            if (error) return error;
            return formatearSalida("L₁L₂", concatenarLenguajes(L1, L2));

        case 'Potenciación':
            // Validamos: val1 (exponente) y L2 (lenguaje)
    	    const errorPotLenguaje = validarEntradas(val1, L2, { n1: "Exponente n", n2: "Lenguaje L" });
    	    if (errorPotLenguaje) return errorPotLenguaje;

    	    if (isNaN(val1) || parseInt(val1) < 0) {
        	return "Error: El exponente n debe ser un número entero (0 o mayor).";
    	    }

    	    const resPotencia = calcularPotenciaLenguaje(L2, val1);
    
    	    // Verificamos si el resultado es un array y si el último elemento indica truncado
    	    const esParcial = Array.isArray(resPotencia) && 
                     resPotencia.length > 0 && 
                     String(resPotencia[resPotencia.length - 1]).includes("...");
    
    	    const mensajeExtra = esParcial ? " (Muestra parcial)" : "";
    	    return formatearSalida(`L^${val1}`, resPotencia) + mensajeExtra;

        case 'Clausura de Kleene':
            if (L1.length === 0) return "Por favor ingrese el Lenguaje L";
            return `${formatearSalida("L*", calcularClausuras(L1, 'Clausura de Kleene')).replace('}', '')} ... }`;

        case 'Clausura Positiva':
            if (L1.length === 0) return "Por favor ingrese el Lenguaje L";
            return `${formatearSalida("L⁺", calcularClausuras(L1, 'Clausura Positiva')).replace('}', '')} ... }`;

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

/**----------------------- FIN SECCION DE LENGUAJE ----------------------------**/


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
    const descripcionTexto = descripciones[cat][op] || "";

    //Ingresamos el titulo con el icono para la descripcion
    tituloOperacion.innerHTML = `
        ${cat.toUpperCase()}: ${op}
        <div class="tooltip-container">
            <span class="icon-info">i</span>
            <span class="tooltip-text">${descripcionTexto}</span>
        </div>
    `;

    resultadoContainer.style.display = 'none';

    const esSimple = ['Longitud', 'Inversa', 'Clausura de Kleene', 'Clausura Positiva'].includes(op);
    const esPotenciaCadena = (op === 'Potencia');
    const esPotenciaLenguaje = (op === 'Potenciación');
    const esComplemento = (op === 'Complemento');
    const esPertenencia = (op === 'Pertenencia');

    let html = '';
    let ayudaVisual = "";

    if (esSimple) {
        html += `<input type="text" id="in1" placeholder="Ingrese valor...">`;
    } else if (esComplemento) {
        html += `
	    <input type="text" id="in1" placeholder="Universo Σ">
            <input type="text" id="in2" placeholder="Base / Conjunto">
        `;
    } else if (esPotenciaCadena) {
        html += `
	    <input type="text" id="in1" placeholder="Base / Conjunto">  
            <input type="text" id="in2" placeholder="Exponente n">
        `;
    } else if (esPotenciaLenguaje) {
        html += `
	    <input type="text" id="in2" placeholder="Base / Conjunto">  
            <input type="text" id="in1" placeholder="Exponente n">
        `;
    } else if (esPertenencia) {
        html += `
            ${ayudaVisual}
            <input type="text" id="in1" placeholder="Conjunto A (ej: a, b, c)">
            <input type="text" id="in2" placeholder="Elemento a buscar (Un solo elemento)">
        `;
    } else {
        html += `
            ${ayudaVisual}
            <input type="text" id="in1" placeholder="Conjunto A: separados por comas">
            <input type="text" id="in2" placeholder="Conjunto B: separados por comas">
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

function validarEntradas(val1, val2, nombres = { n1: "A", n2: "B" }) {
    // Validar primera entrada (sea Arreglo o String)
    if (!val1 || (Array.isArray(val1) && val1.length === 0) || (typeof val1 === "string" && val1.trim() === "")) {
        return `Por favor ingrese el valor de: ${nombres.n1}`;
    }
    // Validar segunda entrada
    if (!val2 || (Array.isArray(val2) && val2.length === 0) || (typeof val2 === "string" && val2.trim() === "")) {
        return `Por favor ingrese el valor de: ${nombres.n2}`;
    }
    return null; 
}
