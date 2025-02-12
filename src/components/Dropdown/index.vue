<template>
  <div class="relative inline-block text-left w-36">
    <div>
      <button type="button" @click="isShowOption = !isShowOption"
        class="inline-flex w-36 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
        id="menu-button" aria-expanded="true" aria-haspopup="true">
        {{ currentOption.label }}
        <svg class="-mr-1 text-gray-400 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
          data-slot="icon">
          <path fill-rule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div v-show="isShowOption"
      class="absolute left-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 bottom-10 bz-10 ring-1 ring-black/5 focus:outline-hidden"
      role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="py-1" role="none">
        <a @click="onClickOption(item)" v-for="item in props.options" :key="item.value" href="#"
          :class="currentOption.value === item.value ? 'text-gray-900' : 'text-gray-700'"
          class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-800 hover:bg-gray-100 hover:outline-hidden active:bg-gray-200"
          role="menuitem" tabindex="-1" id="menu-item-0">{{ item.label }}
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>

const isShowOption = ref(false)

const currentOption = computed(() => props.options.find(item => item.value === props.modelValue.value) || { label: '', value: '' })

const props = defineProps<{
  modelValue: { label: string, value: string }
  options: { label: string, value: string }[]
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { label: string, value: string }): void
}>()

const onClickOption = (item: { label: string, value: string }) => {
  isShowOption.value = false
  emit('update:modelValue', item)
}

</script>