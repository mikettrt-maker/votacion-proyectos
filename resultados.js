const CATEGORIAS = [
  { id: 'ingenio', icon: '💡', label: 'Proyecto Más Ingenioso' },
  { id: 'estetica', icon: '🎨', label: 'Mejor Estética' },
  { id: 'funcion', icon: '⚙️', label: 'Mejor Funcionamiento' }
]

let proyectos = []

async function cargarResultados() {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('grado', { ascending: true })
    .order('nombre', { ascending: true })

  if (error) { console.error(error); return }
  proyectos = data
  renderizar()
}

function calcularPromedio(votos, total) {
  if (total === 0) return 0
  return (votos / total).toFixed(1)
}

function renderizar() {
  const grid = document.getElementById('categorias-grid')
  grid.innerHTML = ''

  CATEGORIAS.forEach(cat => {
    const sorted = [...proyectos]
      .map(p => ({
        ...p,
        avg: calcularPromedio(p[cat.id], p['votos_' + cat.id]),
        votosRecibidos: p['votos_' + cat.id]
      }))
      .filter(p => p.votosRecibidos > 0)
      .sort((a, b) => b.avg - a.avg || b.votosRecibidos - a.votosRecibidos)

    const card = document.createElement('div')
    card.className = 'categoria-card'

    let html = `<h3><span class="cat-icon">${cat.icon}</span>${cat.label}</h3>`

    if (sorted.length === 0) {
      html += `<p style="text-align:center;color:#8b949e;font-size:0.9rem;">Sin votos aún</p>`
    } else {
      sorted.slice(0, 5).forEach((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''
        html += `<div class="top-item">
          <div class="medal">${medal || (i+1)}</div>
          <div class="info">
            <div class="name">${p.nombre}</div>
            <div class="project">${p.proyecto}</div>
          </div>
          <div class="avg">⭐ ${p.avg}</div>
        </div>`
      })
    }

    card.innerHTML = html
    grid.appendChild(card)
  })

  renderizarRankingCompleto()
}

function renderizarRankingCompleto() {
  const container = document.getElementById('ranking-completo')
  container.innerHTML = ''

  CATEGORIAS.forEach(cat => {
    const sorted = [...proyectos]
      .map(p => ({
        ...p,
        avg: calcularPromedio(p[cat.id], p['votos_' + cat.id]),
        votosRecibidos: p['votos_' + cat.id]
      }))
      .sort((a, b) => b.avg - a.avg || b.votosRecibidos - a.votosRecibidos)

    const col = document.createElement('div')
    col.className = 'ranking-col'

    let html = `<h4>${cat.icon} ${cat.label}</h4>`
    sorted.forEach((p, i) => {
      const avg = p.votosRecibidos > 0 ? p.avg : '—'
      html += `<div class="ranking-item">
        <span class="pos">${i+1}</span>
        <span class="rname">${p.nombre} — ${p.proyecto.substring(0, 20)}</span>
        <span class="ravg">${avg !== '—' ? '⭐ ' + avg : avg}</span>
      </div>`
    })

    col.innerHTML = html
    container.appendChild(col)
  })

  document.getElementById('ultima-actualizacion').textContent =
    new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/* === SUSCRIPCIÓN EN TIEMPO REAL === */
let canal = null

function suscribir() {
  canal = supabase.channel('cambios-proyectos')
  canal.on('postgres_changes',
    { event: '*', schema: 'public', table: 'proyectos' },
    () => cargarResultados()
  ).subscribe()
}

window.onload = async () => {
  await cargarResultados()
  suscribir()
}
