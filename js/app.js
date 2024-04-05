// Variables para almacenar los nodos, aristas y colores
let nodos = [];
let aristas = [];

// Función para agregar un nodo
function agregarNodo() {
  const nombreNodoInput = document.getElementById("nombreNodoInput");
  const nombreNodo = nombreNodoInput.value.trim();

  if (nombreNodo === "") {
    return;
  }

  if (!nodos.find(node => node.nombre.toUpperCase() === nombreNodo.toUpperCase())) {
    nodos.push(
      { nombre: nombreNodo.toUpperCase(),
        color: "negro" }
    );
    actualizarOpcionesNodos();
    nombreNodoInput.value = "";
    dibujarGrafo();
  } else {
    alert("El nodo ya está en la lista.");
  }
}

// Función para agregar una arista
function agregarArista() {
  const nodoInicio = document.getElementById("nodoInicioSelect").value;
  const nodoFinal = document.getElementById("nodoFinalSelect").value;
  const aristaExistente = aristas.find(
    (arista) => arista[0] === nodoInicio && arista[1] === nodoFinal
  );

  if(nodoInicio === nodoFinal){
    alert("No se permiten loops.");
    return;
  }

  if (!aristaExistente) {
    aristas.push([nodoInicio, nodoFinal]);
    dibujarGrafo();
  } else {
    alert("No se permiten multigrafos.");
  }
}

// Función para actualizar las opciones de los selects de nodos
function actualizarOpcionesNodos() {
  const nodoInicioSelect = document.getElementById("nodoInicioSelect");
  const nodoFinalSelect = document.getElementById("nodoFinalSelect");

  nodoInicioSelect.innerHTML = "";
  nodoFinalSelect.innerHTML = "";

  nodos.forEach((nodo) => {
    const opcion = document.createElement("option");
    opcion.value = nodo.nombre;
    opcion.textContent = nodo.nombre;
    nodoInicioSelect.appendChild(opcion.cloneNode(true));
    nodoFinalSelect.appendChild(opcion.cloneNode(true));
  });
}

function aplicarColoracionGrafo() {
  nodos.forEach((nodo) => {
    // Obtener los colores de los nodos adyacentes
    const coloresAdyacentes = new Set();
    aristas.forEach((arista) => {
      if (arista.includes(nodo.nombre)) {
        const nodoAdyacente = arista.find(n => n !== nodo.nombre);
        const nodoAdyacenteObj = nodos.find(n => n.nombre === nodoAdyacente);
        coloresAdyacentes.add(nodoAdyacenteObj.color);
      }
    });

    // Encontrar el primer color disponible que no esté siendo utilizado por los nodos adyacentes
    let colorDisponible = 1;
    while (coloresAdyacentes.has(obtenerColor(colorDisponible))) {
      colorDisponible++;
    }

    // Establecer el color del nodo
    nodo.color = obtenerColor(colorDisponible);
  });

  dibujarGrafo();

  // Actualizar el número cromático propio después de aplicar la coloración
  actualizarNumeroCromatico();
}

// Función para actualizar el número cromático propio en el div
function actualizarNumeroCromatico() {
  const numeroCromaticoPropioDiv = document.getElementById("numeroCromaticoPropio");
  const numeroCromatico = calcularNumeroCromatico();
  numeroCromaticoPropioDiv.textContent = "Número cromático: " + numeroCromatico;
}

// Función para calcular el número cromático propio del grafo
function calcularNumeroCromatico() {
  const coloresUtilizados = new Set();
  nodos.forEach((nodo) => {
    coloresUtilizados.add(nodo.color);
  });
  const numeroCromatico = coloresUtilizados.size;
  return numeroCromatico;
}


// Función para dibujar el grafo con los colores aplicados
function dibujarGrafo() {
  // Limpiar el contenido existente
  d3.select("#grafoSVG").remove();

  const svg = d3
    .select("#dibujoGrafo")
    .append("svg")
    .attr("id", "grafoSVG")
    .attr("width", 400)
    .attr("height", 200);

  // Verificar el número de nodos
  const numNodos = nodos.length;

  // Determinar qué forma geométrica dibujar en función del número de nodos
  let forma;
  if (numNodos === 3) {
    forma = "triángulo";
  } else if (numNodos === 4) {
    forma = "cuadrado";
  } else if (numNodos === 5) {
    forma = "pentágono";
  } else if (numNodos === 6) {
    forma = "hexágono";
  } else if (numNodos === 7) {
    forma = "heptágono";
  } else if (numNodos === 8) {
    forma = "octágono";
  } else if (numNodos === 9) {
    forma = "nonágono";
  } else if (numNodos === 10) {
    forma = "decágono";
  } else {
    // Si hay más de 10 nodos o menos de 3 nodos, dibujar con espaciado uniforme
    dibujarConEspaciadoUniforme();
    return;
  }

  // Calcular las coordenadas de los vértices de la forma geométrica
  const coords = calcularCoordenadasForma(forma);

  // Dibujar aristas
  aristas.forEach((arista) => {
    const nodoInicio = arista[0];
    const nodoFinal = arista[1];

    const inicioX = coords.find(n => n.nombre === nodoInicio).x;
    const inicioY = coords.find(n => n.nombre === nodoInicio).y;
    const finalX = coords.find(n => n.nombre === nodoFinal).x;
    const finalY = coords.find(n => n.nombre === nodoFinal).y;

    svg
      .append("line")
      .attr("x1", inicioX)
      .attr("y1", inicioY)
      .attr("x2", finalX)
      .attr("y2", finalY)
      .attr("stroke", "black");
  });

  // Dibujar nodos en los vértices de la forma geométrica con la coloración aplicada
  nodos.forEach((nodo) => {
    const centroX = coords.find(n => n.nombre === nodo.nombre).x;
    const centroY = coords.find(n => n.nombre === nodo.nombre).y;

    svg
      .append("circle")
      .attr("cx", centroX)
      .attr("cy", centroY)
      .attr("r", 15)
      .attr("fill", nodo.color); // Aquí se aplica directamente el color del nodo

    svg
      .append("text")
      .attr("x", centroX)
      .attr("y", centroY + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#FFFFFF")
      .text(nodo.nombre);
  });
}

// Función auxiliar para obtener un color según el número
function obtenerColor(num) {
  const colores = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#800030",
    "#008050",
    "#000050",
    "#808060",
  ];
  return colores[num % colores.length];
}

// Función para calcular las coordenadas de los vértices de una forma geométrica
function calcularCoordenadasForma(forma) {
  const centroX = 200;
  const centroY = 100;
  const radio = 80;

  const coords = [];

  for (let i = 0; i < nodos.length; i++) {
    const angulo = (Math.PI * 2 * i) / nodos.length;
    const x = centroX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    coords.push({ nombre: nodos[i].nombre, x, y });
  }

  return coords;
}

// Función para dibujar el grafo con espaciado uniforme
function dibujarConEspaciadoUniforme() {
  const svg = d3.select("#grafoSVG");

  // Calcular el espaciado entre nodos
  const espaciadoNodo = 400 / (nodos.length + 1);

  // Dibujar aristas
  aristas.forEach((arista) => {
    const nodoInicio = arista[0];
    const nodoFinal = arista[1];

    const inicioX = nodos.indexOf(nodoInicio) * espaciadoNodo + espaciadoNodo;
    const inicioY = 50;
    const finalX = nodos.indexOf(nodoFinal) * espaciadoNodo + espaciadoNodo;
    const finalY = 150;

    svg
      .append("line")
      .attr("x1", inicioX)
      .attr("y1", inicioY)
      .attr("x2", finalX)
      .attr("y2", finalY)
      .attr("stroke", "black");
  });

  // Dibujar nodos con espaciado uniforme y coloración aplicada
  nodos.forEach((nodo, index) => {
    const centroX = (index + 1) * espaciadoNodo;
    const centroY = 100;

    svg
      .append("circle")
      .attr("cx", centroX)
      .attr("cy", centroY)
      .attr("r", 15)
      .attr("fill", nodo.color); // Aquí se aplica directamente el color del nodo

    svg
      .append("text")
      .attr("x", centroX)
      .attr("y", centroY + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#FFFFFF")
      .text(nodo.nombre);
  });
}

// Agregar event listeners
document.getElementById("btnAgregarNodo").addEventListener("click", agregarNodo);
document.getElementById("btnAgregarArista").addEventListener("click", agregarArista);
document.getElementById("btnAplicarColoracion").addEventListener("click", aplicarColoracionGrafo);

// Llamar a la función dibujarGrafo inicialmente
dibujarGrafo();
