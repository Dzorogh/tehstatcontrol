<template>
  <div class="group relative">
    <AnnotationIcon
      class="p-3 w-12 h-12 cursor-pointer stroke-teal-600"
    />
    <ol
      class="hidden group-hover:block overflow-auto absolute top-0 -right-0 -left-40 z-50 p-5 pl-12 max-w-[90vw] list-decimal text-zinc-100 bg-zinc-800 rounded shadow-lg w-100"
    >
      <li
        v-for="(item, index) in list"
        :key="index"
      >
        {{ item }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AnnotationIcon } from '@heroicons/vue/outline';

const props = defineProps<{
  text: string
}>();

const list = computed(() => {
  return props.text.split("\n").map(item => item.trim()).join('\n').split("\n\n");
});

</script>

<style scoped>

</style>
