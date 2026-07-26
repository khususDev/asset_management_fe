<script setup>
import DangerButton from "@/Components/Button/DangerButton.vue";

defineProps({
    show: Boolean,
    title: {
        type: String,
        default: "Konfirmasi",
    },
    message: {
        type: String,
        default: "Apakah anda yakin?",
    },
    // Prop Baru 1: Teks Tombol Konfirmasi
    confirmText: {
        type: String,
        default: "Hapus",
    },
    // Prop Baru 2: Tipe Konfirmasi ('danger' | 'success' | 'primary')
    type: {
        type: String,
        default: "danger",
    }
});

defineEmits(["close", "confirm"]);
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
            <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-boxdark">
                <!-- HEADER -->
                <div class="border-b border-stroke px-6 py-4 dark:border-strokedark">
                    <h3 class="text-lg font-semibold text-black dark:text-white">
                        {{ title }}
                    </h3>
                </div>

                <!-- BODY -->
                <div class="px-6 py-5">
                    <p class="text-sm text-body">
                        {{ message }}
                    </p>
                </div>

                <!-- FOOTER -->
                <div
                    class="flex items-center justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
                    <button @click="$emit('close')"
                        class="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
                        Batal
                    </button>

                    <!-- Jika tipe 'success', tampilkan Tombol Hijau -->
                    <button v-if="type === 'success'" @click="$emit('confirm')"
                        class="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition">
                        {{ confirmText }}
                    </button>

                    <!-- Jika tipe 'primary', tampilkan Tombol Biru -->
                    <button v-else-if="type === 'primary'" @click="$emit('confirm')"
                        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition">
                        {{ confirmText }}
                    </button>

                    <!-- Default / Danger Button -->
                    <DangerButton v-else @click="$emit('confirm')">
                        {{ confirmText }}
                    </DangerButton>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>