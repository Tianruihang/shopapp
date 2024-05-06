<template>
  <!-- 此文件路径禁止移动 -->
  <view>
    <view class="container ">
      <text >下载App:</text>
<!--      <u-parse :html="articleData" style="margin: auto"></u-parse>-->
<!--      &lt;!&ndash; 复制articleData &ndash;&gt;-->
<!--      <u-button @click="copyText">点击复制文本</u-button>-->
    </view>
    <view>
      <!-- 下载地址: http://atmshop.top/lilishop.apk -->
      <u-button @click="downloadApk">点击下载</u-button>
    </view>
  </view>
</template>

<script>
//引入UQrocode文件的
import UButton from "../../uview-ui/components/u-button/u-button.vue";
import {downloadImgUrl} from "../../js_sdk/u-draw-poster/utils/wx-utils";

export default {
  components: {UButton},
  data() {
    return {
      // 用于接收上一级通过路径传输的数据
      routers: "", 
      // 请求文章接口后存储文章信息
      articleData: "",
      qrcodeSrc: ""
    };
  },
  methods: {
    downloadApk() {
      uni.showLoading({
        title: '下载中...'
      });
      downloadImgUrl('http://atmshop.top/lilishop.apk').then(() => {
        uni.hideLoading();
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