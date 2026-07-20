import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/login',
    name: 'Signin',
    component: () => import('@/views/Auth/Signin.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Ecommerce.vue'),
      },
      // User Management
      {
        path: 'account',
        name: 'sys_account',
        component: () => import('@/views/Pages/Administration/User/Account/Index.vue'),
      },
      {
        path: 'roles',
        name: 'sys_roles',
        component: () => import('@/views/Pages/Administration/User/Roles/Index.vue'),
      },
      {
        path: 'permission',
        name: 'sys_permission',
        component: () => import('@/views/Pages/Administration/User/Permission/Index.vue'),
      },
      // System Management
      {
        path: 'appconfig',
        name: 'sys_setting',
        component: () => import('@/views/Pages/Administration/Config/AppSetting/Index.vue'),
      },
      {
        path: 'document',
        name: 'sys_docs',
        component: () => import('@/views/Pages/Administration/Config/DocsNumb/Index.vue'),
      },
      {
        path: 'approval',
        name: 'sys_wfl_approval',
        component: () => import('@/views/Pages/Administration/Config/ApprovalSetting/Index.vue'),
      },
      {
        path: 'notification',
        name: 'sys_notif_setting',
        component: () =>
          import('@/views/Pages/Administration/Config/NotificationSetting/Index.vue'),
      },
      {
        path: 'logs',
        name: 'sys_logs',
        component: () => import('@/views/Pages/Administration/Config/SystemLogs/Index.vue'),
      },
      // Master Data Organization
      {
        path: 'branch',
        name: 'org_branch',
        component: () =>
          import('@/views/Pages/Administration/Master/Organization/Branch/Index.vue'),
      },
      {
        path: 'department',
        name: 'org_department',
        component: () =>
          import('@/views/Pages/Administration/Master/Organization/Department/Index.vue'),
      },
      {
        path: 'location',
        name: 'org_location',
        component: () =>
          import('@/views/Pages/Administration/Master/Organization/Location/Index.vue'),
      },
      {
        path: 'costcenter',
        name: 'org_costcenter',
        component: () =>
          import('@/views/Pages/Administration/Master/Organization/CostCenter/Index.vue'),
      },
      // Master Data Asset
      {
        path: 'Category',
        name: 'asm_category',
        component: () => import('@/views/Pages/Administration/Master/Asset/Category/Index.vue'),
      },
      {
        path: 'Type',
        name: 'asm_type',
        component: () => import('@/views/Pages/Administration/Master/Asset/Type/Index.vue'),
      },
      {
        path: 'brand',
        name: 'asm_brand',
        component: () => import('@/views/Pages/Administration/Master/Asset/Brand/Index.vue'),
      },
      {
        path: 'model',
        name: 'asm_model',
        component: () => import('@/views/Pages/Administration/Master/Asset/Model/Index.vue'),
      },
      {
        path: 'status',
        name: 'asm_status',
        component: () => import('@/views/Pages/Administration/Master/Asset/Status/Index.vue'),
      },
      // Master Data License
      {
        path: 'type',
        name: 'lcs_type',
        component: () => import('@/views/Pages/Administration/Master/License/Type/Index.vue'),
      },
      {
        path: 'metric',
        name: 'lcs_metric',
        component: () => import('@/views/Pages/Administration/Master/License/Metric/Index.vue'),
      },
      // Master Data Procurement
      {
        path: 'vendor-type',
        name: 'prc_vendor_type',
        component: () => import('@/views/Pages/Administration/Master/Procurement/Type/Index.vue'),
      },
      {
        path: 'vendor',
        name: 'prc_vendor',
        component: () => import('@/views/Pages/Administration/Master/Procurement/Vendor/Index.vue'),
      },
      {
        path: 'uom',
        name: 'prc_uom',
        component: () => import('@/views/Pages/Administration/Master/Procurement/Uom/Index.vue'),
      },
      {
        path: 'payment',
        name: 'prc_payment',
        component: () =>
          import('@/views/Pages/Administration/Master/Procurement/Payment/Index.vue'),
      },
      {
        path: 'tax',
        name: 'prc_tax',
        component: () => import('@/views/Pages/Administration/Master/Procurement/Tax/Index.vue'),
      },
      // Master Data Maintenance
      {
        path: 'type',
        name: 'mnt_type',
        component: () => import('@/views/Pages/Administration/Master/Maintenance/Type/Index.vue'),
      },
      {
        path: 'schedule',
        name: 'mnt_schedule',
        component: () =>
          import('@/views/Pages/Administration/Master/Maintenance/ScheduleType/Index.vue'),
      },

      // Operation
      {
        path: 'purchase_request',
        name: 'opt_purchase_request',
        component: () => import('@/views/Pages/Procurement/PurchaseRequest/Index.vue'),
      },
      {
        path: 'purchase_request/create',
        name: 'opt_purchase_request.create',
        component: () => import('@/views/Pages/Procurement/PurchaseRequest/Create.vue'),
      },
      {
        path: 'purchase_request/edit/:id',
        name: 'opt_purchase_request.edit',
        component: () => import('@/views/Pages/Procurement/PurchaseRequest/Edit.vue'),
      },
      {
        path: 'purchase_order',
        name: 'opt_purchase_order',
        component: () => import('@/views/Pages/Procurement/PurchaseOrder/Index.vue'),
      },
      {
        path: 'purchase_order/create',
        name: 'opt_purchase_order.create',
        component: () => import('@/views/Pages/Procurement/PurchaseOrder/Create.vue'),
      },
      {
        path: 'transfer_request',
        name: 'opt_transfer_request',
        component: () => import('@/views/Pages/Procurement/TransferRequest/Index.vue'),
      },
      {
        path: 'goods_receipt',
        name: 'opt_goods_receipt',
        component: () => import('@/views/Pages/Procurement/GoodsReceipt/Index.vue'),
      },
      {
        path: 'goods_receipt/create',
        name: 'opt_goods_receipt.create',
        component: () => import('@/views/Pages/Procurement/GoodsReceipt/Create.vue'),
      },
      {
        path: 'goods_receipt/edit/:id',
        name: 'opt_goods_receipt.edit',
        component: () => import('@/views/Pages/Procurement/GoodsReceipt/Edit.vue'),
      },

      // Asset Operations
      {
        path: 'Registry',
        name: 'opt_asset_registration',
        component: () => import('@/views/Pages/Operation/Registry/Index.vue'),
      },
      {
        path: 'assignment',
        name: 'opt_asset_assignment',
        component: () => import('@/views/Pages/Operation/Assignment/Index.vue'),
      },
      {
        path: 'movement',
        name: 'opt_asset_movement',
        component: () => import('@/views/Pages/Operation/Movement/Index.vue'),
      },
      {
        path: 'disposal',
        name: 'opt_asset_disposal',
        component: () => import('@/views/Pages/Operation/Disposal/Index.vue'),
      },

      // Approval
      {
        path: 'waiting-approval',
        name: 'apl_inbox_waiting',
        component: () => import('@/views/Pages/Approval/Waiting/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'submission',
        name: 'apl_inbox_submission',
        component: () => import('@/views/Pages/Approval/Submission/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'history',
        name: 'apl_inbox_history',
        component: () => import('@/views/Pages/Approval/History/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'approval-setting',
        name: 'apl_approval_setting',
        component: () => import('@/views/Pages/Approval/Setting/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },

      // Asset Complience
      {
        path: 'License Registry',
        name: 'a&l_license_registry',
        component: () => import('@/views/Pages/Complience/LicenseRegistry/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'Contract-Leases',
        name: 'a&l_contract_leases',
        component: () => import('@/views/Pages/Complience/ContractLeases/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'Warranty',
        name: 'a&l_warranty',
        component: () => import('@/views/Pages/Complience/Warranty/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'Audit Verification',
        name: 'a&l_audit_verification',
        component: () => import('@/views/Pages/Complience/AuditVerification/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },

      // Maintenance
      {
        path: 'maintenance-record',
        name: 'maintenance_record',
        component: () => import('@/views/Pages/Maintenance/WorkOrder/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'maintenance-history',
        name: 'maintenance_history',
        component: () => import('@/views/Pages/Maintenance/History/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },

      // Inventory
      {
        path: 'sparepart',
        name: 'sparepart',
        component: () => import('@/views/Pages/Inventory/SparePart/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'consumable',
        name: 'consumable',
        component: () => import('@/views/Pages/Inventory/Consumable/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'stock-movement',
        name: 'stock_movement',
        component: () => import('@/views/Pages/Inventory/Movement/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'stock-opname',
        name: 'stock_opname',
        component: () => import('@/views/Pages/Inventory/Opname/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
      {
        path: 'stock-adjustment',
        name: 'stock_adjustment',
        component: () => import('@/views/Pages/Inventory/Adjustment/Index.vue'), // Sesuaikan dengan lokasi file Anda
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Signin' })
  } else if (to.name === 'Signin' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
