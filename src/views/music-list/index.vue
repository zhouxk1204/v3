<template>
  <div class="flex gap-8 p-10">
    <div class="w-[270px] aspect-square flex-none">
      <img
        src="https://picsum.photos/270"
        alt="cover"
        class="shadow-radiosity rounded-[10px] w-full h-full object-cover"
      />
    </div>
    <div class="flex flex-col justify-end">
      <div>
        <h1 class="text-[26px] text-black/85 font-bold">MY FAVORITE SONGS</h1>
        <h2
          class="text-[26px] text-[#D60017] py-1 cursor-pointer hover:underline"
        >
          ZHOUXIAOKANG
        </h2>
        <p class="text-xs font-bold">POP · 2025</p>
      </div>
      <p class="text-[13px] text-black/55 mt-7 line-clamp-3">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>

      <div class="mt-9">
        <button
          class="flex items-center justify-center gap-1 px-4 rounded-md bg-[#d60017] text-white text-[13px] h-[28px]"
        >
          <Icon icon="f7:play-fill" width="16"></Icon>
          <span>Play</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped></style>
