<template>
  <div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
    <ComponentCard title="Top Kategori Asset" desc="Kategori asset dengan jumlah terbanyak.">
      <div class="space-y-3">
        <div
          v-for="item in categories"
          :key="item.name"
          class="flex items-center justify-between rounded-xl border border-stroke/80 bg-secondary/5 px-4 py-3 dark:border-strokedark dark:bg-white/5"
        >
          <span class="text-sm font-medium text-bodydark2">{{ item.name }}</span>
          <span class="text-lg font-semibold text-black dark:text-white">{{ item.count }}</span>
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="Permintaan Terbaru" desc="Empat permintaan terbaru dari pengguna.">
      <div class="overflow-x-auto rounded-xl border border-stroke/80 dark:border-strokedark">
        <table class="min-w-full divide-y divide-stroke text-sm">
          <thead class="bg-slate-50 text-left text-xs uppercase text-bodydark2 dark:bg-[#111827]">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Asset</th>
              <th class="px-4 py-3">Peminta</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stroke dark:divide-strokedark">
            <tr v-for="request in requests" :key="request.id">
              <td class="px-4 py-3">{{ request.id }}</td>
              <td class="px-4 py-3">{{ request.asset }}</td>
              <td class="px-4 py-3">{{ request.requester }}</td>
              <td class="px-4 py-3">
                <span
                  :class="
                    request.status === 'Approved'
                      ? 'text-success'
                      : request.status === 'Pending'
                        ? 'text-warning'
                        : 'text-danger'
                  "
                >
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  requests: {
    type: Array,
    default: () => [],
  },
})
</script>
