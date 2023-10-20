<template>
  <div class="h-screen overflow-x-hidden overflow-y-scroll">
    <header
      class="fixed top-0 left-0 z-10 w-[calc(100vw-15px)] bg-white border-b border-gray-200 h-14 flex items-center px-8"
    >
      HEADER
    </header>
    <aside
      class="fixed left-0 w-40 h-screen px-8 pb-24 overflow-y-auto border-r border-gray-200 top-14"
    >
      <section class="flex flex-col pt-6">
        <div class="py-1">TEST</div>
        <a href="#" class="py-1">
          <p class="text-gray-400 hover:text-black">TEST111</p>
        </a>
        <a href="#" class="py-1">
          <p class="text-gray-400 hover:text-black">TEST122</p>
        </a>
      </section>
    </aside>
    <div class="pt-16 pl-24 ml-40 mt-14">
      <h2
        class="text-2xl relative hover:before:content-['#'] hover:before:text-green-400 hover:before:absolute hover:before:-left-5 hover:before:z-10"
      >
        开始
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
