<template>
  <view>
    <!-- 常用工具 -->
    <view class="interact-tools" style="margin-bottom: 15px">

      <div class="paddingBox">
        <view class="interact-container">
          <view class="interact-item" @click="navigateTo('/pages/mine/address/addressManage')">
            <image src="/static/mine/myaddress.png" mode=""></image>
            <view>我的道具</view>
          </view>

          <view class="interact-item" @click="navigateTo('/pages/mine/myTracks')">
            <image src="/static/mine/logistics.png" mode=""></image>
            <view>团队奖励</view>
          </view>

          <view class="interact-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
            <image src="/static/mine/feedback.png" mode=""></image>
            <view>贡献度</view>
          </view>
          <!-- <view class="interact-item" @click="linkMsgDetail()">
            <image src="/static/mine/mycommit.png" mode=""></image>
            <view>我的消息</view>
          </view> -->


          <view class="interact-item" @click="navigateTo('/pages/mine/myCollect')">
            <image src="/static/mine/myfavorite.png" mode=""></image>
            <view>补填邀请码</view>
          </view>

          <view class="interact-item" @click="navigateTo('/pages/mine/point/myPoint')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>我的积分</view>
          </view>
          <view class="interact-item" @click="navigateTo('/pages/mine/userCard')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>实名认证</view>
          </view>
          <view class="interact-item" @click="navigateTo('/pages/mine/userRecharge')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>账户充值</view>
          </view>
          <view class="interact-item" @click="navigateTo('/pages/mine/userWidthdrawal')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>账户提取</view>
          </view>
          <view class="interact-item" @click="navigateTo('/pages/tabbar/machine/machineList')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>矿机列表</view>
          </view>
          <view class="interact-item" @click="navigateTo('/pages/passport/sharePage')">
            <image src="/static/mine/mypoint.png" mode=""></image>
            <view>邀请好友</view>
          </view>

        </view>
      </div>
    </view>
  </view>
</template>

<script>
import {distribution} from "@/api/goods";
import configs from "@/config/config";
import storage from "@/utils/storage";

export default {
  data() {
    return {
      configs,
      storage
    }
  },

  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    linkMsgDetail() {
      uni.navigateTo({
        url: `/pages/mine/im/list`,
      });
    },

    navTo(url) {
      uni.navigateTo({
        url
      });
    },

    distribution() {
      distribution().then((res) => {
        if (res.data.result) {
          let type = res.data.result.distributionStatus;
          if (type == "PASS") {
            uni.navigateTo({
              url: "/pages/mine/distribution/home",
            });
          } else if (type == "REFUSE") {
            uni.navigateTo({
              url: "/pages/mine/distribution/auth",
            });
          } else if (type == "RETREAT") {
            uni.showToast({
              title: "您的分销资格已被清退。请联系管理员！",
              duration: 2000,
              icon: "none",
            });
          } else {
            uni.showToast({
              title: "您的信息正在审核",
              duration: 2000,
              icon: "none",
            });
          }
        } else if (!res.data.success && res.data.code == 22000) {
          uni.showToast({
            title: "分销功能暂未开启",
            duration: 2000,
            icon: "none",
          });
        } else {
          // 没有资格申请 先去实名认证
          uni.navigateTo({
            url: "/pages/mine/distribution/auth",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.interact-tools {
  border-left: none;
  border-right: none;


  .interactBox {
    height: 156rpx;
  }

  .interact-container {
    margin: 0 20rpx;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);

    .interact-item-img {
      width: 52rpx !important;
      height: 52rpx !important;
      // margin-bottom:  !important;
      margin: 0 auto 6rpx auto !important;
    }

    image {
      width: 52rpx;
      height: 52rpx;
      margin-bottom: 6rpx;
    }

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;

    .interact-item {
      font-size: $font-sm;
      width: 25%;
      height: 160rpx;
      padding: 30rpx;
    }
  }
}
</style>
