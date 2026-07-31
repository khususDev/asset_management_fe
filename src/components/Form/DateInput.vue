<template>
  <VueDatePicker
    v-model="date"
    :min-date="new Date()"
    :enable-time-picker="false"
    model-type="yyyy-MM-dd"
    format="yyyy-MM-dd"
    :dark="isDark"
    placeholder="Pilih Tanggal"
    auto-apply
    class="font-small m-0"
  />
</template>

<script setup>
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const date = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})
</script>

<style>
.dp__main {
  width: 100% !important;
}
</style>
