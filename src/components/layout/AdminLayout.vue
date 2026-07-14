<template>
  <div class="min-h-screen xl:flex bg-gray-50 dark:bg-boxdark-2">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 text-theme-xs transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[250px]' : 'lg:ml-[70px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <router-view />
      </div>
    </div>
  </div>
  <GlobalToast />
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import Backdrop from './Backdrop.vue'
import GlobalToast from '@/components/Toast/GlobalToast.vue'
import { useSidebar } from '@/composables/useSidebar.js'
import { useIdleTimeout } from '@/composables/useIdleTimeout.js'

const { isExpanded, isHovered } = useSidebar()
useIdleTimeout(60)
</script>
