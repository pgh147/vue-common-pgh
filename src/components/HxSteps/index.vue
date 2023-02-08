<template>
  <div class="hx-steps">
    <div class="hx-steps-progress" :style="`width: ${ (stepsList.length - 1) / stepsList.length * 100}%; left: ${100 / stepsList.length / 2}%;`"></div>
    <div v-for="item in stepsList" :key="item.name" class="hx-steps-item" :class="{active: item.active, pending: item.pending}">
      <slot :name="item.name"></slot>
    </div>
  </div>
</template>

<script>
/**
 * 步骤条
 * @props {Number | String} value 当前状态值
 * 使用方法参照 src/views/Sale/SummaryOrder/MatchStone/FactoryOrderDetail/ProductionStatus/components/ProductionSteps/index.vue
 **/
export default {
  name: 'HxSteps',
  props: {
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 0
    }
  },
  data() {
    return {
      stepsList: [],
      stepsActive: this.value
    }
  },
  watch: {
    value(value) {
      this.stepsActive = value
      this.computeStepsList()
    },
    stepsActive(stepsActive) {
      this.$emit('input', stepsActive)
    },
    $slots() {
      this.computeStepsList()
    }
  },
  mounted() {
    console.log(this.$slots)
    this.computeStepsList()
  },
  methods: {
    /** 计算步骤slot */
    computeStepsList() {
      this.stepsList = []
      for (const key in this.$slots) {
        this.stepsList.push({
          name: key,
          active: false,
          pending: false
        })
      }
      this.activeSteps(0)
    },
    /** 高亮进度 */
    activeSteps(index) {
      // eslint-disable-next-line eqeqeq
      if (this.stepsList.some(s => s.name == this.stepsActive)) {
        // eslint-disable-next-line eqeqeq
        if (this.stepsList[index].name == this.stepsActive) {
          this.stepsList[index].active = true
          setTimeout(() => {
            if (this.stepsList[index + 1]) this.stepsList[index + 1].pending = true
          }, 500)
        } else {
          this.stepsList[index].active = true
          setTimeout(() => this.activeSteps(index + 1), 500)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hx-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;

  >.hx-steps-progress {
    position: absolute;
    top: 0;
    width: 100%;
    height: 2px;
    background: #e8e8e8;
    border-radius: 6px;
    z-index: 7;
  }

  > .hx-steps-item {
    text-align: center;
    flex: 1;
    padding: 15px 0;
    position: relative;

    &.active {
      &::after {
        background: #1890ff;
      }

      &::before {
        width: 100%;
        opacity: 1;
        background: #1890ff;
      }
    }

    &.pending {
      &::before {
        animation-name: toProgress;
        animation-duration: 1.5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    }

    &::after {
      transition: 300ms 500ms;
      position: absolute;
      top: -9px;
      left: calc((100% - 18px) / 2);
      z-index: 9;
      content: " ";
      display: inline-block;
      border-radius: 12px;
      width: 12px;
      height: 12px;
      background: #e8e8e8;
      border: 3px solid #fafafa;
    }

    &::before {
      opacity: 0;
      transition: 500ms;
      content: " ";
      display: inline-block;
      width: 0;
      position: absolute;
      top: 0;
      left: calc((100% - 18px) / 2 * -1);
      z-index: 8;
      height: 2px;
      background: #e8e8e8;
      border-radius: 6px;
    }

    &:nth-child(2) {
      &::before {
        display: none;
      }
    }
  }
}

@keyframes toProgress {
  0% {
    background: #e8e8e8;
    width: 0;
    opacity: 0;
  }

  50% {
    background: #1890ff;
    width: 50%;
    opacity: 1;
  }

  100% {
    background: #1890ff;
    width: 100%;
    opacity: 0;
  }
}
</style>
