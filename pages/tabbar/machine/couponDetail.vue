<template>
  <view class="content">
    <view class="body">
      一切解释权归平台所有
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      coupon: {}, //优惠券数据
    };
  },
  onLoad(option) {
    // this.coupon = JSON.parse(decodeURIComponent(option.item));
  },
};
</script>

<style lang="scss" scoped>
page,
.content {
  // background: $main-color;
  height: 100%;
}
.body {
  .top-view {
    margin: 20rpx 20rpx 0;
    height: 290rpx;
    background: linear-gradient(
      316deg,
      $light-color 2%,
      $aider-light-color 98%
    );
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 20rpx;
    padding: 60rpx 0;
    .title {
      font-size: 30rpx;
      color: #ffee80;
    }
    .price {
      font-size: 60rpx;
      font-weight: 600;
      color: #ffffff;
      text {
        font-size: 30rpx;
      }
    }
    .text {
      font-size: 24rpx;
      color: #ffffff;
    }
    .bg-quan {
      width: 244rpx;
      height: 244rpx;
      border: 6rpx solid #ffffff;
      border-radius: 50%;
      opacity: 0.3;
      color: #ffffff;
      text-align: center;
      padding-top: 30rpx;
      font-size: 130rpx;
      position: absolute;
      right: -54rpx;
      bottom: -54rpx;
    }

    .jiao-1 {
      background-color: #ffc71c;
      width: 400rpx;
      transform: rotate(45deg);
      text-align: center;
      position: absolute;
      right: -130rpx;
      color: #ffffff;
      top: 0;
      .text-1 {
        margin-left: 68rpx;
        font-size: 28rpx;
      }
    }
    .used-color {
      background-color: #ffc71c;
    }
  }
  .bottom-view {
    border-radius: 0 0 20rpx 20rpx;
    background-color: #ffffff;
    height: 580rpx;
    padding: 50rpx 50rpx;
    margin: 0 30rpx;
    line-height: 2em;
    color: #999;
  }
}
</style>
