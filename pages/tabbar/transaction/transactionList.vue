<template>
  <view class="b-content">
    <view class="navbar">
      <view
          v-for="(item, index) in navList"
          :key="index"
          class="nav-item"
          @click="handleTabClick(index)"
      ><text :class="{ current: tabCurrentIndex === index }">{{
          item.text
        }}</text>
      </view>
    </view>
    <view class="sale">
      <!-- <u-navbar title='限时抢购'></u-navbar> -->
      <pageHead :title="title"></pageHead>
      <view class="uni-container">
        <uni-table ref="table" border stripe @selection-change="selectionChange">
          <uni-tr>
            <uni-td colspan="4" align="center">我的交易信息</uni-td>
          </uni-tr>
          <uni-tr>
            <uni-td width="14" align="left">★进行中</uni-td>
            <uni-td width="14" align="center"><a @click="showOrderList" >查看出售</a> </uni-td>
            <uni-td width="14" align="left">★已完成</uni-td>
            <uni-td width="14" align="left">{{goodsUserList1.length}}</uni-td>
          </uni-tr>
          <uni-tr>
            <uni-td width="14" align="left">★已取消</uni-td>
            <uni-td width="14" align="left">{{ goodsUserList2.length }} </uni-td>
            <uni-td width="14" align="center"><a @click="addOrder" >购买订单</a></uni-td>
            <uni-td width="14" align="center"><a @click="weChatShare">查看购买</a></uni-td>
          </uni-tr>
          <uni-tr>
            <uni-td width="14" align="left">$可用ATOM</uni-td>
            <uni-td width="14" align="left">1 </uni-td>
            <uni-td width="14" align="left">$冻结ATOM</uni-td>
            <uni-td width="14" align="left">1</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <view>
        <uni-section title="交易量" type="line">
          <uni-card :is-shadow="false">
            <text class="uni-body">{{goodCompleteSum}}</text>
          </uni-card>
        </uni-section>
        <uni-section title="均价" type="line">
          <uni-card :is-shadow="false">
            <text class="uni-body">{{orderAveragePrice}}</text>
          </uni-card>
        </uni-section>
      </view>
      <view>
        <button
            size="mini"
            class="share-btn"
            @click="addOrder"
            plain="true"
            open-type="share"
        >
          发布订单
        </button>
        <button
            size="mini"
            class="share-btn"
            @click="showOrderList"
            plain="true"
            open-type="share"
        >
          出售列表
        </button>
        <button
            size="mini"
            class="share-btn"
            @click="weChatShare"
            plain="true"
            open-type="share"
        >
          购买列表
        </button>
        <button
            class="under-btn"
            @click="trendChart"
            plain="true"
            open-type="share"
        >
          查看走势图
        </button>
      </view>
      <view class="sale-items">
        <!-- 根据type分别查询 -->
        <tranPromotion :res="goodsList"></tranPromotion>
      </view>
    </view>
  </view>
</template>

<script>
import Foundation from "@/utils/Foundation.js";
import tranPromotion from "@/components/m-goods-list/tranPromotion.vue";
import pageHead from "@/components/page-head/page-head.vue";
import uniTable from "@/components/uni-table/components/uni-table/uni-table.vue";
import uniTr from "@/components/uni-table/components/uni-tr/uni-tr.vue";
import uniTh from "@/components/uni-table/components/uni-th/uni-th.vue";
import uniTd from "@/components/uni-table/components/uni-td/uni-td.vue";
import uniSection from "@/components/uni-section/uni-section.vue";
import uniCard from "@/components/uni-card/uni-card.vue";
import {getMemberOrders, getOtherOrders} from "../../../api/promotions";
export default {
  components: {
    tranPromotion,
    pageHead,
    uniTable,
    uniTr,
    uniTh,
    uniTd,
    uniSection,
    uniCard,
  },
  data() {
    return {
      title: "交易时间8:00-23:00",
      nav: 0, //默认选择第一个时间
      type: 0, //0 平价区交易  溢价区交易
      timeLine: "", //获取几个点活动
      resTime: 0, //当前时间
      time: 0, //距离下一个活动的时间值
      times: {}, //时间集合
      onlyOne: "", //是否最后一个商品
      goodsList: [], //商品集合
      //获取Status=1的商品集合
      goodsListStatus: [],
      //payType=1的商品集合
      goodsList1: [],
      //payType=2的商品集合
      goodsList2: [],
      goodCompleteSum: 0,
      //订单平均价格
      orderAveragePrice: 0,
      //payType=1且userId=当前用户id
      goodsUserList1: [],
      //payType=2且userId=当前用户id
      goodsUserList2: [],
      tabCurrentIndex: 0,
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      navList: [
        {
          text: "平价区交易",
          loadStatus: "more",
          dataList: [],
          params: {
            payType: 0,
            status: 0,
            type: 0,
          },
          whetherEmpty: false,
        },
        {
          text: "溢价区交易",
          loadStatus: "more",
          dataList: [],
          params: {
            payType: 0,
            status: 0,
            type: 1,
          },
          whetherEmpty: false,
        },
      ],
    };
  },

  /**
   * 显示时间活动
   */
  async onShow() {
    // await this.getTimeLine();
    // if (!this.timeLine) {
    //   await uni.showToast({
    //     icon: "none",
    //     duration: 2000,
    //     title: "今天没有活动，明天再来吧",
    //   });
    // }
    this._setTimeInterval = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this._setTimeInterval);
        this.getTimeLine();
      } else {
        this.times = Foundation.countTimeDown(this.time);
        this.time--;
      }
    }, 60000);
    this.getGoodsList();
    this.getGoodsListStatus();
    this.getPayTypeUserId();
  },

  onUnload() {
    this._setTimeInterval && clearInterval(this._setTimeInterval);
  },
  methods: {
    /**
     * 获取时间线商品
     */
    async getTimeLine() {
      this.getGoodsList();
    },
    /**
     * 发起订单
     */
    addOrder() {
      uni.navigateTo({
        url: "/pages/tabbar/transaction/transactionAdd?type=" + this.tabCurrentIndex,
      });
    },
    handleTabClick(index) {
      this.tabCurrentIndex = index;
      //触发刷新页面
      this.getGoodsList();
      this.getGoodsListStatus();
      this.getPayTypeUserId();
    },
    /**
     * 查看出售列表
     *
     */
    showOrderList() {
      uni.navigateTo({
        url: "/pages/tabbar/transaction/transactionSellList?type=" + this.tabCurrentIndex,
      });
    },
    /**
     * 查看购买列表
     */
    weChatShare() {
      uni.navigateTo({
        url: "/pages/tabbar/transaction/transactionBuyList?type=" + this.tabCurrentIndex,
      });
    },
    /**
     * 查看走势图
     */
    trendChart() {
      uni.navigateTo({
        url: "/pages/tabbar/transaction/transactionTrendChart?type=" + this.tabCurrentIndex,
      });
    },
    /**
     * 获取商品集合
     */
    async getGoodsList() {
      this.params.payType = 0;
      this.params.status = 0;
      this.params.type = this.tabCurrentIndex;
      let res = await getOtherOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsList = res.data.result;
      } else {
        this.goodsList = [];
      }
    },
    /**
     * 获取订单Status==1的商品集合
     */
    async getGoodsListStatus() {
      this.params.payType = 0;
      this.params.status = 1;
      this.params.type = this.tabCurrentIndex;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsListStatus = res.data.result;
        //获取Status=1的商品数量
        this.goodCompleteSum = this.goodsListStatus.filter((item) => {
          return item.status == 1;
        }).length;
        //获取订单平均价格
        this.orderAveragePrice = this.goodsListStatus.reduce((total, item) => {
          return total + item.sellPrice;
        }, 0);
        this.orderAveragePrice = this.orderAveragePrice / this.goodsListStatus.length;
      } else {
        this.goodsListStatus = [];
        this.goodCompleteSum = 0;
        this.orderAveragePrice = 0;
      }
    },
    /**
     * 查询payType=1的订单
     */
    async getPayType() {
      this.params.payType = 1;
      this.params.userId = this.$store.state.userInfo.id;
      this.params.type = this.tabCurrentIndex;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsList1 = res.data.result;
      } else {
        this.goodsList1 = [];
      }
    },
    /**
     * 查询payType=2的订单
     */
    async getPayType2() {
      this.params.payType = 2;
      this.params.type = this.tabCurrentIndex;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsList2 = res.data.result;
      } else {
        this.goodsList2 = [];
      }
    },
    /**
     * payTpye=1且userId=当前用户id
     */
    async getPayTypeUserId() {
      this.params.status = 1;
      this.params.userId = this.$store.state.userInfo.id;
      this.params.type = this.tabCurrentIndex;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsUserList1 = res.data.result;
      } else {
        this.goodsUserList1 = [];
      }
    },
    /**
     * payTpye=2且userId=当前用户id
     */
    async getPayType2UserId() {
      this.params.payType = 2;
      this.params.userId = this.$store.state.userInfo.id;
      this.params.type = this.tabCurrentIndex;
      let res = await getMemberOrders(this.params);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsUserList2 = res.data.result;
      } else {
        this.goodsUserList2 = [];
      }
    },
    /**
     * 单击导航时间
     */
    clickNavigateTime(type) {
      this.nav = type;
      this.goodsList = [];
      this.diffTime = parseInt(new Date().getTime() / 1000) - this.resTime;
      this.time =
        this.timeLine[this.nav].distanceStartTime ||
        (this.timeLine[this.nav + 1] &&
          this.timeLine[this.nav + 1].distanceStartTime) ||
        Foundation.theNextDayTime() - this.diffTime;

      this.times = Foundation.countTimeDown(this.time);
      this.getGoodsList();
    },
  },
};
</script>

<style lang="scss" scoped>
.sale {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;
}
.share-btn {
  display: inline-block;
  width: 25%;
  margin: 20px 15px;
}
.under-btn {
  width: 55%;
  margin: auto;
}
.uni-section {
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

  > div {
    font-size: 24rpx;
    margin-top: 20rpx;
    color: #666;
  }
}

.header-wraper {
  background: url("/static/bg.png");
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  > image {
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

.navbar {
  display: flex;
  height: 80rpx;
  padding: 0 5px;
  background: #fff;
  color: $light-color;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;

  .nav-item {
    flex: 1;
    height: 100%;
    font-size: 26rpx;
    color: $light-color;
    position: relative;
    text-align: center;
    text {
      line-height: 80rpx;
    }
    .current {
      font-weight: bold;
      font-size: 28rpx;
      &:after {
        content: "";
        position: absolute;
        bottom: 10rpx;
        left: 108rpx;
        width: 30rpx;
        border-bottom: 2px solid $light-color;
      }
    }
  }
}
</style>
