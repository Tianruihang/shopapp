<template>
  <view class="sale">
    <!-- <u-navbar title='限时抢购'></u-navbar> -->
    <view class="uni-container">
      <uni-table ref="table" border stripe>
        <uni-tr>
          <uni-td colspan="4" align="center">今日价格</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">最低价</uni-td>
          <uni-td  align="center">{{lastRule.minUsualPrice}}</uni-td>
          <uni-td  align="center">最高价</uni-td>
          <uni-td  align="center">{{lastRule.maxUsualPrice}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td colspan="4" align="center">
            <uni-card :is-shadow="false">
              购买数量:
              <u-input v-model="params.num" placeholder="请输入购买数量" />
            </uni-card>
            <uni-card :is-shadow="false">
              购买价格
              <u-input v-model="params.sellPrice" placeholder="请输入购买价格" />
            </uni-card>
            <uni-card :is-shadow="false">
              支付密码
              <u-input v-model="params.pms" type="password" placeholder="请输入支付密码" />
            </uni-card>
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view align="center">
      <button size="mini" class="share-btn" @click="addGoods" plain="true" open-type="share">
        发布订单
      </button>
      <button size="mini" class="share-btn" @click="onBack" plain="true" open-type="share">
        取消
      </button>
    </view>

  </view>
</template>

<script>
import Foundation from "@/utils/Foundation.js";
import tranPromotion from '@/components/m-goods-list/tranPromotion.vue'
import pageHead from '@/components/page-head/page-head.vue'
import uniTable from '@/components/uni-table/components/uni-table/uni-table.vue'
import uniTr from '@/components/uni-table/components/uni-tr/uni-tr.vue'
import uniTh from '@/components/uni-table/components/uni-th/uni-th.vue'
import uniTd from '@/components/uni-table/components/uni-td/uni-td.vue'
import uniSection from '@/components/uni-section/uni-section.vue'
import uniCard from '@/components/uni-card/uni-card.vue'
import {getLastRule, getMemberOrders, saveOrder} from "../../../api/promotions";
import UInput from "../../../uview-ui/components/u-input/u-input.vue";
import {
  md5
} from "@/utils/md5.js";
import storage from "../../../utils/storage";
export default {
  components: {
    UInput,
    tranPromotion,
    pageHead,
    uniTable,
    uniTr,
    uniTh,
    uniTd,
    uniSection,
    uniCard
  },
  data() {
    return {
      nav: 0, //默认选择第一个时间
      timeLine: "", //获取几个点活动
      resTime: 0, //当前时间
      time: 0, //距离下一个活动的时间值
      times: {}, //时间集合
      onlyOne: "", //是否最后一个商品
      goodsList: [], //商品集合
      lastRule: {}, //上一条集合
      params: {
        pageNumber: 1,
        pageSize: 10,
        type: 0,
      },
      order: {}
    };
  },

  /**
   * 显示时间活动
   */
  async onShow() {
    await this.getLastRule();
  },
  async onLoad(options) {
    this.params.type = options.type;
  },

  onUnload() {
    this._setTimeInterval && clearInterval(this._setTimeInterval);
  },
  methods: {
    /**
     * 发起订单
     */
    async addGoods() {
      this.params.payType = 0;
      this.params.payUserId = storage.getUserInfo().id;
      this.params.pms = md5(this.params.pms);
      let res = await saveOrder(this.params);
      this.params.pms = ""; //清空密码
      if (res.data.success) {
        //弹出成功
        uni.showToast({
          title: "发布成功",
          icon: "success",
          duration: 2000,
        });
        this.onBack();
      } else {
        //弹出异常
        uni.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000,
        });
      }
    },

    // 返回上一级
    onBack() {
      uni.navigateBack();
    },

    async getLastRule() {
      let res = await getLastRule(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.lastRule = res.data.result;
      } else {
        this.goodsList = {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sale {
  width: 90%;
  margin: auto;
  margin-top: 10%;
  min-height: 100vh;
  background-color: #f7f7f7;
}
.share-btn{
  display: inline-block;
  width: 25%;
  margin: 20px 15px;

}
.under-btn{
  width: 55%;
  margin: auto;
}
.uni-section{
  display: inline-block;
  width: 40%;
  margin: 20px 10px;
}
.nodata {
  flex-direction: column;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;

  >div {
    font-size: 24rpx;
    margin-top: 20rpx;
    color: #666;
  }
}

.header-wraper {
  background: url('/static/bg.png');
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  >image{
    width: 300rpx;
    height: 100rpx;
  }
}

.sale-items {
  padding-top: 20rpx;
  width: auto;
  height: 100px;

}

.index-navs {
  background: #fff;
  background-color: #f7f7f7;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.index-nav-v {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.index-nav {
  font-size: 28rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150rpx;
  flex-direction: column;
  color: #bababa;
  height: 115rpx;
  line-height: 1em;
  position: relative;
  font-size: 32rpx;
  font-weight: bold;

  &-active {
    color: $main-color;
    position: relative;
    z-index: 30;
    .index-nav-desc {
      color: #fff;
      font-weight: bold;
      background: $main-color;
      padding: 6rpx 16rpx;
      border-radius: 50px;
    }
  }
}

.index-nav-desc {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #bababa;
}
</style>
