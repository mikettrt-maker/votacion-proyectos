(function(){
  var c = document.createElement('canvas')
  c.id = 'particle-canvas'
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0'
  document.body.insertBefore(c, document.body.firstChild)

  var ctx = c.getContext('2d')
  var w, h, particles = [], mouse = { x: -9999, y: -9999 }
  var COLORS = ['#c084fc', '#a855f7', '#7c3aed', '#a78bfa', '#f1c40f']
  var COUNT = 60

  function resize() {
    w = c.width = window.innerWidth
    h = c.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  function Particle() {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.r = Math.random() * 3 + 1.5
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.alpha = Math.random() * 0.5 + 0.2
  }

  Particle.prototype.update = function() {
    var dx = this.x - mouse.x
    var dy = this.y - mouse.y
    var dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 120) {
      var force = (120 - dist) / 120
      this.vx += (dx / dist) * force * 0.5
      this.vy += (dy / dist) * force * 0.5
    }

    this.vx *= 0.98
    this.vy *= 0.98
    this.x += this.vx
    this.y += this.vy

    if (this.x < -20) this.x = w + 20
    if (this.x > w + 20) this.x = -20
    if (this.y < -20) this.y = h + 20
    if (this.y > h + 20) this.y = -20
  }

  Particle.prototype.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.alpha
    ctx.fill()

    ctx.shadowColor = this.color
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  function init() {
    particles = []
    for (var i = 0; i < COUNT; i++) particles.push(new Particle())
  }
  init()

  function connect() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x
        var dy = particles[i].y - particles[j].y
        var dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = particles[i].color
          ctx.globalAlpha = (1 - dist / 100) * 0.15
          ctx.lineWidth = 0.5
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h)
    for (var i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
    }
    connect()
    requestAnimationFrame(animate)
  }
  animate()

  var throttle = false
  function onMove(e) {
    if (throttle) return
    throttle = true
    setTimeout(function(){ throttle = false }, 30)

    var p = e.touches ? e.touches[0] : e
    mouse.x = p.clientX
    mouse.y = p.clientY
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('touchmove', onMove)
  document.addEventListener('touchstart', onMove)
  document.addEventListener('mouseleave', function(){ mouse.x = -9999; mouse.y = -9999 })

  window.addEventListener('resize', function(){
    resize()
    init()
  })
})()
