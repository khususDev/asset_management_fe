<template>
    <div class="mx-auto max-w-screen-2xl relative">
        <!-- Toast Notifikasi Kustom -->
        <div v-if="toast.show"
            class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
            :class="toast.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'">
            <div class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
                :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'">
                <span class="text-xs font-bold">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
            </div>
            <div>
                <h5 class="font-semibold text-black dark:text-white text-sm">
                    {{ toast.type === 'success' ? 'Sukses' : 'Gagal' }}
                </h5>
                <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
            </div>
        </div>

        <Breadcrumb pageTitle="Buat Purchase Order Baru" :crumbs="['Operations', 'Purchase Order', 'Create']" />

        <!-- Loading Bar & Skeleton -->
        <div v-if="isDataFetching" class="fixed top-0 left-0 w-full h-1 z-[99999] bg-primary/10 overflow-hidden">
            <div class="h-full bg-primary indeterminate-bar"></div>
        </div>

        <div v-if="isDataFetching"
            class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark mb-6 animate-pulse">
            <div class="p-5 bg-gray-100 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark mb-6">
                <div class="h-5 bg-gray-200 dark:bg-form-input rounded w-1/4 mb-5"></div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
                    <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
                    <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
                </div>
            </div>
        </div>

        <div v-else
            class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <div class="p-6.5 flex flex-col gap-6">

                <!-- HEADER DOKUMEN PO -->
                <div class="p-5 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark">
                    <h3 class="font-bold text-black dark:text-white mb-4 text-lg border-b border-stroke pb-2">
                        Informasi Utama PO (Header)
                    </h3>

                    <!-- Ditambahkan kolom Department di grid ini menjadi 3 kolom -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">PO Number</label>
                            <input type="text" disabled placeholder="[ Otomatis Tergenerasi Sistem ]"
                                class="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-2 px-4 outline-none dark:border-form-strokedark dark:bg-meta-4 text-gray-500 font-bold text-center cursor-not-allowed italic" />
                        </div>

                        <!-- TAMBAHAN: Department -->
                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Department *</label>
                            <select v-model="form.department_id"
                                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <option value="" disabled>Pilih Department</option>
                                <option v-for="dept in masters.departments" :key="dept.id" :value="dept.id">
                                    {{ dept.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Referensi PR
                                (Opsional)</label>
                            <select v-model="form.pr_id"
                                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <option value="">-- Tanpa Referensi PR (Direct PO) --</option>
                                <option v-for="pr in masters.prs" :key="pr.id" :value="pr.id">
                                    {{ pr.pr_number }} - {{ pr.purpose }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Vendor *</label>
                            <select v-model="form.vendor_id"
                                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <option value="" disabled>Pilih Vendor</option>
                                <option v-for="vendor in masters.vendors" :key="vendor.id" :value="vendor.id">
                                    {{ vendor.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Term of Payment (TOP)
                                *</label>
                            <select v-model="form.payment_term_id"
                                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <option value="" disabled>Pilih Pembayaran</option>
                                <option v-for="pay in masters.payments" :key="pay.id" :value="pay.id">
                                    {{ pay.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Delivery Branch *</label>
                            <select v-model="form.delivery_branch_id"
                                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <option value="" disabled>Pilih Lokasi Pengiriman</option>
                                <option v-for="branch in masters.branchs" :key="branch.id" :value="branch.id">
                                    {{ branch.code }} - {{ branch.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label class="mb-2.5 block text-black dark:text-white font-medium">Estimasi Kedatangan
                                Barang</label>
                            <DateInput v-model="form.expected_arrival_date" />
                        </div>

                        <div class="flex flex-col gap-2 justify-center pt-4">
                            <label
                                class="flex items-center gap-2 text-sm cursor-pointer font-medium text-black dark:text-white">
                                <input type="checkbox" v-model="form.is_taxable" class="w-5 h-5 text-primary" />
                                PO ini dikenakan PPN (Tax)
                            </label>
                            <span class="text-xs text-gray-500">Centang jika total belanja ditambah PPN (contoh:
                                11%).</span>
                        </div>
                    </div>

                    <div>
                        <label class="mb-2.5 block text-black dark:text-white font-medium">Catatan Tambahan
                            (Notes)</label>
                        <textarea v-model="form.notes" rows="2" placeholder="Catatan untuk vendor atau internal..."
                            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"></textarea>
                    </div>
                </div>

                <!-- DETAILS (ITEMS) -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-black dark:text-white text-lg">Daftar Barang (Items)</h3>
                        <button @click="addItem" type="button"
                            class="bg-primary text-white px-4 py-2 text-sm rounded hover:bg-opacity-90 font-medium flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4"></path>
                            </svg>
                            Tambah Barang
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div v-for="(item, index) in form.items" :key="index"
                            class="p-4 border-[1.5px] border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-boxdark hover:border-primary/50 transition-colors relative group">

                            <button @click="removeItem(index)" type="button"
                                class="absolute top-4 right-4 text-danger hover:text-opacity-70 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                                Hapus
                            </button>

                            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div class="md:col-span-5">
                                    <label class="mb-1 block text-sm font-medium text-black dark:text-white">Deskripsi
                                        Barang *</label>
                                    <input type="text" v-model="item.item_description"
                                        placeholder="Ketik nama barang..."
                                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input" />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="mb-1 block text-sm font-medium text-black dark:text-white">Qty
                                        *</label>
                                    <input type="number" v-model="item.quantity" min="1"
                                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-center focus:border-primary dark:border-form-strokedark dark:bg-form-input" />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="mb-1 block text-sm font-medium text-black dark:text-white">Satuan
                                        (UoM)</label>
                                    <select v-model="item.uom_id"
                                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option value="" disabled>Pilih Unit</option>
                                        <option v-for="uom in masters.uoms" :key="uom.id" :value="uom.id">
                                            {{ uom.name }}
                                        </option>
                                    </select>
                                </div>

                                <div class="md:col-span-3">
                                    <label class="mb-1 block text-sm font-medium text-black dark:text-white">Harga
                                        Satuan *</label>
                                    <input type="number" v-model="item.unit_price"
                                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-right focus:border-primary dark:border-form-strokedark dark:bg-form-input" />
                                </div>
                            </div>

                            <div
                                class="mt-3 flex justify-between items-center border-t border-stroke dark:border-strokedark pt-3">
                                <div class="w-1/2">
                                    <input type="text" v-model="item.notes" placeholder="Catatan spesifik item ini..."
                                        class="w-full border-b bg-transparent py-1 text-sm outline-none focus:border-primary dark:border-form-strokedark" />
                                </div>
                                <div class="text-right">
                                    <span class="text-xs text-gray-500 block">Subtotal Item</span>
                                    <span class="text-md font-bold text-meta-3">{{ formatCurrency(item.quantity *
                                        item.unit_price) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOOTER & TOTAL CALCULATIONS -->
                <div
                    class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-stroke pt-6">
                    <div class="flex gap-4">
                        <button @click="$router.push({ name: 'opt_purchase_order' })"
                            class="px-6 py-2 rounded border border-stroke text-black dark:border-strokedark dark:text-white hover:bg-gray-100 transition-all">
                            Batal
                        </button>
                        <button @click="submitForm" :disabled="loading || form.items.length === 0"
                            class="px-6 py-2 rounded bg-primary text-white font-medium hover:bg-opacity-90 disabled:bg-opacity-50 transition-all shadow-md">
                            {{ loading ? 'Menyimpan...' : 'Terbitkan Purchase Order' }}
                        </button>
                    </div>

                    <div
                        class="bg-gray-50 dark:bg-meta-4 py-4 px-6 rounded-lg border border-stroke dark:border-strokedark flex flex-col gap-2 min-w-[300px] shadow-sm text-right">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Subtotal:</span>
                            <span class="font-bold text-black dark:text-white">{{ formatCurrency(subTotal) }}</span>
                        </div>
                        <div class="flex justify-between text-sm" v-if="form.is_taxable">
                            <span class="text-gray-500">PPN (11%):</span>
                            <span class="font-bold text-danger">{{ formatCurrency(taxAmount) }}</span>
                        </div>
                        <div
                            class="flex justify-between items-center border-t border-stroke dark:border-strokedark pt-2 mt-1">
                            <span class="font-bold text-sm text-black dark:text-white uppercase tracking-wider">Grand
                                Total:</span>
                            <span class="text-xl font-bold text-primary ml-auto">{{ formatCurrency(grandTotal) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DateInput from '@/components/Form/DateInput.vue'

const router = useRouter()
const loading = ref(false)
const isDataFetching = ref(true)

// TAMBAHAN: tambahkan departments ke inisialisasi state masters
const masters = ref({ uoms: [], vendors: [], payments: [], branchs: [], prs: [], departments: [] })

// 🔥 STATE UNTUK PURCHASE ORDER
const form = ref({
    department_id: '', // TAMBAHAN: field untuk department
    vendor_id: '',
    pr_id: '', // Relasi ke PR jika ada
    payment_term_id: '',
    delivery_branch_id: '',
    expected_arrival_date: '',
    is_taxable: false, // Checkbox PPN
    notes: '',
    items: []
})

const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
    toast.value = { show: true, type, message }
    setTimeout(() => { toast.value.show = false }, 4000)
}

const formatCurrency = (value) => {
    if (!value || value == 0) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(value)
}

// 🔥 PERHITUNGAN OTOMATIS PO
const subTotal = computed(() => {
    if (!form.value.items) return 0
    return form.value.items.reduce((total, item) => total + (item.quantity * item.unit_price), 0)
})

const taxAmount = computed(() => {
    if (!form.value.is_taxable) return 0
    // Mengasumsikan PPN adalah 11% (bisa disesuaikan jika rate dinamis)
    return subTotal.value * 0.11
})

const grandTotal = computed(() => {
    return subTotal.value + taxAmount.value
})

const fetchMasterDataOnly = async () => {
    const token = localStorage.getItem('token')
    isDataFetching.value = true

    try {
        // Sesuaikan endpoint ini dengan endpoint PO master data milik Anda
        const response = await axios.get(API_ENDPOINTS.optPurchaseOrder_masters, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const masterData = response.data.data

        masters.value = {
            uoms: masterData.uoms,
            vendors: masterData.vendors,
            payments: masterData.payments,
            branchs: masterData.branchs,
            prs: masterData.prs,
            departments: masterData.departments || [], // TAMBAHAN: Menampung data department
        }

        if (form.value.items.length === 0) addItem()
    } catch (error) {
        showToast('danger', 'Gagal memuat master data dari server.')
    } finally {
        isDataFetching.value = false
    }
}

const addItem = () => {
    form.value.items.push({
        item_description: '',
        quantity: 1,
        uom_id: '',
        unit_price: 0,
        notes: '',
    })
}

const removeItem = (index) => {
    form.value.items.splice(index, 1)
}

const submitForm = async () => {
    loading.value = true
    try {
        const token = localStorage.getItem('token')

        const payload = {
            ...form.value,
            sub_total: subTotal.value,
            tax_amount: taxAmount.value,
            grand_total: grandTotal.value
        }

        const response = await axios.post(API_ENDPOINTS.optPurchaseOrder, payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        showToast('success', response.data.message || 'Purchase Order berhasil diterbitkan!')

        setTimeout(() => {
            router.push({ name: 'opt_purchase_order' })
        }, 1500)
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Gagal menyimpan. Pastikan semua kolom wajib (*) terisi.'
        showToast('danger', errorMsg)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMasterDataOnly()
})
</script>

<style scoped>
.indeterminate-bar {
    width: 40%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 2px;
    animation: progress-bar-motion 1.2s infinite linear;
}

@keyframes progress-bar-motion {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(250%);
    }
}
</style>