let gradoSeleccionado = '5°'
let chartCrecimiento = null
let chartVotos = null
let chartTop = null

async function cargarDatos() {
  const { data: historial, error: errH } = await window._db
    .from('votos_historial')
    .select('*')
    .order('timestamp', { ascending: true })

  if (errH) { console.error('Error historial:', errH); return }

  const { data: proyectos, error: errP } = await window._db
    .from('proyectos')
    .select('*')

  if (errP) { console.error('Error proyectos:', errP); return }

  procesarDatos(historial || [], proyectos || [])
}

function procesarDatos(historial, proyectos) {
  const idsGrado = proyectos.filter(p => p.grado === gradoSeleccionado).map(p => p.id)
  const filtrado = historial.filter(h => idsGrado.includes(h.proyecto_id))

  if (filtrado.length === 0) {
    actualizarStats(0, 0, 0, 0)
    return
  }

  const totalVotos = filtrado.length
  const totalEstrellas = filtrado.reduce((s, h) => s + h.ingenio + h.estetica + h.funcion, 0)
  const proyectosConVotos = new Set(filtrado.map(h => h.proyecto_id)).size
  const promedio = totalVotos > 0 ? (totalEstrellas / totalVotos).toFixed(1) : '0.0'

  actualizarStats(totalVotos, totalEstrellas, proyectosConVotos, promedio)
  graficarCrecimiento(filtrado)
  graficarVotosAcumulados(filtrado)
  graficarTop(proyectos, filtrado)
}

function actualizarStats(votos, estrellas, proyectos, promedio) {
  document.getElementById('stat-votos').textContent = votos
  document.getElementById('stat-estrellas').textContent = estrellas
  document.getElementById('stat-proyectos').textContent = proyectos
  document.getElementById('stat-promedio').textContent = promedio
}

function graficarCrecimiento(datos) {
  const ctx = document.getElementById('chart-crecimiento').getContext('2d')
  const agrupados = {}
  datos.forEach(h => {
    const key = new Date(h.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    if (!agrupados[key]) agrupados[key] = { ingenio: 0, estetica: 0, funcion: 0, count: 0 }
    agrupados[key].ingenio += h.ingenio
    agrupados[key].estetica += h.estetica
    agrupados[key].funcion += h.funcion
    agrupados[key].count++
  })

  const labels = Object.keys(agrupados)
  const ingenio = Object.values(agrupados).map(v => v.ingenio)
  const estetica = Object.values(agrupados).map(v => v.estetica)
  const funcion = Object.values(agrupados).map(v => v.funcion)

  if (chartCrecimiento) chartCrecimiento.destroy()

  let cumIng = 0, cumEst = 0, cumFun = 0
  const cumIngenio = ingenio.map(v => cumIng += v)
  const cumEstetica = estetica.map(v => cumEst += v)
  const cumFuncion = funcion.map(v => cumFun += v)

  chartCrecimiento = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '💡 Ingenioso', data: cumIngenio, borderColor: '#c084fc', backgroundColor: 'rgba(192,132,252,0.1)', fill: true, tension: 0.3, pointRadius: 3 },
        { label: '🎨 Estética', data: cumEstetica, borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.1)', fill: true, tension: 0.3, pointRadius: 3 },
        { label: '⚙️ Funcionamiento', data: cumFuncion, borderColor: '#f1c40f', backgroundColor: 'rgba(241,196,15,0.1)', fill: true, tension: 0.3, pointRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#e2d9f3', font: { size: 13 } } } },
      scales: {
        x: { ticks: { color: '#9ca3af', maxRotation: 45 }, grid: { color: '#3b1f6e' } },
        y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#3b1f6e' } }
      }
    }
  })
}

function graficarVotosAcumulados(datos) {
  const ctx = document.getElementById('chart-votos').getContext('2d')
  const agrupados = {}
  datos.forEach(h => {
    const key = new Date(h.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    if (!agrupados[key]) agrupados[key] = 0
    agrupados[key]++
  })

  const labels = Object.keys(agrupados)
  const counts = Object.values(agrupados)
  let cum = 0
  const acum = counts.map(v => cum += v)

  if (chartVotos) chartVotos.destroy()

  chartVotos = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Votos acumulados', data: acum, borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.15)', fill: true, tension: 0.3, pointRadius: 3 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#e2d9f3', font: { size: 12 } } } },
      scales: {
        x: { ticks: { color: '#9ca3af', maxRotation: 45 }, grid: { color: '#3b1f6e' } },
        y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#3b1f6e' } }
      }
    }
  })
}

function graficarTop(proyectos, historial) {
  const ctx = document.getElementById('chart-top').getContext('2d')

  const mapa = {}
  historial.forEach(h => {
    if (!mapa[h.proyecto_id]) mapa[h.proyecto_id] = { ingenio: 0, estetica: 0, funcion: 0, count: 0 }
    mapa[h.proyecto_id].ingenio += h.ingenio
    mapa[h.proyecto_id].estetica += h.estetica
    mapa[h.proyecto_id].funcion += h.funcion
    mapa[h.proyecto_id].count++
  })

  const ranked = Object.entries(mapa)
    .map(([id, v]) => {
      const total = v.ingenio + v.estetica + v.funcion
      const avg = v.count > 0 ? (total / (v.count * 3) * 5).toFixed(1) : 0
      const p = proyectos.find(pj => pj.id === id)
      return { id, nombre: p ? p.nombre : id, proyecto: p ? p.proyecto : '', avg: parseFloat(avg), total }
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)

  if (chartTop) chartTop.destroy()

  const colores = ['#c084fc', '#a78bfa', '#7c3aed', '#6d28d9', '#4a1d8a']

  chartTop = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ranked.map(r => r.nombre),
      datasets: [{ label: 'Promedio ⭐/5', data: ranked.map(r => r.avg), backgroundColor: colores.slice(0, ranked.length), borderRadius: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: {
        legend: { labels: { color: '#e2d9f3', font: { size: 12 } } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.raw}/5 ⭐` } }
      },
      scales: {
        x: { beginAtZero: true, max: 5, ticks: { color: '#9ca3af' }, grid: { color: '#3b1f6e' } },
        y: { ticks: { color: '#e2d9f3', font: { size: 12 } }, grid: { display: false } }
      }
    }
  })
}

function seleccionarGrado(grado) {
  gradoSeleccionado = grado
  document.querySelectorAll('.grado-tab').forEach(t => t.classList.toggle('active', t.dataset.grado === grado))
  cargarDatos()
}

let canal = null
function suscribir() {
  canal = window._db.channel('cambios-historial')
  canal.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votos_historial' }, () => cargarDatos())
  canal.subscribe()
}

window.onload = () => { cargarDatos(); suscribir() }

async function resetearTodo() {
  if (!confirm('¿Reiniciar TODOS los votos a cero? Esta acción no se puede deshacer.')) return
  if (!confirm('⚠️ ¿SEGURO? Se perderán todos los votos del historial y los totales.')) return

  try {
    await window._db.from('votos_historial').delete().neq('id', 0)
    await window._db.from('proyectos').update({
      ingenio: 0, estetica: 0, funcion: 0,
      votos_ingenio: 0, votos_estetica: 0, votos_funcion: 0
    }).neq('id', 'none')

    alert('✅ Todos los votos han sido reiniciados.')
    cargarDatos()
  } catch (err) {
    alert('Error: ' + err.message)
  }
}
