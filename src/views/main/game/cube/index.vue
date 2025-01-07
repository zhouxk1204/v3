<template>
  <div class="wrapper">
    <div class="content" 
    :style="{
        width: `${sideLength}px`,
        height: `${sideLength}px`,
        'transform-origin': `${sideLength/2}px ${sideLength/2}px ${-sideLength/2}px`,
        transform: `rotateX(${contentRotate.x}deg) rotateY(${contentRotate.y}deg) rotateZ(0deg)`,
    }">
    <div v-for="item in blocks" :style="{
        width: side + 'px',
        height: side + 'px',
        transform: `translateX(${side * item.x}px) translateY(${side * item.y}px) translateZ(${-side * item.z}px)`
    }">
        <div v-for="face in item.areas" :class="face.direct" :style="
        {
            transform: face.transform,
            'background-color': face.background
        }"></div>
    </div>    
</div>
  </div>
</template>

<script lang="ts" setup>
const count = ref(3);
const side = ref(100);
const sideLength = computed(()=> {
    return count.value * side.value;
})
const contentRotate = ref({
    x: -30,
    y: 45
})
const blocks = ref([]);

const getBlocks = () => {
    for(let x = 0; x < count.value; x++) {
        for(let y = 0; y < count.value; y++) {
            for(let z = 0; z < count.value; z++) {
                const block = {
                    x,
                    y,
                    z,
                    areas: getAreas(x,y,z)
                };
                blocks.value.push(block);

            }
        }
    }
    console.log("%c Line:30 🌰 blocks.value", "color:#7f2b82", blocks.value);
}

const getAreas = (x,y,z) => {
    const areas = [];

    if(x === 0) {
        areas.push(getAreaInfo('left'))
    }

    if(x === count.value - 1){
        areas.push(getAreaInfo('right'))
    }

    if(y === 0) {
        areas.push(getAreaInfo('top'))
    }

    if(y === count.value - 1){
        areas.push(getAreaInfo('bottom'))
    }

    if(z === 0) {
        areas.push(getAreaInfo('before'))
    }

    if(z === count.value - 1){
        areas.push(getAreaInfo('after'))
    }

    return areas;
}

const transformStyle= {
    top: `translateY(${-side.value}px) rotateX(90deg)`,
    bottom: `translateY(${side.value}px) rotateX(-90deg)`,
    left: `translateX(${-side.value}px) rotateY(-90deg)`,
    right: `translateX(${side.value}px) rotateY(90deg)`,
    before: `translateZ(0deg)`,
    after: `translateZ(${-side.value}px)`
}

const colors = {
    top: "#fff",
    bottom: "#d17f30",
    left: "#7fad46",
    right: "#4a8399",
    before: "#bf402c",
    after: "#f9ec67",
  };

const getAreaInfo = (direct) => {
    return {
        direct,
        transform: transformStyle[direct],
        background: colors[direct]
    }
}

// 在组件挂载时添加全局键盘事件监听器
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

// 在组件卸载时移除全局键盘事件监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
// 事件回调函数
const handleGlobalKeydown = (event: KeyboardEvent) => {
  console.log(`全局监听: 你按下了键: ${event.key}`);
  const keyCode = event.keyCode;
  console.log("%c Line:124 🍆 keyCode", "color:#e41a6a", keyCode);

  if(keyCode === 37){
    contentRotate.value.y -= 90;
  }else if(keyCode === 39){
    contentRotate.value.y += 90;
  }else if(keyCode === 38){
    contentRotate.value.x += 180;
  } else if(keyCode === 40){
    contentRotate.value.x -= 180;
  }

};


getBlocks();

</script>
<style lang="scss" scoped>
.wrapper{
    display: flex;
    height: 100%;
    align-items: center;
    perspective: 5000px;
}

.content{
    transform-style: preserve-3d;
    position: relative;
    margin: auto;
    transition: all 1s ease;
    & > div{
        transform-style: preserve-3d;
        position: absolute;
        top: 0;
        left: 0;

        & > div{
            border: 1px solid black;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .top{
            transform-origin: bottom;
        }

        .bottom{
            transform-origin: top;
        }

        .left{
            transform-origin: right;
        }
        .right{
            transform-origin: left;
        }
    }
}


</style>