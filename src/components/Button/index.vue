<template>
  <button>vue3</button>
</template>

<script setup lang='ts'>
</script>
<style lang="scss" scoped>
/* From Uiverse.io by niat786 */ 
button {
 border: none;
 color: #fff;
 background-image: linear-gradient(30deg, #0400ff, #4ce3f7);
 border-radius: 10px;
 background-size: 100% auto;
 font-family: inherit;
 font-size: 17px;
 padding: 0.6em 1.5em;
 cursor: pointer;
}

button:hover {
 background-position: right center;
 background-size: 200% auto;
 -webkit-animation: pulse 2s infinite;
 animation: pulse512 1.5s infinite;
}

button:active {
 transform: scale(0.97);
 transition: 0.1s all linear;
}

@keyframes pulse512 {
 0% {
  box-shadow: 0 0 0 0 #05bada66;
 }

 70% {
  box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
 }

 100% {
  box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
 }
}
</style>