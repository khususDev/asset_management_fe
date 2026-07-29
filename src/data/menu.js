export const menuData = [
  // ---------------- GRUP 1 ----------------
  {
    groupName: 'Main Menu',
    menus: [
      {
        label: 'Dashboard',
        routeName: 'Dashboard',
        roles: ['superadmin', 'admin', 'user'],
        icon: 'analytics',
        submenus: [],
      },
    ],
  },
  {
    groupName: 'Data Reference',
    menus: [
      {
        label: 'Master Data',
        routeName: null,
        roles: ['superadmin', 'admin_gudang'],
        icon: 'tables',
        submenus: [
          {
            label: 'Organization',
            routeName: null,
            roles: ['superadmin', 'admin'],
            submenus: [
              {
                label: 'Branch',
                routeName: 'org_branch',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Department',
                routeName: 'org_department',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Location',
                routeName: 'org_location',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Cost Center',
                routeName: 'org_costcenter',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
            ],
          },
          {
            label: 'Asset Master',
            routeName: null,
            roles: ['superadmin', 'admin'],
            submenus: [
              {
                label: 'Category',
                routeName: 'asm_category',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Type',
                routeName: 'asm_type',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Brand',
                routeName: 'asm_brand',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Asset Model',
                routeName: 'asm_model',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Asset Status',
                routeName: 'asm_status',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
            ],
          },
          {
            label: 'License Master',
            routeName: null,
            roles: ['superadmin', 'admin', 'user'],
            submenus: [
              {
                label: 'License Type',
                routeName: 'lcs_type',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'License Metric',
                routeName: 'lcs_metric',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
            ],
          },
          {
            label: 'Procurement Master',
            routeName: null,
            roles: ['superadmin', 'admin', 'user'],
            submenus: [
              {
                label: 'Vendor Type',
                routeName: 'prc_vendor_type',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Vendor',
                routeName: 'prc_vendor',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Unit of Measure',
                routeName: 'prc_uom',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Payment Term',
                routeName: 'prc_payment',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Tax',
                routeName: 'prc_tax',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
            ],
          },
          {
            label: 'Maintenance Master',
            routeName: null,
            roles: ['superadmin', 'admin'],
            submenus: [
              {
                label: 'Schedule Type',
                routeName: 'mnt_schedule',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
              {
                label: 'Maintenance Type',
                routeName: 'mnt_type',
                roles: ['superadmin', 'admin'],
                submenus: [],
              },
            ],
          },
        ],
      },
    ],
  },
  // ---------------- ASSET ACQUISITION ----------------
  {
    groupName: 'Asset Acquisition',
    menus: [
      {
        label: 'Procurement',
        routeName: null,
        roles: ['superadmin', 'admin', 'director', 'manager'],
        submenus: [
          {
            label: 'Purchase Request',
            routeName: 'opt_purchase_request',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Purchase Order',
            routeName: 'opt_purchase_order',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Transfer Request',
            routeName: 'opt_transfer_request',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Goods Receipt',
            routeName: 'opt_goods_receipt',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
        ],
      },
    ],
  },
  {
    groupName: 'Asset Management',
    menus: [
      // ---------------- ASSET OPERATIONS ----------------
      {
        label: 'Operations',
        routeName: null,
        roles: ['superadmin', 'admin', 'director', 'manager'],
        submenus: [
          {
            label: 'Registration',
            routeName: 'opt_asset_registration',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Assets Directory',
            routeName: 'opt_asset_directory',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Assignment',
            routeName: 'opt_asset_assignment',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Movement',
            routeName: 'opt_asset_movement',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Disposal',
            routeName: 'opt_asset_disposal',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
        ],
      },
      // ---------------- ASSET COMPLIANCE ----------------
      {
        label: 'Compliance',
        routeName: null,
        roles: ['superadmin', 'admin', 'director', 'manager'],
        submenus: [
          {
            label: 'License Registry',
            routeName: 'a&l_license_registry',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Contract & Leases',
            routeName: 'a&l_contract_leases',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Warranty',
            routeName: 'a&l_warranty',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Audit & Verification',
            routeName: 'a&l_audit_verification',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
        ],
      },
      // ---------------- MAINTENANCE ----------------
      {
        label: 'Maintenance',
        routeName: 'maintenance',
        roles: ['superadmin', 'admin', 'user'],
        icon: 'analytics',
        submenus: [],
      },
      // ---------------- INVENTORY ----------------
      {
        label: 'Inventory',
        routeName: null,
        roles: ['superadmin', 'admin', 'user'],
        icon: 'product',
        submenus: [
          {
            label: 'Consumable',
            routeName: 'consumable',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Sparepart',
            routeName: 'sparepart',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
          {
            label: 'Stock',
            routeName: null,
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [
              {
                label: 'Movement',
                routeName: 'stock_movement',
                roles: ['superadmin', 'admin', 'director', 'manager'],
                submenus: [],
              },
              {
                label: 'Opname',
                routeName: 'stock_opname',
                roles: ['superadmin', 'admin', 'director', 'manager'],
                submenus: [],
              },
              {
                label: 'Adjustment',
                routeName: 'stock_adjustment',
                roles: ['superadmin', 'admin', 'director', 'manager'],
                submenus: [],
              },
            ],
          },
        ],
      },

      // ---------------- REPORTS ----------------
      // {
      //   label: 'Reports',
      //   routeName: null,
      //   roles: ['superadmin', 'admin', 'user'],
      //   icon: 'report',
      //   submenus: [
      //     {
      //       label: 'Asset Reports',
      //       routeName: 'rpt_asset',
      //       roles: ['superadmin', 'admin', 'director', 'manager'],
      //       submenus: [],
      //     },
      //     {
      //       label: 'License Reports',
      //       routeName: 'rpt_license',
      //       roles: ['superadmin', 'admin', 'director', 'manager'],
      //       submenus: [],
      //     },
      //     {
      //       label: 'Procurement Reports',
      //       routeName: 'rpt_procurement',
      //       roles: ['superadmin', 'admin', 'director', 'manager'],
      //       submenus: [],
      //     },
      //     {
      //       label: 'Maintenance Reports',
      //       routeName: 'rpt_maintenance',
      //       roles: ['superadmin', 'admin', 'director', 'manager'],
      //       submenus: [],
      //     },
      //     {
      //       label: 'Inventory Reports',
      //       routeName: 'rpt_inventory',
      //       roles: ['superadmin', 'admin', 'director', 'manager'],
      //       submenus: [],
      //     },
      //   ],
      // },
    ],
  },

  // ---------------- WORKFLOW ----------------
  {
    groupName: 'Workflow',
    menus: [
      {
        label: 'Approvals',
        routeName: null,
        roles: ['superadmin', 'admin', 'user', 'it manager', 'director', 'finance manager'],
        icon: 'approval',
        submenus: [
          {
            label: 'Waiting Approval',
            routeName: 'apl_inbox_waiting',
            roles: ['superadmin', 'admin', 'user', 'it manager', 'director', 'finance manager'],
            submenus: [],
          },
          {
            label: 'My Submission',
            routeName: 'apl_inbox_submission',
            roles: ['superadmin', 'admin', 'user', 'manager', 'director'],
            submenus: [],
          },
          {
            label: 'Approval Logs',
            routeName: 'apl_inbox_history',
            roles: ['superadmin', 'admin', 'user', 'manager', 'director'],
            submenus: [],
          },
          {
            label: 'Approval Settings',
            routeName: 'apl_approval_setting',
            roles: ['superadmin', 'admin', 'director', 'manager'],
            submenus: [],
          },
        ],
      },
    ],
  },

  {
    groupName: 'Administration',
    menus: [
      {
        label: 'User Management',
        routeName: null,
        roles: ['superadmin', 'admin_gudang'],
        icon: 'users',
        submenus: [
          {
            label: 'Users Account',
            routeName: 'sys_account',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Roles',
            routeName: 'sys_roles',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Permissions',
            routeName: 'sys_permission',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
        ],
      },

      {
        label: 'System Settings',
        routeName: null,
        roles: ['superadmin', 'admin_gudang'],
        icon: 'setting',
        submenus: [
          {
            label: 'Technical Settings',
            routeName: 'sys_setting',
            roles: ['superadmin'],
            submenus: [],
          },
          {
            label: 'Document Numbering',
            routeName: 'sys_docs',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Workflow Approval',
            routeName: 'sys_wfl_approval',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'Notification Setting',
            routeName: 'sys_notif_setting',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
          {
            label: 'System Logs',
            routeName: 'sys_logs',
            roles: ['superadmin', 'admin', 'user'],
            submenus: [],
          },
        ],
      },
    ],
  },

  // Tambahkan Grup 4, 5, 6, dst di bawah sini...
]
