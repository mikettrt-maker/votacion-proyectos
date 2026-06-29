const CATEGORIAS = [
  { id: 'ingenio', icon: '💡', label: 'Proyecto Más Ingenioso' },
  { id: 'estetica', icon: '🎨', label: 'Mejor Estética' },
  { id: 'funcion', icon: '⚙️', label: 'Mejor Funcionamiento' }
]

const EMOJIS = {
  '4a_camila': '🪙', '4a_dylan': '🔊', '4a_nicole': '🚦',
  '4a_sofi': '🅿️', '4a_jade': '🏠', '4a_naty': '🏗️',
  '4a_adonai': '🧠', '4a_santi': '🚙', '4a_ander': '🌤️',
  '4a_ram': '📏', '4a_domi': '🔐',
  '5a_alex': '🤖', '5a_fer': '🚦', '5a_regis': '🚶',
  '5a_iker': '❓', '5a_said': '🔔', '5a_gael': '📡',
  '5a_david': '🔒', '5a_trinidad': '🏗️',
  '6a_maria': '🏡', '6a_yair': '📐', '6a_karen': '🎮',
  '6a_cesar': '🛡️', '6a_mia': '🏗️', '6a_nico': '🚪',
  '6a_pepe': '💧', '6a_randy': '🚧', '6a_aline': '🚘',
  '6a_fer': '🃏', '6a_daman': '🔑', '6a_owen': '🎯',
  '6a_lalito': '💡'
}

let proyectos = []
let gradoSeleccionado = null
let hijoSeleccionado = null
let calificaciones = {}
let proyectosVotados = {}

const PRESUPUESTO_POR_PROYECTO = 5

function $(id) { return document.getElementById(id) }

async function init() {
  cargarEstadoLocal()
  await cargarProyectos()
  mostrarPantalla('screen-grade')
}

function cargarEstadoLocal() {
  const saved = localStorage.getItem('hijoSeleccionado')
  if (saved) hijoSeleccionado = saved
  const savedGrado = localStorage.getItem('gradoSeleccionado')
  if (savedGrado) gradoSeleccionado = savedGrado
}

async function cargarProyectos() {
  try {
    const { data, error } = await window._db
      .from('proyectos')
      .select('*')
      .order('nombre', { ascending: true })
    if (error) { console.error('Error Supabase:', error); return }
    proyectos = data || []
    console.log('Proyectos cargados:', proyectos.length)
  } catch (e) {
    console.error('Error cargando proyectos:', e)
  }
}

function mostrarPantalla(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  $(id).classList.add('active')
}

/* ========== PANTALLA 1: GRADO ========== */
function seleccionarGrado(grado) {
  gradoSeleccionado = grado
  localStorage.setItem('gradoSeleccionado', grado)
  renderizarEstudiantes()
  $('screen-grade-titulo').textContent = grado + ' Grado'
  mostrarPantalla('screen-child')
}

/* ========== PANTALLA 2: HIJO ========== */
function renderizarEstudiantes() {
  const grid = $('student-grid')
  grid.innerHTML = ''

  const alumnos = proyectos.filter(p => p.grado === gradoSeleccionado)
  if (alumnos.length === 0) {
    grid.innerHTML = '<div class="no-alumnos">No hay alumnos registrados para este grado.<br>Verifica que los datos estén en Supabase.</div>'
    return
  }
  alumnos.forEach(p => {
    const card = document.createElement('div')
    card.className = 'student-card'
    if (hijoSeleccionado === p.id && gradoSeleccionado === p.grado) card.classList.add('selected')
    card.innerHTML = `
      <span class="emoji">${EMOJIS[p.id] || '📚'}</span>
      <div class="sname">${p.nombre}</div>
      <div class="sproject">${p.proyecto}</div>
    `
    card.onclick = () => {
      hijoSeleccionado = p.id
      localStorage.setItem('hijoSeleccionado', p.id)
      const votados = localStorage.getItem('votados_' + p.id)
      proyectosVotados = votados ? JSON.parse(votados) : {}
      renderizarEstudiantes()
      $('btn-votar').disabled = false
    }
    grid.appendChild(card)
  })
}

function irAVotar() {
  if (!hijoSeleccionado) return
  const hijo = proyectos.find(p => p.id === hijoSeleccionado)
  $('votando-nombre').textContent = hijo.nombre
  $('votando-grado').textContent = hijo.grado
  renderizarVotacion()
  mostrarPantalla('screen-vote')
}

/* ========== PANTALLA 3: VOTAR ========== */
function renderizarVotacion() {
  const container = $('project-list')
  container.innerHTML = ''
  calificaciones = {}

  const mismoGrado = proyectos.filter(p => p.grado === gradoSeleccionado)
  const presupuestoMax = (mismoGrado.length - 1) * PRESUPUESTO_POR_PROYECTO

  mismoGrado.forEach(p => {
    const esPropio = p.id === hijoSeleccionado
    const yaVotado = proyectosVotados[p.id]
    calificaciones[p.id] = { ingenio: 0, estetica: 0, funcion: 0 }

    const card = document.createElement('div')
    card.className = 'project-card' + (esPropio ? ' locked' : '')
    card.id = 'card-' + p.id

    let html = `<div class="project-title">${esPropio ? '🔒 ' : ''}${p.proyecto}</div>
                <div class="project-author">${p.nombre}</div>`

    if (esPropio) {
      html += `<div class="lock-badge">🔒 Este es tu hijo — No puedes votar aquí</div>`
      CATEGORIAS.forEach(cat => {
        html += `<div class="category-row">
          <span class="category-label"><span class="cat-icon">${cat.icon}</span>${cat.label}</span>
          <span class="no-vote">——</span>
        </div>`
      })
    } else if (yaVotado) {
      CATEGORIAS.forEach(cat => {
        html += `<div class="category-row">
          <span class="category-label"><span class="cat-icon">${cat.icon}</span>${cat.label}</span>
          <span class="votado-badge">✅ Votado</span>
        </div>`
      })
    } else {
      CATEGORIAS.forEach(cat => {
        html += `<div class="category-row">
          <span class="category-label"><span class="cat-icon">${cat.icon}</span>${cat.label}</span>
          <div class="stars-container" data-project="${p.id}" data-category="${cat.id}">
            <span class="star" data-value="1">☆</span>
            <span class="star" data-value="2">☆</span>
            <span class="star" data-value="3">☆</span>
            <span class="star" data-value="4">☆</span>
            <span class="star" data-value="5">☆</span>
          </div>
        </div>`
      })
    }

    card.innerHTML = html
    container.appendChild(card)
  })

  document.querySelectorAll('.stars-container').forEach(el => {
    const projectId = el.dataset.project
    const category = el.dataset.category
    el.querySelectorAll('.star').forEach(s => {
      s.addEventListener('click', function () {
        const value = parseInt(this.dataset.value)
        const actual = calificaciones[projectId][category]
        const cambio = value - actual

        if (cambio <= 0) {
          setStars(el, value)
          calificaciones[projectId][category] = value
          actualizarContadores(presupuestoMax)
          return
        }

        if (cambio > 0 && estrellasUsadas() + cambio > presupuestoMax) {
          mostrarToast(`⚠️ Límite: ${presupuestoMax} ⭐ en total. Distribuye mejor.`)
          return
        }

        setStars(el, value)
        calificaciones[projectId][category] = value
        actualizarContadores(presupuestoMax)
      })
    })
  })

  actualizarContadores(presupuestoMax)
}

function setStars(container, value) {
  container.querySelectorAll('.star').forEach(s => {
    const v = parseInt(s.dataset.value)
    s.textContent = v <= value ? '★' : '☆'
    s.classList.toggle('filled', v <= value)
  })
}

function estrellasUsadas() {
  let total = 0
  Object.values(calificaciones).forEach(c => {
    total += (c.ingenio || 0) + (c.estetica || 0) + (c.funcion || 0)
  })
  return total
}

function actualizarContadores(presupuestoMax) {
  const usadas = estrellasUsadas()
  const disponibles = presupuestoMax - usadas
  $('estrellas-usadas').textContent = usadas
  $('estrellas-total').textContent = presupuestoMax
  $('estrellas-restantes').textContent = disponibles

  const mismogrado = proyectos.filter(p => p.grado === gradoSeleccionado)
  const total = mismogrado.length - 1
  let completos = 0
  Object.entries(calificaciones).forEach(([id, c]) => {
    if (id !== hijoSeleccionado && c.ingenio > 0 && c.estetica > 0 && c.funcion > 0) completos++
  })
  $('votos-contador').textContent = completos + '/' + total
}

function mostrarToast(msg) {
  const t = $('toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 3000)
}

async function enviarVotos() {
  const votosAEnviar = []
  Object.entries(calificaciones).forEach(([id, cats]) => {
    if (cats.ingenio > 0 && cats.estetica > 0 && cats.funcion > 0) {
      if (!proyectosVotados[id]) votosAEnviar.push({ id, ...cats })
    }
  })

  if (votosAEnviar.length === 0) {
    alert('Completa al menos un proyecto (las 3 categorías) para votar.')
    return
  }

  $('btn-enviar').disabled = true
  $('btn-enviar').textContent = 'Enviando...'

  try {
    for (const voto of votosAEnviar) {
      const { error } = await window._db.rpc('incrementar_voto', {
        proyecto_id: voto.id,
        inc_ingenio: voto.ingenio,
        inc_estetica: voto.estetica,
        inc_funcion: voto.funcion
      })
      if (error) throw error
      proyectosVotados[voto.id] = true
    }
    localStorage.setItem('votados_' + hijoSeleccionado, JSON.stringify(proyectosVotados))
    mostrarPantalla('screen-confirm')
  } catch (err) {
    console.error(err)
    alert('Error al enviar. Intenta de nuevo.')
    $('btn-enviar').disabled = false
    $('btn-enviar').textContent = '💾 Enviar votos'
  }
}

function cambiarHijo() {
  hijoSeleccionado = null
  localStorage.removeItem('hijoSeleccionado')
  proyectosVotados = {}
  renderizarEstudiantes()
  $('btn-votar').disabled = true
  mostrarPantalla('screen-child')
}

function volverInicio() {
  hijoSeleccionado = null
  gradoSeleccionado = null
  localStorage.removeItem('hijoSeleccionado')
  localStorage.removeItem('gradoSeleccionado')
  proyectosVotados = {}
  mostrarPantalla('screen-grade')
}
