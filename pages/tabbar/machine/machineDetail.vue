<template>
  <view class="sale">
    <!-- <u-navbar title='限时抢购'></u-navbar> -->
    <!-- 买家 -->

    <br />
    <view class="uni-container" >
      <uni-table ref="table" border stripe>
        <uni-tr>
          <uni-td  align="center">矿机信息</uni-td>
          <uni-td  align="center">限购{{machine.limitNum}}台</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">数据包名称</uni-td>
          <uni-td  align="center">{{machine.name}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">数据包价格</uni-td>
          <uni-td  align="center">{{machine.price}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">运行时间</uni-td>
          <uni-td  align="center">{{machine.limitHours}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">预计产币</uni-td>
          <uni-td  align="center">{{machine.sumPoints}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">每小时产币</uni-td>
          <uni-td  align="center">{{machine.hourPoints}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">数据包算力</uni-td>
          <uni-td  align="center">{{machine.power}}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">支付方式</uni-td>
          <uni-td  align="center">ATOM</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td  align="center">购买数量</uni-td>
          <uni-td  align="center">
            <input type="number" v-model="order.num" />
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view align="center" >
      <button size="mini" class="share-btn" @click="updateOrderStatus" plain="true" open-type="share">
        立即购买
      </button>
      <button size="mini" class="share-btn" @click="onBack" plain="true" open-type="share">
        返回
      </button>
    </view>

  </view>
</template>

<script>
import tranPromotion from '@/components/m-goods-list/tranPromotion.vue'
import pageHead from '@/components/page-head/page-head.vue'
import uniTable from '@/components/uni-table/components/uni-table/uni-table.vue'
import uniTr from '@/components/uni-table/components/uni-tr/uni-tr.vue'
import uniTh from '@/components/uni-table/components/uni-th/uni-th.vue'
import uniTd from '@/components/uni-table/components/uni-td/uni-td.vue'
import uniSection from '@/components/uni-section/uni-section.vue'
import uniCard from '@/components/uni-card/uni-card.vue'
import {getMachineDetail,buyMachine} from "../../../api/promotions";
import UInput from "../../../uview-ui/components/u-input/u-input.vue";
import {orderStatusList2} from "../../../utils/filters";

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
      machine: {}, //上一条集合
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
    await this.getMachineList();
  },

  async onLoad(options) {
    console.log(options);
    this.params.id = options.id;
    this.order.machineId = options.id;
  },

  onUnload() {
    this._setTimeInterval && clearInterval(this._setTimeInterval);
  },
  methods: {
    orderStatusList2,
    // 返回上一级
    onBack() {
      uni.navigateBack();
    },

    //获取信息
    async getMachineList() {
      let res = await getMachineDetail(this.params.id);
      if (res.data.success && res.data.result.length != 0) {
        this.machine = res.data.result;
      } else {
        this.machine = {};
      }
    },

    //更新订单状态
    async updateOrderStatus() {
      let res = await buyMachine(this.order);
      if (res.data.success) {
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
