<template>
  <div ref="container" class="distortion-container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },        // 显示文字
  imageUrl: { type: String, default: '' },    // 图片地址
  backgroundColor: { type: String, default: 'transparent' }, // 背景颜色
  textColor: { type: String, default: 'rgba(255, 255, 255, 0.9)' }, // 文字颜色
  grid: { type: Number, default: 15 },
  mouseRadius: { type: Number, default: 0.25 },
  strength: { type: Number, default: 0.15 },
  relaxation: { type: Number, default: 0.9 }
})

const container = ref(null)
let effect = null

class DistortionEffect {
  constructor(container, props) {
    this.container = container
    this.grid = props.grid
    this.mouseRadius = props.mouseRadius
    this.strength = props.strength
    this.relaxation = props.relaxation
    this.text = props.text
    this.imageUrl = props.imageUrl
    this.backgroundColor = props.backgroundColor || 'transparent'
    this.textColor = props.textColor || 'rgba(255, 255, 255, 0.9)'

    console.log('DistortionEffect constructor colors:', {
      backgroundColor: this.backgroundColor,
      textColor: this.textColor
    })

    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 }

    this.init()
  }

  init() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000)
    this.camera.position.z = 2

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)

    this.uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() },
      uTexture: { value: null },
      uDataTexture: { value: null }
    }

    this.loadTexture()
    this.createDataTexture()
    this.createMaterial()
    this.setupEventListeners()
    this.animate()
  }

  loadTexture() {
    if (this.imageUrl) {
      new THREE.TextureLoader().load(this.imageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter
        this.uniforms.uTexture.value = tex
        this.resize()
      })
    } else if (this.text) {
      const tex = this.createTextTexture(this.text)
      if (tex) {
        this.uniforms.uTexture.value = tex
        // 延迟执行 resize，确保 mesh 已经创建
        setTimeout(() => {
          if (this.mesh) this.resize()
        }, 0)
      } else {
        console.error('Failed to create text texture')
      }
    }
  }
  createTextTexture(text) {
    const width = this.container.clientWidth || 800
    const height = this.container.clientHeight || 600
    
    // 确保尺寸有效
    if (width <= 0 || height <= 0) {
      console.warn('Invalid container dimensions:', width, height)
      return null
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    // 调试：输出颜色信息
    console.log('Creating texture with colors:', {
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      text: text,
      width,
      height
    })
    
    // 设置背景色
    if (this.backgroundColor && this.backgroundColor !== 'transparent') {
      ctx.fillStyle = this.backgroundColor
      ctx.fillRect(0, 0, width, height)
      console.log('Background filled with:', this.backgroundColor)
    } else {
      // 背景设为透明
      ctx.clearRect(0, 0, width, height)
      console.log('Background cleared (transparent)')
    }
    
    // 设置文字样式
    ctx.textBaseline = 'top'  // 使用 top 基线，然后手动计算位置
    ctx.textAlign = 'center'
    
    // 计算最佳字体大小，同时考虑宽度和高度限制
    let fontSize = Math.min(width, height) * 0.8 // 初始字体大小
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    
    // 测量文字尺寸
    let metrics = ctx.measureText(text)
    let textWidth = metrics.width
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    
    // 根据容器尺寸调整字体大小，优先填满高度，但不超出宽度
    const maxWidth = width * 0.9 // 留10%边距
    const maxHeight = height * 0.9 // 留10%边距
    
    // 如果文字太宽，按宽度缩放
    if (textWidth > maxWidth) {
      fontSize = fontSize * maxWidth / textWidth
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      metrics = ctx.measureText(text)
      textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
    
    // 如果文字太高，按高度缩放
    if (textHeight > maxHeight) {
      fontSize = fontSize * maxHeight / textHeight
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      metrics = ctx.measureText(text)
      textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
    
    // 如果文字太小，尝试放大到填满容器
    if (textHeight < maxHeight && textWidth < maxWidth) {
      const scaleByHeight = maxHeight / textHeight
      const scaleByWidth = maxWidth / textWidth
      const scale = Math.min(scaleByHeight, scaleByWidth)
      fontSize = fontSize * scale
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      metrics = ctx.measureText(text)
      textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
    
    // 设置文字颜色
    const finalTextColor = this.textColor || '#ffffff'
    ctx.fillStyle = finalTextColor
    
    // 计算真正的垂直居中位置
    // 使用容器中心减去文字高度的一半，再加上文字的上升部分
    const textY = (height - textHeight) / 2 + metrics.actualBoundingBoxAscent
    
    console.log('Final font:', ctx.font)
    console.log('Final text color:', finalTextColor)
    console.log('Text metrics:', {
      width: textWidth,
      height: textHeight,
      ascent: metrics.actualBoundingBoxAscent,
      descent: metrics.actualBoundingBoxDescent,
      finalY: textY,
      containerHeight: height
    })
    
    // 绘制文字，使用计算出的垂直居中位置
    ctx.fillText(text, width / 2, textY)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }

  createDataTexture() {
    const size = this.grid
    const data = new Float32Array(4 * size * size)
    for (let i = 0; i < size * size; i++) {
      data[4 * i] = (Math.random() * 255) - 125
      data[4 * i + 1] = (Math.random() * 255) - 125
    }
    this.dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
    this.dataTexture.needsUpdate = true
    this.uniforms.uDataTexture.value = this.dataTexture
  }

  createMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `
    const fragmentShader = `
      uniform sampler2D uDataTexture;
      uniform sampler2D uTexture;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        vec4 offset = texture2D(uDataTexture, vUv);
        gl_FragColor = texture2D(uTexture, uv - 0.02*offset.rg);
      }
    `
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, this.grid - 1, this.grid - 1)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setupEventListeners() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1 - (e.clientY - rect.top) / rect.height
      this.mouse.vX = x - this.mouse.prevX
      this.mouse.vY = y - this.mouse.prevY
      this.mouse.prevX = x
      this.mouse.prevY = y
      this.mouse.x = x
      this.mouse.y = y
    })

    this.container.addEventListener('mouseleave', () => {
      Object.assign(this.mouse, { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 })
    })

    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    const width = this.container.offsetWidth
    const height = this.container.offsetHeight
    const aspect = width / height
    
    this.renderer.setSize(width, height)
    
    // 调整mesh缩放，确保充满容器
    this.mesh.scale.set(aspect, 1, 1)
    
    // 设置相机视野，确保内容完全可见
    this.camera.left = -aspect / 2
    this.camera.right = aspect / 2
    this.camera.top = 0.5
    this.camera.bottom = -0.5
    this.camera.updateProjectionMatrix()
    
    this.uniforms.resolution.value.set(width, height, 1, 1)
    
    // 如果是文字纹理，重新生成以适应新尺寸
    if (this.text && !this.imageUrl) {
      const newTexture = this.createTextTexture(this.text)
      if (this.uniforms.uTexture.value) {
        this.uniforms.uTexture.value.dispose()
      }
      this.uniforms.uTexture.value = newTexture
    }
  }

  updateDataTexture() {
    const data = this.dataTexture.image.data
    const size = this.grid
    for (let i = 0; i < size * size; i++) {
      data[4 * i] *= this.relaxation
      data[4 * i + 1] *= this.relaxation
    }
    const mouseX = size * this.mouse.x
    const mouseY = size * this.mouse.y
    const radius = size * this.mouseRadius

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const dx = mouseX - i
        const dy = mouseY - j
        const dist2 = dx * dx + dy * dy
        if (dist2 < radius * radius) {
          const index = 4 * (i + j * size)
          const falloff = Math.min(radius / Math.sqrt(dist2), 10)
          data[index] += 100 * this.strength * this.mouse.vX * falloff
          data[index + 1] -= 100 * this.strength * this.mouse.vY * falloff
        }
      }
    }
    this.dataTexture.needsUpdate = true

    // 调试信息
    // console.log('Mouse:',this.mouse.x.toFixed(2),this.mouse.y.toFixed(2),
    //   'vX/vY:',this.mouse.vX.toFixed(3),this.mouse.vY.toFixed(3))
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.uniforms.time.value += 0.05
    this.updateDataTexture()
    this.renderer.render(this.scene, this.camera)
  }

  // 更新参数
  updateGrid(value) { this.grid = value; this.scene.remove(this.mesh); this.createDataTexture(); this.geometry.dispose(); this.geometry = new THREE.PlaneGeometry(1, 1, this.grid - 1, this.grid - 1); this.mesh = new THREE.Mesh(this.geometry, this.material); this.scene.add(this.mesh); this.resize() }
  updateMouseRadius(value) { this.mouseRadius = value }
  updateStrength(value) { this.strength = value }
  updateRelaxation(value) { this.relaxation = value }
  updateBackgroundColor(value) { this.backgroundColor = value; if (this.text) this.updateTexture(this.text) }
  updateTextColor(value) { this.textColor = value; if (this.text) this.updateTexture(this.text) }
  
  // 更新纹理
  updateTexture(text = null, imageUrl = null) {
    if (imageUrl) {
      new THREE.TextureLoader().load(imageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter
        if (this.uniforms.uTexture.value) {
          this.uniforms.uTexture.value.dispose()
        }
        this.uniforms.uTexture.value = tex
        this.imageUrl = imageUrl
        this.text = ''
        this.resize()
      })
    } else if (text) {
      const newTexture = this.createTextTexture(text)
      if (this.uniforms.uTexture.value) {
        this.uniforms.uTexture.value.dispose()
      }
      this.uniforms.uTexture.value = newTexture
      this.text = text
      this.imageUrl = ''
    }
  }
  
  // 清理资源
  dispose() {
    if (this.uniforms.uTexture.value) {
      this.uniforms.uTexture.value.dispose()
    }
    if (this.dataTexture) {
      this.dataTexture.dispose()
    }
    if (this.geometry) {
      this.geometry.dispose()
    }
    if (this.material) {
      this.material.dispose()
    }
    if (this.renderer) {
      this.renderer.dispose()
    }
  }
}

onMounted(() => {
  console.log('Trae props:', {
    text: props.text,
    backgroundColor: props.backgroundColor,
    textColor: props.textColor
  })
  effect = new DistortionEffect(container.value, props)
})

onBeforeUnmount(() => {
  if (effect) {
    effect.dispose()
  }
})

// 如果 props 改变，也可以 watch 调整参数
watch(() => props.grid, (v) => { if (effect) effect.updateGrid(v) })
watch(() => props.mouseRadius, (v) => { if (effect) effect.updateMouseRadius(v) })
watch(() => props.strength, (v) => { if (effect) effect.updateStrength(v) })
watch(() => props.relaxation, (v) => { if (effect) effect.updateRelaxation(v) })
watch(() => props.backgroundColor, (v) => { if (effect) effect.updateBackgroundColor(v) })
watch(() => props.textColor, (v) => { if (effect) effect.updateTextColor(v) })

// 监听文字和图片变化
watch(() => props.text, (newText) => {
  if (effect && newText && !props.imageUrl) {
    effect.updateTexture(newText)
  }
})

watch(() => props.imageUrl, (newUrl) => {
  if (effect && newUrl) {
    effect.updateTexture(null, newUrl)
  }
})
</script>

<style scoped>
.distortion-container {
  width: 100%;
  height: 100%;
  min-height: 200px; /* 设置最小高度 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.distortion-container canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
