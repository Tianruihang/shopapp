<template>
	<view style="width: 100px;height: 100px; display: inline;">
		<view v-for="(item, index) in res" :key="index" class="goods-row" @click="navigateToDetailPage(item)">
			<view class="goods-detail">
				<div class='flex flex-a-c flex-j-sb'>
					<div>
						<image class='buy' :src="item.goodsImage"></image>
					</div>
					<view class="price-box">
						<div v-if="item.price!=undefined">
							数量<span>{{ item.price }} </span>
						</div>
						<!-- 砍价 -->
						<div v-if="item.purchasePrice!=undefined">
							价格<span>{{ item.purchasePrice }} </span>
						</div>
						<div v-if="!item.price">
							合计<span>0 </span>
						</div>
						<button>卖给他</button>
					</view>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	import commonTpl from '@/components/m-goods-list/common'
	export default {
		data() {
			return {
				lightColor: this.$mainColor,
				buy: require('@/static/buy.png')
			}
		},
		mixins: [commonTpl],
		props: {
			// 遍历的数据
			res: {
				type: Array,
			},
			type:{
				type:null,
				default:""
			}
		},
		methods: {
			// 跳转到商品详情
			navigateToDetailPage(item) {
				if(this.type == 'kanJia'){
					 uni.navigateTo({
						url: `/pages/promotion/bargain/detail?id=${item.id}`,
					});
					return
				}
				uni.navigateTo({
					url: `/pages/product/goods?id=${item.skuId}&goodsId=${item.goodsId}`,
				});
			},
		}
	}
</script>

<style lang='scss' scoped>
	.buy {
		width: 152rpx;
		height: 108rpx;
	}
	.flex-j-sb {
		width: 100%;
	}
	.goods-row {
		background: #fff;
		padding: 16rpx;
		>.goods-col {
			display: flex;
			>.goods-img {
				overflow: hidden;
				flex: 4;
			}
			>.goods-detail {
				flex: 7;
			}
		}
	}
	.goods-detail {
		margin: 0 20rpx;
		>.title {
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 1.5;
			height: 86rpx;
			padding: 10rpx 0 0;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.promotion {
			margin-top: 4rpx;
			display: flex;

			div {
				span {
					font-size: 24rpx;
					color: $light-color;
					margin-right: 10rpx;
					padding: 0 4rpx;
					border-radius: 2rpx;
				}
			}
		}

		.count-config {
			padding: 5rpx 0;
			color: #666;
			display: flex;
			font-size: 24rpx;
			letter-spacing:2rpx;
			padding-left: 10rpx;
		}



	}

	.price-box {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 10rpx;
		font-size: 24rpx;
		color: $font-color-light;

		>.price {
			font-size: 26rpx;
			line-height: 1;
			color: $main-color;
			font-weight: bold;

			/deep/ span:nth-of-type(1) {
				font-size: 48rpx;
			}
		}
	}
</style>
