<template>
  <view class="content">
    <view class="portrait-box">
      <image src="/static/pointTrade/point_bg_1.png" mode=""></image>
      <image class="point-img" src="/static/pointTrade/tradehall.png" />
      <view class="position-point">
       

      </view>
    </view>
    <u-row class="portrait-box2">
      <u-col span="6" class="portrait-box2-col" :gutter="16">
        <text>积分余额：</text>
        <text class="pcolor">{{ pointData.point || 0 }}</text>
      </u-col>

    </u-row>

<!--    <div class="point-list">-->
<!--      <view class="point-item" v-for="(item, index) in pointList" :key="index">-->
<!--        <view>-->
<!--          <view class="point-label">{{ item.content }}</view>-->
<!--          <view>{{ item.createTime}}</view>-->
<!--        </view>-->
<!--        <view :class="[item.pointType == 'INCREASE' ? 'plus' : 'reduce']"><span>{{item.pointType == "INCREASE" ? '+' : '-'}}</span>{{ item.variablePoint }}</view>-->
<!--      </view>-->
<!--      <uni-load-more :status="count.loadStatus"></uni-load-more>-->
<!--    </div>-->
<!--    -->
    <div>
      <uni-section title="领取积分" type="square">
        <view class="example-body">
          <button class="transition-button" type="primary" @click="handle('fade')">领取积分</button>
        </view>
        <view class="example">
          <uni-transition ref="ani" custom-class="transition" :mode-class="modeClass" :styles="styles"
                          :show="show">
            <view class="point-item" v-for="(item, index) in pointList" :key="index">
              <view>
                <view class="point-label">{{ item.pointName }}</view>
              </view>
<!--              <view :class="[item.type == 'INCREASE' ? 'plus' : 'reduce']"><span>{{item.type == "INCREASE" ? '+' : '-'}}</span>{{ item.point }}</view>-->
            </view>
          </uni-transition>
        </view>

      </uni-section>

    </div>
  </view>
</template>

<script>
import { getPointsData } from "@/api/members.js";
import { getMemberPointSum } from "@/api/members.js";
import { pointList } from "@/api/address.js";
import {getPointClaime, getPointClaimeList} from "../../../api/address";
import storage from "../../../utils/storage";
export default {
  data() {
    return {
      count: {
        loadStatus: "more",
      },
      pointList: [], //积分数据集合
      pointClaimeList: [], //积分待领取列表
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      pointData: {}, //累计获取 未输入 集合
      show: true,
      modeClass: 'fade',
      styles: {}
    };
  },

  onLoad() {
    this.initPointData();
    this.getList();
    this.styles = {
      justifyContent: 'center',
      alignItems: 'center',
      width: '400px',
      height: '100px',
      borderRadius: '5px',
      textAlign: 'center',
      backgroundColor: '#4cd964',
      boxShadow: '0 0 5px 1px rgba(0,0,0,0.2)'
    }
  },

  /**
   * 触底加载
   */
  // onReachBottom() {
  //   this.params.pageNumber++;
  //   this.getList();
  // },
  methods: {
    /**
     * 获取积分数据
     */
    getList() {
      let params = this.params;
      uni.showLoading({
        title: "加载中",
      });
      //获取用户ID
      getPointClaimeList(storage.getUserInfo().id).then((res) => {
         if (this.$store.state.isShowToast){ uni.hideLoading() };
        if (res.data.success) {
          let data = res.data.result;
          if (data.length < 10) {
            this.$set(this.count, "loadStatus", "noMore");
            this.pointList.push(...data);
          } else {
            this.pointList.push(...data);
            if (data.length < 10) this.$set(this.count, "loadStatus", "noMore");
          }
        }
      });
    },

    handle(type) {
      this.show = !this.show
      this.modeClass = type
      getPointClaime().then((res) => {
        if (res.data.success) {
          //领取成功
          //弹框提示
          uni.showToast({
            title: '领取成功',
            icon: "none",
            duration: 2000,
          });
          this.getList();
          this.initPointData();
        }else {
          //领取失败
          //弹框提示
          uni.showToast({
            title: '领取失败,稍后重试',
            icon: "none",
            duration: 2000,
          });
        }
      });
    },

    /**
     * 获得累计积分使用
     */
    initPointData() {
      getMemberPointSum().then((res) => {
        this.pointData = res.data.result;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.example {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  height: 150px;
  background-color: #fff;
}

.example-body {
  margin-top: 10px;
  padding: 10px 20px;
  padding-bottom: 0px;
}

.transition-button {
  /* #ifndef APP-NVUE */
  width: 100%;
  /* #endif */
  flex: 1;
  margin-bottom: 10px;
}

/* #ifndef APP-NVUE */
.example ::v-deep .transition {
  //display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 5px;
  text-align: center;
  background-color: #4cd964;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
}

/* #endif */

.text {
  font-size: 14px;
  color: #fff;
}
.point-list{
  margin-top: 50rpx;
}
.title {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
}
.plus{
  color: $light-color;
  font-weight: bold;
}
.reduce{
  color: $weChat-color;
  font-weight: bold;
}

.point-item {
  width: 100%;
  height: 130rpx;
  padding: 0 20rpx;
  background: #ffffff;
  font-size: $font-sm;
  border-bottom: 1px solid $border-color-light;
  display: flex;
  justify-content: end;
  align-items: center;
  > view:nth-child(1) {
    flex: 1;
    line-height: 40rpx;
    view {
      color: #666666;
    }
    :last-child {
      color: #999;
    }
  }

  > view:nth-child(2) {
    width: 100rpx;
    text-align: center;
  }
}

.portrait-box2 {
  height: 100rpx;
  background: #ffffff;
  border-radius: 0 0 20rpx 20rpx;
  margin: 0 20rpx;
  font-size: 26rpx;
  /deep/ .u-col {
    text-align: center !important;
  }
  /deep/ .u-col:first-child {
    border-right: 1px solid $border-color-light;
  }
  .pcolor {
    color: $light-color;
  }
}

.content {
  background: #f9f9f9;
}

.more {
  text-align: right;
  color: $u-tips-color;
  font-size: 24rpx;
  padding-right: 40rpx !important;
}

.portrait-box {
  background-color: $main-color;
  height: 250rpx;
   background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
  border-radius: 20rpx 20rpx 0 0;
  margin: 20rpx 20rpx 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  > image:first-child {
    width: 263rpx;
    height: 250rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: rotateY(180deg);
  }

  .position-point {
    position: absolute;
    right: -2rpx;
    top: 0;

    .apply-point {
      margin-top: 30rpx;
      text-align: center;
      line-height: 40rpx;
      font-size: $font-sm;
      color: #ffffff;
      width: 142rpx;
      height: 40rpx;
      background: rgba(#ffffff, 0.2);
      border-radius: 20rpx 0px 0px 20rpx;
    }
  }
  .point-img {
    height: 108rpx;
    width: 108rpx;
    margin-bottom: 30rpx;
  }
  .point {
    font-size: 56rpx;
  }
  
}
.point-label{
    //单独一行
    display: flex;
    font-weight: bold;
    margin-bottom: 10rpx;

}
</style>
