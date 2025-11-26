<template>
  <div class="skeleton-loader" :class="{ 'skeleton-pulse': animate }">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>
    
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="n in count" :key="n" class="skeleton-list-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="type === 'text'" class="skeleton-text-block">
      <div v-for="n in count" :key="n" class="skeleton-text" :class="{ 'short': n === count }"></div>
    </div>
    
    <div v-else class="skeleton-box" :style="{ width, height }"></div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'SkeletonLoader'
});

defineProps({
  type: {
    type: String,
    default: 'box',
    validator: value => ['card', 'list', 'text', 'box'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '200px'
  },
  animate: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.skeleton-loader {
  @apply animate-pulse;
}

.skeleton-card {
  @apply bg-dark-card rounded-lg overflow-hidden shadow-md;
}

.skeleton-image {
  @apply w-full h-[200px] bg-gray-700;
}

.skeleton-content {
  @apply p-lg;
}

.skeleton-title {
  @apply h-6 bg-gray-700 rounded mb-md w-3/4;
}

.skeleton-text {
  @apply h-4 bg-gray-700 rounded mb-sm;
}

.skeleton-text.short {
  @apply w-1/2;
}

.skeleton-list {
  @apply space-y-md;
}

.skeleton-list-item {
  @apply flex items-center gap-md;
}

.skeleton-avatar {
  @apply w-12 h-12 bg-gray-700 rounded-full flex-shrink-0;
}

.skeleton-text-content {
  @apply flex-1;
}

.skeleton-text-block {
  @apply space-y-sm;
}

.skeleton-box {
  @apply bg-gray-700 rounded;
}
</style>