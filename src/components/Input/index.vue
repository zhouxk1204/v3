<template>
  <input :type="type" class="w-full h-12 px-2 border rounded-lg outline-none" />
</template>

<script setup lang='ts'>
import {ref, reactive} from 'vue'

withDefaults(defineProps<{
    type: 'number' | 'text'
}>(),{
    type: 'text'
})

</script>
<style scoped>
</style>