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
    this.r = Math.random() * 3.5 + 2
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.alpha = Math.random() * 0.4 + 0.3
  }

  Particle.prototype.update = function() {
    var targetX, targetY

    if (mouse.active) {
      targetX = mouse.x + (Math.random() - 0.5) * 20
      targetY = mouse.y + (Math.random() - 0.5) * 20
    } else {
      targetX = this.tx
      targetY = this.ty
    }

    var dx = targetX - this.x
    var dy = targetY - this.y
    var dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 1) {
      var speed = mouse.active ? 0.15 : 0.03
      this.vx += (dx / dist) * speed
      this.vy += (dy / dist) * speed
    }

    this.vx *= 0.9
    this.vy *= 0.9
    this.x += this.vx
    this.y += this.vy
  }

  Particle.prototype.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)

    var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2)
    grad.addColorStop(0, this.color)
    grad.addColorStop(1, this.color + '00')

    ctx.fillStyle = this.color
    ctx.globalAlpha = this.alpha

    ctx.shadowColor = this.color
    ctx.shadowBlur = mouse.active ? 20 : 6
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
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = particles[i].color
          ctx.globalAlpha = (1 - dist / 120) * (mouse.active ? 0.3 : 0.08)
          ctx.lineWidth = mouse.active ? 1 : 0.5
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

  document.addEventListener('mousedown', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true })
  document.addEventListener('mousemove', function(e){ if (mouse.active) { mouse.x = e.clientX; mouse.y = e.clientY } })
  document.addEventListener('mouseup', function(){ mouse.active = false; mouse.x = -9999; mouse.y = -9999 })
  document.addEventListener('mouseleave', function(){ mouse.active = false; mouse.x = -9999; mouse.y = -9999 })

  document.addEventListener('touchstart', function(e){ var t = e.touches[0]; mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true })
  document.addEventListener('touchmove', function(e){ var t = e.touches[0]; mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true })
  document.addEventListener('touchend', function(){ mouse.active = false; mouse.x = -9999; mouse.y = -9999 })

  window.addEventListener('resize', function(){ resize(); init() })
})()
