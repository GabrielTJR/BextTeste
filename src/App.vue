<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

const APP_VERSION = '1.0.1'

const storedVersion = localStorage.getItem('app_version')

if (storedVersion !== APP_VERSION) {
  localStorage.clear()
  localStorage.setItem('app_version', APP_VERSION)
}
</script>
