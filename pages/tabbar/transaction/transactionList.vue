<template>
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
					<uni-td width="14" align="center"><a>查看出售</a> </uni-td>
					<uni-td width="14" align="left">★已完成</uni-td>
					<uni-td width="14" align="left">1</uni-td>
				</uni-tr>
				<uni-tr>
					<uni-td width="14" align="left">★已取消</uni-td>
					<uni-td width="14" align="left">1 </uni-td>
					<uni-td width="14" align="center"><a>购买订单</a></uni-td>
					<uni-td width="14" align="center"><a>查看购买</a></uni-td>
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
			<uni-section title="交易量" type="line" >
				<uni-card :is-shadow="false">
					<text class="uni-body">100</text>
				</uni-card>
			</uni-section>
			<uni-section title="均价" type="line" >
				<uni-card :is-shadow="false">
					<text class="uni-body">1</text>
				</uni-card>
			</uni-section>
		</view>
		<view >
			<button size="mini" class="share-btn" @click="weChatShare" plain="true" open-type="share">
				发布订单
			</button>
			<button size="mini" class="share-btn" @click="weChatShare" plain="true" open-type="share">
				出售列表
			</button>
			<button size="mini" class="share-btn" @click="weChatShare" plain="true" open-type="share">
				购买列表
			</button>
			<button class="under-btn" @click="weChatShare" plain="true" open-type="share">
				查看走势图
			</button>
		</view>
		<view class="sale-items" >
			<tranPromotion :res="goodsList"></tranPromotion>
		</view>

	</view>
</template>

<script>
	import {
		getSeckillTimeLine,
		getSeckillTimeGoods
	} from "@/api/promotions.js";
	import Foundation from "@/utils/Foundation.js";
	import tranPromotion from '@/components/m-goods-list/tranPromotion.vue'
	import pageHead from '@/components/page-head/page-head.vue'
	import uniTable from '@/components/uni-table/components/uni-table/uni-table.vue'
	import uniTr from '@/components/uni-table/components/uni-tr/uni-tr.vue'
	import uniTh from '@/components/uni-table/components/uni-th/uni-th.vue'
	import uniTd from '@/components/uni-table/components/uni-td/uni-td.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniCard from '@/components/uni-card/uni-card.vue'
	export default {
		components: {
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
        		title: '交易时间8:00-23:00',
				nav: 0, //默认选择第一个时间
				timeLine: "", //获取几个点活动
				resTime: 0, //当前时间
				time: 0, //距离下一个活动的时间值
				times: {}, //时间集合
				onlyOne: "", //是否最后一个商品
				goodsList: [
          		{index:1,goodsName:"测试",price:100,purchasePrice:100,originalPrice:100,goodsImage:"https://img.yzcdn.cn/vant/cat.jpeg",type:1}
				  ,{index:2,goodsName:"测试",price:100,purchasePrice:100,originalPrice:100,goodsImage:"https://img.yzcdn.cn/vant/cat.jpeg",type:1}
        		], //商品集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
			};
		},

		/**
		 * 显示时间活动
		 */
		async onShow() {
			await this.getTimeLine();
			if (!this.timeLine) {
				await uni.showToast({
					icon: "none",
					duration: 2000,
					title: "今天没有活动，明天再来吧",
				});
			}
			this._setTimeInterval = setInterval(() => {
				if (this.time <= 0) {
					clearInterval(this._setTimeInterval);
					this.getGoodsList();
					this.getTimeLine();
				} else {
					this.times = Foundation.countTimeDown(this.time);
					this.time--;
				}
			}, 1000);
		},

		onUnload() {
			this._setTimeInterval && clearInterval(this._setTimeInterval);
		},
		methods: {
			/**
			 * 获取时间线商品
			 */
			async getTimeLine() {
				let res = await getSeckillTimeLine();
				if (res.data.success && res.data.result.length > 0) {
					let timeLine = res.data.result.sort(
						(x, y) => Number(x.timeLine) - Number(y.timeLine)
					);
					this.timeLine = timeLine.slice(0, 5);
					this.resTime = parseInt(new Date().getTime() / 1000);
					this.onlyOne = res.data.result.length === 1;
					this.diffTime = parseInt(new Date().getTime() / 1000) - this.resTime;

					this.time =
						this.timeLine[this.nav].distanceStartTime ||
						(this.timeLine[this.nav + 1] &&
							this.timeLine[this.nav + 1].distanceStartTime) ||
						Foundation.theNextDayTime() - this.diffTime;
					this.times = Foundation.countTimeDown(this.time);

					this.getGoodsList();
				}
			},

			/**
			 * 获取商品集合
			 */
			async getGoodsList() {
				this.params.timeLine = this.timeLine[this.nav].timeLine;
				let res = await getSeckillTimeGoods(this.params.timeLine);
				if (res.data.success && res.data.result.length != 0) {
					this.goodsList = res.data.result;
				} else {
					this.goodsList = [];
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
