(function(){
  var c = document.createElement('canvas')
  c.id = 'particle-canvas'
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0'
  document.body.insertBefore(c, document.body.firstChild)

  var ctx = c.getContext('2d')
  var w, h, particles = [], mouse = { x: -9999, y: -9999, active: false }
  var COLORS = ['#c084fc', '#a855f7', '#7c3aed', '#a78bfa', '#f1c40f', '#e879f9']
  var COUNT = 80

  function resize() {
    w = c.width = window.innerWidth
    h = c.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  function Particle() {
    this.reset()
  }

  Particle.prototype.reset = function() {
    this.tx = Math.random() * w
    this.ty = Math.random() * h
    this.x = this.tx
    this.y = this.ty
    this.vx = 0
    this.vy = 0
    this.r = Math.random() * 3 + 1.5
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.alpha = Math.random() * 0.5 + 0.3
  }

  Particle.prototype.update = function() {
    var targetX, targetY

    if (mouse.active) {
      targetX = mouse.x + (Math.random() - 0.5) * 10
      targetY = mouse.y + (Math.random() - 0.5) * 10
    } else {
      targetX = this.tx
      targetY = this.ty
    }

    var dx = targetX - this.x
    var dy = targetY - this.y
    var dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 1) {
      var push = mouse.active ? 0.35 : 0.015
      this.vx += (dx / dist) * push
      this.vy += (dy / dist) * push
    }

    this.vx *= mouse.active ? 0.78 : 0.92
    this.vy *= mouse.active ? 0.78 : 0.92
    this.x += this.vx
    this.y += this.vy
  }

  Particle.prototype.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = mouse.active ? Math.min(1, this.alpha + 0.3) : this.alpha
    ctx.shadowColor = this.color
    ctx.shadowBlur = mouse.active ? 30 : 4
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
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = '#a855f7'
          ctx.globalAlpha = (1 - dist / 150) * (mouse.active ? 0.5 : 0.12)
          ctx.lineWidth = mouse.active ? 1.2 : 0.4
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

  document.addEventListener('mousemove', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true })
  document.addEventListener('mouseleave', function(){ mouse.active = false; mouse.x = -9999; mouse.y = -9999 })

  document.addEventListener('touchstart', function(e){ var t = e.touches[0]; mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true })
  document.addEventListener('touchmove', function(e){ var t = e.touches[0]; mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true })
  document.addEventListener('touchend', function(){ mouse.active = false; mouse.x = -9999; mouse.y = -9999 })

  window.addEventListener('resize', function(){ resize(); init() })
})()
