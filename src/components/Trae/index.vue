<template>
  <div ref="container" class="distortion-container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },        // 显示文字
  imageUrl: { type: String, default: '' },    // 图片地址
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
      this.uniforms.uTexture.value = tex
      // this.resize()
      // 延迟执行 resize，确保 mesh 已经创建
      setTimeout(() => {
        if(this.mesh) this.resize()
      }, 0)
    }
  }

  createTextTexture(text) {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    const canvas = document.createElement('canvas')
    canvas.width = width
    console.log("%c Line:82 🍡 width", "color:#b03734", width);
    canvas.height = height
    console.log("%c Line:84 🥪 height", "color:#465975", height);
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#76ed95'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#000'
    
    // 使用更精确的方法计算字体大小，让文字完全填满容器高度
    // 从容器高度开始尝试，直到文字能完全适应
    let fontSize = height * 1.3
    ctx.font = `bold ${fontSize}px Arial`
    
    // 调整文字基线为top，这样可以从顶部开始测量
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    
    // 测量文字高度
    const metrics = ctx.measureText(text)
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    console.log("%c Line:102 🌽 textHeight", "color:#ed9ec7", textHeight);
    
    // 如果文字高度超过容器，缩小字体
    if (textHeight > height) {
      fontSize = fontSize * height / textHeight
      ctx.font = `bold ${fontSize}px Arial`
    }
    
    // 绘制文字，从顶部开始，确保文字完全填满高度
    ctx.fillText(text, width/2, -14)
    
    return new THREE.CanvasTexture(canvas)
  }

  createDataTexture() {
    const size = this.grid
    const data = new Float32Array(4 * size * size)
    for (let i = 0; i < size*size; i++) {
      data[4*i] = (Math.random()*255)-125
      data[4*i+1] = (Math.random()*255)-125
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

    this.geometry = new THREE.PlaneGeometry(1,1,this.grid-1,this.grid-1)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setupEventListeners() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect()
      const x = (e.clientX - rect.left)/rect.width
      const y = 1 - (e.clientY - rect.top)/rect.height
      this.mouse.vX = x - this.mouse.prevX
      this.mouse.vY = y - this.mouse.prevY
      this.mouse.prevX = x
      this.mouse.prevY = y
      this.mouse.x = x
      this.mouse.y = y
    })

    this.container.addEventListener('mouseleave', () => {
      Object.assign(this.mouse,{x:0,y:0,prevX:0,prevY:0,vX:0,vY:0})
    })

    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    const width = this.container.offsetWidth
    const height = this.container.offsetHeight
    const aspect = width/height
    this.renderer.setSize(width,height)
    this.mesh.scale.set(aspect,1,1)
    this.camera.left = -aspect/2
    this.camera.right = aspect/2
    this.camera.top = 0.5
    this.camera.bottom = -0.5
    this.camera.updateProjectionMatrix()
    this.uniforms.resolution.value.set(width,height,1,1)
  }

  updateDataTexture() {
    const data = this.dataTexture.image.data
    const size = this.grid
    for (let i=0;i<size*size;i++){
      data[4*i]*=this.relaxation
      data[4*i+1]*=this.relaxation
    }
    const mouseX = size*this.mouse.x
    const mouseY = size*this.mouse.y
    const radius = size*this.mouseRadius

    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        const dx = mouseX - i
        const dy = mouseY - j
        const dist2 = dx*dx+dy*dy
        if(dist2<radius*radius){
          const index = 4*(i+j*size)
          const falloff = Math.min(radius/Math.sqrt(dist2),10)
          data[index] += 100*this.strength*this.mouse.vX*falloff
          data[index+1] -= 100*this.strength*this.mouse.vY*falloff
        }
      }
    }
    this.dataTexture.needsUpdate = true

    // 调试信息
    // console.log('Mouse:',this.mouse.x.toFixed(2),this.mouse.y.toFixed(2),
    //   'vX/vY:',this.mouse.vX.toFixed(3),this.mouse.vY.toFixed(3))
  }

  animate() {
    requestAnimationFrame(()=>this.animate())
    this.uniforms.time.value += 0.05
    this.updateDataTexture()
    this.renderer.render(this.scene,this.camera)
  }

  // 更新参数
  updateGrid(value){this.grid=value; this.scene.remove(this.mesh); this.createDataTexture(); this.geometry.dispose(); this.geometry=new THREE.PlaneGeometry(1,1,this.grid-1,this.grid-1); this.mesh=new THREE.Mesh(this.geometry,this.material); this.scene.add(this.mesh); this.resize()}
  updateMouseRadius(value){this.mouseRadius=value}
  updateStrength(value){this.strength=value}
  updateRelaxation(value){this.relaxation=value}
}

onMounted(()=>{
  effect = new DistortionEffect(container.value, props)
})

onBeforeUnmount(()=>{
  if(effect && effect.renderer) effect.renderer.dispose()
})

// 如果 props 改变，也可以 watch 调整参数
watch(()=>props.grid,(v)=>{effect.updateGrid(v)})
watch(()=>props.mouseRadius,(v)=>{effect.updateMouseRadius(v)})
watch(()=>props.strength,(v)=>{effect.updateStrength(v)})
watch(()=>props.relaxation,(v)=>{effect.updateRelaxation(v)})
</script>

<style scoped>
.distortion-container{
  width:100%;
  height:100%;
  overflow:hidden;
}
</style>
