<template>
  <div class="space-y-4">
    <ComponentCard title="Tren Pengajuan Aset" desc="Performa permintaan asset setiap bulan.">
      <LineChartOne />
    </ComponentCard>

    <ComponentCard title="Ringkasan Pendapatan" desc="Perkiraan nilai aset dan pemakaian anggaran.">
      <BarChartOne />
    </ComponentCard>
  </div>
</template>

<script setup>
import ComponentCard from '@/components/common/ComponentCard.vue'
import BarChartOne from '@/components/charts/BarChart/BarChartOne.vue'
import LineChartOne from '@/components/charts/LineChart/LineChartOne.vue'
</script>
