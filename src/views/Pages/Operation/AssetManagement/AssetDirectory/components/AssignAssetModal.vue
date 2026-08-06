<!-- src/Components/Modal/AssignAssetModal.vue -->
<template>
  <Modal :show="show" title="Assign / Penyerahan Aset" @close="handleClose">
    <div class="p-6 flex flex-col gap-4">
      <!-- Info Singkat Aset yang akan di-assign -->
      <div
        v-if="asset"
        class="p-3 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark text-sm"
      >
        <!-- Nama Aset -->
        <div class="font-semibold text-black dark:text-white">
          {{ asset.name || asset.asset_name || asset.asset?.name || 'Nama Aset Tidak Tersedia' }}
        </div>

        <!-- Tag / Kode & Serial Number -->
        <div class="text-xs text-gray-500 mt-1 flex gap-4">
          <span>
            Tag/Kode:
            <strong class="text-gray-700 dark:text-gray-300">
              {{ asset.code || asset.asset_code || asset.asset_tag || asset.asset?.code || '-' }}
            </strong>
          </span>
          <span>
            SN:
            <strong class="text-gray-700 dark:text-gray-300">
              {{ asset.serial_number || asset.asset?.serial_number || '-' }}
            </strong>
          </span>
        </div>
      </div>
      <!-- Tipe Penerima (User / Department / Location) -->
      <div>
        <label class="mb-2 block text-sm font-medium text-black dark:text-white">
          Tipe Penerima <span class="text-danger">*</span>
        </label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              v-model="form.assigned_type"
              value="user"
              class="text-primary focus:ring-primary"
            />
            <span>Karyawan (User)</span>
          </label>
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              v-model="form.assigned_type"
              value="department"
              class="text-primary focus:ring-primary"
            />
            <span>Departemen</span>
          </label>
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              v-model="form.assigned_type"
              value="location"
              class="text-primary focus:ring-primary"
            />
            <span>Lokasi / Ruangan</span>
          </label>
        </div>
      </div>

      <!-- Select Penerima (Dinamis berdasarkan Tipe Penerima) -->
      <div>
        <label class="mb-2.5 block text-sm font-medium text-black dark:text-white">
          Pilih {{ assigneeLabel }} <span class="text-danger">*</span>
        </label>
        <select
          v-model="form.assigned_to_id"
          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          :class="{ 'border-danger': errors?.assigned_to_id }"
        >
          <option value="">-- Pilih {{ assigneeLabel }} --</option>
          <option v-for="item in assigneeOptions" :key="item.id" :value="item.id">
            {{ item.name }} {{ item.code ? `(${item.code})` : '' }}
          </option>
        </select>
        <p v-if="errors?.assigned_to_id" class="mt-1 text-xs text-danger">
          {{ errors.assigned_to_id[0] }}
        </p>
      </div>

      <!-- Tanggal Penyerahan & BAST Number -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Tanggal Penyerahan"
          type="date"
          v-model="form.assigned_date"
          :error="errors?.assigned_date ? errors.assigned_date[0] : null"
        />

        <FormInput
          label="No. BAST / Referensi"
          v-model="form.reference_number"
          placeholder="Contoh: BAST/2026/08/001"
          :error="errors?.reference_number ? errors.reference_number[0] : null"
        />
      </div>

      <!-- Kondisi Aset Saat Diserahkan -->
      <div>
        <label class="mb-2.5 block text-sm font-medium text-black dark:text-white">
          Kondisi Aset Saat Diserahkan
        </label>
        <select
          v-model="form.condition"
          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option value="GOOD">Good (Bagus)</option>
          <option value="FAIR">Fair (Cukup)</option>
          <option value="NEEDS_REPAIR">Needs Repair (Butuh Perbaikan)</option>
        </select>
      </div>

      <!-- Catatan / Kelengkapan -->
      <div>
        <label class="mb-2.5 block text-sm font-medium text-black dark:text-white">
          Catatan / Kelengkapan
        </label>
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Misal: Termasuk charger laptop, mouse, dan tas..."
          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <button
        @click="handleClose"
        class="px-4 py-2 text-black dark:text-white hover:text-opacity-80"
      >
        Batal
      </button>
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 transition-all"
      >
        {{ loading ? 'Memproses...' : 'Proses Assignment' }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/Components/Modal/Modal.vue'
import FormInput from '@/Components/Form/FormInput.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  asset: { type: Object, default: null },
  users: { type: Array, default: () => [] },
  departments: { type: Array, default: () => [] },
  locations: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'submit'])

const today = new Date().toISOString().split('T')[0]

const form = ref({
  assigned_type: 'user',
  assigned_to_id: '',
  assigned_date: today,
  reference_number: '',
  condition: 'GOOD',
  notes: '',
})

// Reset form saat modal dibuka
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value = {
        assigned_type: 'user',
        assigned_to_id: '',
        assigned_date: today,
        reference_number: '',
        condition: props.asset?.condition || props.asset?.asset?.condition || 'GOOD',
        notes: '',
      }
    }
  },
  { immediate: true },
)

// 🛠️ PERBAIKAN: Reset assigned_to_id jika tipe penerima (radio button) berganti
watch(
  () => form.value.assigned_type,
  () => {
    form.value.assigned_to_id = ''
  },
)

// Dynamic Label
const assigneeLabel = computed(() => {
  if (form.value.assigned_type === 'user') return 'Karyawan'
  if (form.value.assigned_type === 'department') return 'Departemen'
  return 'Lokasi / Ruangan'
})

// Dynamic Options dengan Safe Fallback Array
const assigneeOptions = computed(() => {
  if (form.value.assigned_type === 'user') return props.users || []
  if (form.value.assigned_type === 'department') return props.departments || []
  return props.locations || []
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    asset_id: props.asset?.id,
    ...form.value,
  })
}
</script>
