<template>
  <view class="sale">
    <!-- <u-navbar title='限时抢购'></u-navbar> -->
    <view class="uni-container" v-for="(item, index) in goodsUserList" :key="index" style="margin-top: 10px">
      <uni-table ref="table" border stripe>
        <uni-tr>
          <uni-td colspan="4" align="center">发布时间: {{item.createTime}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td width="14" align="left">★数量</uni-td>
          <uni-td width="14" align="center">{{item.num}} </uni-td>
          <uni-td width="14" align="left">★单价</uni-td>
          <uni-td width="14" align="left">{{item.sellPrice}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td width="14" align="left">★合计</uni-td>
          <uni-td width="14" align="left">{{ item.num * item.sellPrice }} </uni-td>
          <uni-td width="14" align="center">★状态</uni-td>
          <uni-td width="14" align="center">{{orderStatusList2(item.status)}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td width="14" align="left" colspan="2">操作</uni-td>
          <uni-td width="14" align="left" colspan="2">
            <button size="mini"  @click="goodDetail(item.id)" plain="true" open-type="share">
            查看明细
            </button>
          </uni-td>
        </uni-tr>
      </uni-table>
      <br />
    </view>
    <view align="center">
      <button size="mini" class="share-btn" @click="onBack" plain="true" open-type="share">
        返回
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
import {orderStatusList2} from "../../../utils/filters";
import {getMemberInfo} from "../../../api/members";
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
      goodsUserList: [], //商品用户集合
      payUser: {},//支付用户
      lastRule: {}, //上一条集合
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      order: {}
    };
  },

  /**
   * 显示时间活动
   */
  async onShow() {
    await this.getPayTypeUserId();
  },

  onUnload() {
    this._setTimeInterval && clearInterval(this._setTimeInterval);
  },
  methods: {
    orderStatusList2,
    /**
     * 发起订单
     */
    async addGoods() {
      this.params.payType = 0;
      let res = await saveOrder(this.params);
      if (res.data.success) {
        this.onBackPress();
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

    //详情
    goodDetail(id) {
      uni.navigateTo({
        url: `/pages/tabbar/transaction/transactionSellDetail?id=${id}`,
      });
    },

    async getPayTypeUserId() {
      this.params.userId = this.$store.state.userInfo.id;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsUserList = res.data.result;
        //查看是否存在payUserId 如果有则根据payUserId查询用户信息
        this.goodsUserList.forEach(async (item) => {
          if (item.payUserId) {
            let res = await getMemberInfo(item.payUserId);
            if (res.data.success) {
              this.payUser = res.data.result;
            }
          }
        });
      } else {
        this.goodsUserList = [];
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.sale {
  width: 100%;
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
