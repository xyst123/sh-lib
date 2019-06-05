<template>
  <div class="wrapper"
:style="{'height':`${height}vw`}">
    <!-- 真正的文本 -->
    <h4
      :ref="refName"
      :style="{'max-height':`${maxHeight}vw`, 'line-height': `${defaultLineHeight}vw`,transition:transition?'max-height 0.3s':''}"
      class="content real-content"
      v-html="content"
    />

    <!-- 带省略号的文本 -->
    <h4
      v-if="isOverflow && !stretch"
      :style="{'line-height': `${defaultLineHeight}vw`, '-webkit-line-clamp': limitRow,'padding-right': `${rightEM}em`,'text-indent':`${-1*rightEM*(limitRow-1)}em`}"
      class="content fake-content"
      v-html="content"
    />

    <!-- 辅助计算全部展开文本是否遮盖展开与收起按钮 -->
    <h4
      :ref="`hidden-${refName}`"
      :style="{'max-height':`${(limitRow-1)*defaultLineHeight}vw`, 'line-height': `${defaultLineHeight}vw`}"
      class="content hidden-content"
      v-html="hiddenContent"
    />

    <!-- 展开与收起 -->
    <div v-if="isOverflow"
class="slot-wrapper" @click="toggleStretch">
      <slot />
    </div>
  </div>
</template>

<script>
function getVW(px) {
  // 判断当前浏览器采用的渲染方式
  const windowWidth =    document.compatMode === 'CSS1Compat'
      ? document.documentElement.clientWidth
      : document.body.clientWidth;
  return Number(((100 * Number(px)) / windowWidth).toFixed(3));
}

export default {
  name: 'StretchText',
  props: {
    // 用于标记元素
    refName: {
      required: true,
      type: String,
    },
    // 文本内容
    content: {
      type: String,
      default: '',
    },
    // 超过limitRow行的部分显示...
    limitRow: {
      type: Number,
      default: 4,
    },
    // 文本行高
    lineHeight: {
      type: Number,
      default: 23,
    },
    // 收起时最后一行空余字符数
    rightEM: {
      type: Number,
      default: 3,
    },
    // 展开收起是否使用动画，有点小bug
    useAnimation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stretch: false, // 是否是展开状态
      isOverflow: false, // 文字是否超过最大限制行数
      realHeight: 0, // 文字完全展开的高度
      isFulfilled: false, // 文字完全展开是否覆盖展开与收起按钮
      transition: false,
    };
  },
  computed: {
    defaultLineHeight() {
      return getVW(this.lineHeight);
    },
    hiddenContent() {
      return '一'.repeat(this.rightEM + 1) + this.content;
    },
    // real-content最大高度
    maxHeight() {
      if (!this.isOverflow) {
        return this.limitRow * this.defaultLineHeight;
      }
      if (this.stretch) {
        return this.realHeight;
      }
      return (this.limitRow - 1) * this.defaultLineHeight;
    },
    // wrapper高度
    height() {
      if (this.isOverflow && !this.stretch) {
        return this.limitRow * this.defaultLineHeight;
      }
      if (this.isFulfilled && this.isOverflow && this.stretch) {
        return this.realHeight + this.defaultLineHeight;
      }
      return this.realHeight;
    },
  },
  mounted() {
    let DOM = this.$refs[this.refName];
    let hiddenDOM = this.$refs[`hidden-${this.refName}`];
    if (DOM && hiddenDOM) {
      // 项目统一使用vw为长度单位
      this.realHeight = getVW(DOM.scrollHeight);
      const DOMScrollHeight = getVW(DOM.scrollHeight);
      const DOMClientHeight = getVW(DOM.clientHeight);
      const hiddenDOMScrollHeight = getVW(hiddenDOM.scrollHeight);
      /* eslint-disable */
      this.isOverflow =
        DOMScrollHeight - DOMClientHeight > this.defaultLineHeight * 0.5;
      /* eslint-enable */
      this.isFulfilled = hiddenDOMScrollHeight - DOMScrollHeight > 0;
      if (this.useAnimation) {
        this.$nextTick(() => {
          this.transition = true;
        });
      }

      DOM = null;
      hiddenDOM = null;
    }
  },
  methods: {
    toggleStretch() {
      this.stretch = !this.stretch;
      this.$emit('toggleChange', this.stretch);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  .content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }

  .real-content {
    position: relative;
    background-color: #fff;
    z-index: 1;
  }

  .fake-content {
    position: absolute;
    top: 0;
    left: 0;
    text-overflow: ellipsis;
  }

  .hidden-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .slot-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }
}
</style>
