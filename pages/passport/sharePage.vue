<template>
  <!-- 此文件路径禁止移动 -->
  <view>
    <view class="container ">
      <view class="u-skeleton" v-if="!articleData">
          <u-empty text="文章暂无内容" mode="list"></u-empty>
      </view>
      <u-parse v-else :html="articleData"></u-parse>
      <!-- 复制articleData -->
      <text @click="copyText">点击复制文本</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from "@/api/members.js";
export default {
  data() {
    return {
      // 用于接收上一级通过路径传输的数据
      routers: "", 
      // 请求文章接口后存储文章信息
      articleData: "",
    };
  },
  onLoad(val) {
    this.routers = val;
    getUserInfo()().then((res) => {
      if (res.data.result) {
        // 将请求的文章数据赋值
        this.articleData = res.data.result.shareId;
      }
    });
  },
  methods: {
    copyText() {
      uni.setClipboardData({
        data: this.articleData,
        success: function () {
          console.log('复制成功');
          // 可以添加用户友好的提示，例如使用uni.showToast提示复制成功
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
page {
  background: #fff;
}
.container {
  padding: 32rpx;
  > p {
    margin: 20rpx;
  }
}
</style>