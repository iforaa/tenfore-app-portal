<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'bg-gray-50 min-h-screen'
  }
});
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.svg" alt="TenFore" class="w-8 h-8" />
            <span class="font-semibold text-gray-900">TenFore App Portal</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-gray-900 font-medium"
              active-class="text-green-600"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/reviews"
              class="text-gray-600 hover:text-gray-900 font-medium"
              active-class="text-green-600"
            >
              Reviews
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
