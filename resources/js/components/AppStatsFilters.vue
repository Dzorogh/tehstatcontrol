<template>
  <div>
    <div class="flex flex-row flex-wrap gap-4 mb-4">
      <div class="basis-full lg:basis-48">
        <AppSelect
          v-model="selectedFilters.yearId"
          :options="availableFilters.years"
          title="Год"
          option-label="value"
          option-value="id"
          :classes="defaultClasses"
          :is-loading="isLoading"
          @change="applyFilters"
        />
      </div>
      <div class="basis-full lg:basis-48">
        <AppSelect
          v-model="selectedFilters.categoryId"
          :options="availableFilters.categories"
          title="Тип техники"
          option-label="title"
          option-value="id"
          :classes="defaultClasses"
          :is-loading="isLoading"
          @change="applyFilters"
        />
      </div>
      <div class="basis-full lg:basis-48">
        <AppSelect
          v-model="selectedFilters.brandsIds"
          :options="availableFilters.brands"
          :multiple="true"
          title="Бренды"
          option-label="title"
          option-value="id"
          :classes="defaultClasses"
          :is-loading="isLoading"
          @change="applyFilters"
        />
      </div>
    </div>
    <div
      v-if="sortedFilterAttributes.length"
      class="flex flex-row flex-wrap gap-4"
    >
      <div
        v-for="attribute in sortedFilterAttributes"
        :key="attribute.id"
        class="basis-full lg:basis-auto"
      >
        <AppSelect
          :model-value="getAttributeFilter(attribute.id)"
          :options="sortedAttributeValues(attribute)"
          :title="attribute.title"
          
          :option-label="getAttributeOptionLabel.bind(null, attribute)"
          option-value="value"
          :multiple="true"
          :classes="defaultClasses"
          
          :is-loading="isLoading"
          @update:model-value="setAttributeFilter(attribute.id, $event)"
        />
      </div>
    </div>
    <div
      v-if="hasFilters"
      class="mt-4"
    >
      <button
        class="flex items-center py-1 px-3 text-sm text-zinc-100 bg-teal-600 hover:bg-teal-500 rounded cursor-pointer select-none lg:inline-flex"
        @click="resetFilters"
      >
        <TrashIcon class="mr-2 w-4 h-4" />
        Сбросить фильтры
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/outline';
import { computed, reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { AppSelect, defaultClasses, Classes } from './AppSelect';
import { Attribute } from '../types/Attribute';
import { AvailableFilters } from '../types/AvailableFilters';
import { Value } from '../types/Value';
import { formatDataType } from '../formatters/valueFormatters';
import { RequestFilters } from '../types/RequestFilters';

const props = defineProps<{
  requestFilters: RequestFilters;
  availableFilters: AvailableFilters;
  isLoading: boolean
}>();

const emit = defineEmits<{
  (e: 'update:filters', filters: RequestFilters): void;
}>();

const sortedFilterAttributes = computed(() => {
  return [...props.availableFilters.attributes].sort((a, b) => {
    return a.groupId - b.groupId || a.order - b.order || a.title.localeCompare(b.title, ['en', 'ru'], {numeric: true});
  });
});

const sortedAttributeValues = (attribute: Attribute) => {
  if (attribute.dataType === 'country') {
    return attribute.values.sort((a, b) => {
      return (formatDataType(attribute.dataType, a.value) + '').localeCompare(formatDataType(attribute.dataType, b.value), ['en', 'ru'], {numeric: true});
    })
  }
  
  return attribute.values;
}

const emptyFilters: RequestFilters = {
  brandsIds: [],
  attributes: [],
  categoryId: null,
};

const selectedFilters = reactive<RequestFilters>(props.requestFilters);

watch(() => {
  return props.requestFilters;
}, filters => {
  //console.log('watch: props.requestFilters', filters)
  assignFilters(filters);
});

function getAttributeFilter(attributeId) {
  if (selectedFilters.attributes) {
    return selectedFilters.attributes[attributeId];
  }
  return null;
}

function setAttributeFilter(attributeId, values) {
  // console.log('setAttributeFilter', {
  //   attributeId,
  //   values,
  // });
  
  if (!selectedFilters.attributes) {
    selectedFilters.attributes = {};
  }
  
  if (values.length > 0) {
    selectedFilters.attributes[attributeId] = values;
  } else {
    delete selectedFilters.attributes[attributeId];
  }
  
  applyFilters();
}

function assignFilters(newFilters: RequestFilters) {
  Object.assign(selectedFilters, {
    ...newFilters,
    brandsIds: [...(newFilters.brandsIds || [])],
    attributes: { ...(newFilters.attributes || []) },
  });
}

function resetFilters() {
  // console.log('resetFilters', {
  //   selectedFilters,
  //   emptyFilters,
  // });
  
  assignFilters(emptyFilters);
  applyFilters();
}

const applyFilters = useDebounceFn(() => {
  // console.log('applyFilters', {
  //   selectedFilters,
  // });
  
  emit('update:filters', selectedFilters);
}, 1000)

function getAttributeOptionLabel(attribute: Attribute, option: Value) {
  return formatDataType(attribute.dataType, option.value);
}

const hasFilters = computed(() => {
  return true;
});

</script>

<style scoped>

</style>
