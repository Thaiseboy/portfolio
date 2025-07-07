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

<style scoped lang="scss">
// All styles are now handled by SCSS partials in /assets/scss/components/_skeleton.scss
// Custom component-specific styles can be added here if needed
</style>