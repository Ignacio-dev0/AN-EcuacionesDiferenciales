
// Animación de onda sinusoidal
const canvas = document.getElementById('waveCanvas');
if (canvas) {
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = 150;
let phase = 0;

function drawWave() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
ctx.strokeStyle = '#4c6ef5';
ctx.lineWidth = 3;

for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + Math.sin((x + phase) * 0.02) * 40;
    if (x === 0) {
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
    }
}
ctx.stroke();
phase += 2;
requestAnimationFrame(drawWave);
}
drawWave();
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});



// Gráficos del problema            
// --- MODELO LOGÍSTICO ---
    function poblacion(t, P0, K, r) {
      const A = (K - P0) / P0;
      return K / (1 + A * Math.exp(-r * t));
    }

    // --- MODELO EXPONENCIAL ---
    function poblacionExp(t, P0, r) {
      return P0 * Math.exp(r * t);
    }

    // --- GENERAR DATOS ---
    function generarDatosLogistico(P0, K, r, tMax = 50) {
      const tiempos = [];
      const valores = [];
      for (let t = 0; t <= tMax; t += 0.5) {
        tiempos.push(t);
        valores.push(poblacion(t, P0, K, r));
      }
      return { tiempos, valores };
    }

    function generarDatosExp(P0, r, tMax = 50) {
      const tiempos = [];
      const valores = [];
      for (let t = 0; t <= tMax; t += 0.5) {
        tiempos.push(t);
        valores.push(poblacionExp(t, P0, r));
      }
      return { tiempos, valores };
    }

    // GRAFICO LOGÍSTICO 
    const ctx = document.getElementById("grafico").getContext("2d");
    let { tiempos, valores } = generarDatosLogistico(100, 1000, 0.2);
    const grafico = new Chart(ctx, {
      type: "line",
      data: {
        labels: tiempos,
        datasets: [
          {
            label: "Población P(t)",
            data: valores,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.2)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Tiempo (t)" },
            grid: { color: "#1e293b" },
          },
          y: {
            title: { display: true, text: "Población P(t)" },
            grid: { color: "#1e293b" },
          },
        },
        plugins: {
          legend: { labels: { color: "#f8fafc" } },
        },
      },
    });

    // GRAFICO EXPONENCIAL 
    const ctxExp = document.getElementById("graficoExp").getContext("2d");
    let { tiempos: tExp, valores: vExp } = generarDatosExp(100, 0.2);
    const graficoExp = new Chart(ctxExp, {
      type: "line",
      data: {
        labels: tExp,
        datasets: [
          {
            label: "Crecimiento Exponencial",
            data: vExp,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Tiempo (t)" },
            grid: { color: "#1e293b" },
          },
          y: {
            title: { display: true, text: "Población P(t)" },
            grid: { color: "#1e293b" },
          },
        },
        plugins: {
          legend: { labels: { color: "#f8fafc" } },
        },
      },
    });

    //  INTERACCIÓN 
    document.getElementById("calcular").addEventListener("click", () => {
      const P0 = parseFloat(document.getElementById("p0").value);
      const K = parseFloat(document.getElementById("k").value);
      const r = parseFloat(document.getElementById("r").value);
      const t = parseFloat(document.getElementById("tiempo").value);

      const P = poblacion(t, P0, K, r);
      const Pexp = poblacionExp(t, P0, r);
      document.getElementById("resultado").textContent =
        `Logístico: P(${t}) = ${P.toFixed(2)} individuos | ` +
        `Exponencial: P(${t}) = ${Pexp.toFixed(2)} individuos`;

      // --- Actualizar gráfico logístico ---
      const nuevosDatosLog = generarDatosLogistico(P0, K, r);
      grafico.data.labels = nuevosDatosLog.tiempos;
      grafico.data.datasets[0].data = nuevosDatosLog.valores;

      grafico.data.datasets[0].pointRadius = grafico.data.labels.map(() => 0);
      const indexL = grafico.data.labels.findIndex((val) => val >= t);
      if (indexL >= 0 && indexL < grafico.data.labels.length) {
        grafico.data.datasets[0].pointRadius[indexL] = 5;
      }
      grafico.update();

      // --- Actualizar gráfico exponencial ---
      const nuevosDatosExp = generarDatosExp(P0, r);
      graficoExp.data.labels = nuevosDatosExp.tiempos;
      graficoExp.data.datasets[0].data = nuevosDatosExp.valores;

      graficoExp.data.datasets[0].pointRadius = graficoExp.data.labels.map(() => 0);
      const indexE = graficoExp.data.labels.findIndex((val) => val >= t);
      if (indexE >= 0 && indexE < graficoExp.data.labels.length) {
        graficoExp.data.datasets[0].pointRadius[indexE] = 5;
      }
      graficoExp.update();
    });