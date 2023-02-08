<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <!-- <transition name="fade-transform">
    </transition> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }

}
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  min-width: 1320px;
  min-height: 720px;
  overflow: hidden;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>

<style lang="scss">
/deep/.el-button {
  font-size: 14px;
}
// /* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<style lang="scss">
.el-select__tags {
  white-space: nowrap;
  overflow: auto hidden;
  display: inline;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0;
  }
}
</style>
