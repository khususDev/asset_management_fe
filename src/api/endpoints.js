export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const API_ENDPOINTS = {
  authLogin: '/login',
  authLogout: '/logout',

  asmBrand: '/asm_brand',
  asmType: '/asm_type',
  asmCategory: '/asm_category',
  asmModel: '/asm_model',
  asmStatus: '/asm_status',

  orgBranch: '/org_branch',
  orgLocation: '/org_location',
  orgDepartment: '/org_department',
  orgCostcenter: '/org_costcenter',

  prcVendor: '/prc_vendor',
  prcVendor_type: '/prc_vendor_type',
  prcUom: '/prc_uom',
  prcTax: '/prc_tax',
  prcPayment: '/prc_payment',

  mtnType: '/mtn_type',
  mtnSchedule: '/mtn_schedule',

  lcsType: '/lcs_type',
  lcsMetric: '/lcs_metric',

  admRoles: '/adm_roles',
  admPermissions: '/adm_permissions',
  admUsers: '/adm_users',
  admProfileUpdate: '/adm_profile/update',

  sysNotifSetting: '/sys_notif_setting',
  sysDocnum: '/sys_docnum',
  appSettings: '/app_settings',

  workflowApproval: '/workflow_approval',
  wflApprovalSetting: '/wfl_approval_setting',

  optTransferRequest: '/opt_transfer_request',
  optPurchaseRequest: '/opt_purchase_request',
  optPurchaseRequest_masters: '/opt_purchase_request_masters',
  optAssetRequest: '/opt_asset_request',
  optPurchaseOrder: '/opt_purchase_order',
  optPurchaseOrder_masters: '/opt_purchase_order_masters',
  optGoodsReceipt: '/opt_goods_receipt',
  assetRegistration: '/opt_asset_registration',
  assetRegistrationMasters: '/opt_asset-registration/masters',
  optAssetDirectory: 'opt_asset_directory',
  optAssetDirectoryMasters: '/opt_asset_directory/masters',

  mediaUpload: '/media/upload',
  databaseBackup: '/database/backup',
  databaseBackups: '/database/backups',
  databaseBackupDownload: '/database/backup/download',
}

export const buildApiUrl = (endpoint, suffix = '') => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${normalizedEndpoint}${suffix}`
}
