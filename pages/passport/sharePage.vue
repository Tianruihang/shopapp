<template>
  <!-- 此文件路径禁止移动 -->
  <view>
    <view class="container ">
      <text >邀请好友:</text>
<!--      <u-parse :html="articleData" style="margin: auto"></u-parse>-->
<!--      &lt;!&ndash; 复制articleData &ndash;&gt;-->
<!--      <u-button @click="copyText">点击复制文本</u-button>-->
    </view>
    <view>
      <canvas canvas-id="qrcode" style="width: 100px; height: 100px;margin: auto"></canvas>
    </view>
  </view>
</template>

<script>
//引入UQrocode文件的
import storage from "@/utils/storage";
import UQrocode from '@/api/UQrocode.js'
import UButton from "../../uview-ui/components/u-button/u-button.vue";
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
  onLoad(val) {
    this.routers = val;
    // 将请求的文章数据赋值
    this.articleData = storage.getUserInfo().shareId;
    console.log(this.articleData);
    this.createQRCode("http://101.126.5.141/pages/passport/register?shareId="+ this.articleData);

  },
  methods: {
    copyText() {
      uni.setClipboardData({
        data: this.articleData,
        success: function () {
          // 可以添加用户友好的提示，例如使用uni.showToast提示复制成功
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        }
      });
    },
    createQRCode(text) {
      UQrocode.make({
        //canvasId要和上面画布的id是一样的
        canvasId:'qrcode',
        componentInstance:this,
        text: text,
        size:100,//尺寸,
        margin:0
      })
    },
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