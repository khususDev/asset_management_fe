<template>
  <div class="mx-auto max-w-screen-2xl relative">
    <div
      v-if="toast.show"
      class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
      :class="
        toast.type === 'success'
          ? 'border-success bg-success/5'
          : 'border-danger bg-danger/5'
      "
    >
      <div
        class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
        :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <span class="text-xs font-bold">{{
          toast.type === "success" ? "✓" : "✕"
        }}</span>
      </div>
      <div>
        <h5 class="font-semibold text-black dark:text-white text-sm">
          {{ toast.type === "success" ? "Sukses" : "Gagal" }}
        </h5>
        <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
      </div>
    </div>

    <Breadcrumb
      pageTitle="Purchase Request"
      :crumbs="['Operations', 'Asset Operations']"
    />

    <DataTable
      :headers="[
        'PR Number',
        'Created',
        'Department',
        'Est. Amount',
        'Status',
        'Action',
      ]"
      :from="requestsData.from"
      :to="requestsData.to"
      :total="requestsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="$router.push({ name: 'opt_purchase_request.create' })"
          class="rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 shadow-md"
        >
          Create New Request
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="item in requestsData.data"
        :key="item.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-bold text-primary dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.request_number }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.user?.name || "Unknown" }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.department?.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-right font-medium text-meta-3 last:border-r-0 dark:border-strokedark"
        >
          {{ formatCurrency(item.total_estimated_amount) }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <span
            class="inline-block rounded px-2.5 py-0.5 text-sm font-medium"
            :class="{
              'bg-warning/20 text-warning': item.status === 'PENDING',
              'bg-warning/20 text-primary': item.status === 'PARTIAL_APPROVED',
              'bg-success/20 text-success': item.status === 'APPROVED',
              'bg-danger/20 text-danger': item.status === 'REJECTED',
              'bg-primary/20 text-primary': item.status === 'PO_CREATED',
            }"
          >
            {{ item.status }}
          </span>
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <div class="flex items-center justify-center gap-3">
            <button
              @click="openDetailModal(item.id)"
              class="text-gray-500 hover:text-primary/70"
              title="View Detail"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
            <button
              @click="printPR(item.id)"
              class="text-gray-500 hover:text-primary transition-colors"
              title="Cetak PDF Form Excel"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
                ></path>
              </svg>
            </button>

            <TableAction
              v-if="item.status === 'PENDING'"
              @edit="
                $router.push({
                  name: 'opt_purchase_request.edit',
                  params: { id: item.id },
                })
              "
              @delete="openDeleteModal(item.id)"
            />
            <span v-else class="text-xs text-gray-400 italic">Locked</span>
          </div>
        </td>
      </tr>

      <TableEmpty
        v-if="
          !isFetching && (!requestsData.data || requestsData.data.length === 0)
        "
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="requestsData.links" @change-page="fetchRequests" />
      </template>
    </DataTable>

    <ConfirmModal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <DetailModal
      :show="showDetailModal"
      :request="selectedRequest"
      @close="showDetailModal = false"
      @mark-approved="markApproved"
    />
  </div>
</template>

<script setup>
import { API_BASE_URL, API_ENDPOINTS } from "@/api/endpoints";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import Breadcrumb from "@/Components/Page/Breadcrumb.vue";
import DataTable from "@/Components/Table/DataTable.vue";
import Pagination from "@/Components/Table/Pagination.vue";
import TableAction from "@/Components/Table/TableAction.vue";
import TableEmpty from "@/Components/Table/TableEmpty.vue";
import TableLoading from "@/Components/Table/TableLoading.vue";
import ConfirmModal from "@/Components/Modal/ConfirmModal.vue";
import useTable from "@/Composables/useTable";
import DetailModal from "./DetailModal.vue";

const router = useRouter();
const requestsData = ref({});
const isFetching = ref(false);
const apiUrl = API_ENDPOINTS.optPurchaseRequest;
const showDetailModal = ref(false);
const detailData = ref(null);
const selectedRequest = ref(null);

// State Modal Delete Kustom
const showDeleteModal = ref(false);
const selectedIdForDelete = ref(null);

// State Toast Kustom
const toast = ref({ show: false, type: "success", message: "" });
const showToast = (type, message) => {
  toast.value = { show: true, type, message };
  setTimeout(() => {
    toast.value.show = false;
  }, 4000);
};

const { search, entries } = useTable({ search: "", entries: 10 }, () =>
  fetchRequests(),
);

const formatCurrency = (value) => {
  if (!value || value == 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const openDetailModal = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    selectedRequest.value = response.data.data;
    showDetailModal.value = true;
  } catch (error) {
    showToast("danger", "Gagal mengambil detail.");
  }
};

const fetchRequests = async (url = apiUrl) => {
  isFetching.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
      headers: { Authorization: `Bearer ${token}` },
    });
    requestsData.value = response.data.data;
  } catch (error) {
    showToast("danger", "Gagal memuat data dari server.");
  } finally {
    isFetching.value = false;
  }
};

// Buka modal hapus kustom
const openDeleteModal = (id) => {
  selectedIdForDelete.value = id;
  showDeleteModal.value = true;
};

// Eksekusi hapus kustom setelah konfirmasi
const handleDelete = async () => {
  showDeleteModal.value = false;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${apiUrl}/${selectedIdForDelete.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    showToast("success", response.data.message || "Data berhasil dihapus.");
    fetchRequests();
  } catch (error) {
    showToast(
      "danger",
      error.response?.data?.message || "Gagal menghapus data.",
    );
  }
};

// Buka link Cetak PDF di tab baru
const printPR = async (id) => {
  try {
    const token = localStorage.getItem("token");

    // 1. Ambil data HTML mentah dari backend dengan menyertakan token auth
    const response = await axios.get(`${apiUrl}/${id}/print`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Buka tab baru kosong
    const printWindow = window.open("", "_blank");

    // 3. Tulis isi HTML yang didapat dari backend ke tab baru tersebut
    printWindow.document.write(response.data);
    printWindow.document.close();
  } catch (error) {
    showToast(
      "danger",
      "Gagal memproses cetak dokumen. Pastikan Anda masih login.",
    );
    console.error(error);
  }
};

const markApproved = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${apiUrl}/${id}/mark-approved`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    showToast("success", response.data.message);

    showDetailModal.value = false;

    fetchRequests();
  } catch (error) {
    showToast("danger", error.response?.data?.message || "Gagal approve.");
  }
};

onMounted(() => fetchRequests());
</script>
