<template>
  <div class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ComponentCard
        v-for="stat in stats"
        :key="stat.label"
        :title="stat.label"
        className="!p-5"
        :desc="stat.desc"
      >
        <div class="flex items-end justify-between gap-4">
          <div>
            <span class="text-[2rem] font-semibold text-black dark:text-white">{{
              stat.value
            }}</span>
          </div>
          <span
            :class="[
              'rounded-full px-3 py-1 text-sm font-medium',
              stat.change.startsWith('+')
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger',
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
      </ComponentCard>
    </div>
  </div>
</template>

<script setup>
import ComponentCard from '@/components/common/ComponentCard.vue'

const props = defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
})
</script>
