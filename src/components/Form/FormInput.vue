<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  disabled: Boolean,
  format: {
    type: String,
    default: null,
  },
  // --- Tambahan Prop Baru ---
  isTextarea: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: [Number, String],
    default: 3,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  let value = event.target.value

  if (props.format === 'uppercase') {
    value = value.toUpperCase()
  } else if (props.format === 'capitalize') {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  } else if (props.format === 'title') {
    // Format: "Jakarta Barat" (Setiap awal kata kapital)
    value = value
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  } else if (props.format === 'number') {
    // Tetap ada sebagai cadangan jika user melakukan paste teks
    value = value.replace(/[^0-9]/g, '')
  }

  emit('update:modelValue', value)
}

const handleKeyDown = (event) => {
  if (props.format === 'number') {
    // Daftar tombol yang diizinkan (Backspace, Del, Arrow, Tab, Enter)
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']

    // Cek apakah tombol yang ditekan adalah angka 0-9
    const isNumber = /^[0-9]$/.test(event.key)

    // Jika bukan angka dan bukan tombol yang diizinkan, batalkan inputnya
    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault()
    }
  }
}
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-black dark:text-white">
      {{ label }}
    </label>

    <!-- Jika isTextarea true -->
    <textarea
      v-if="isTextarea"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      @keydown="handleKeyDown"
      @input="handleInput"
      class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-2 dark:border-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-meta-4"
      :class="{ 'border-danger': error }"
    ></textarea>

    <!-- Jika Input Biasa -->
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown="handleKeyDown"
      @input="handleInput"
      class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-2 dark:border-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-meta-4"
      :class="{ 'border-danger': error }"
    />

    <p v-if="error" class="mt-1 text-xs text-danger">
      {{ error }}
    </p>
  </div>
</template>
