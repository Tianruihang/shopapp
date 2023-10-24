<template name="page-head">
	<view class="common-page-head">
		<view class="common-page-head-title">{{title}}</view>
	</view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			title: {
				type: String,
				default: ""
			}
		}
	}
</script>
<style>
/* page */
.common-page-head{
	padding:35rpx;
	text-align: center;
}
.common-page-head-title {
	display: inline-block;
	padding: 0 40rpx;
	font-size: 30rpx;
	height: 88rpx;
	line-height: 88rpx;
	color: #BEBEBE;
	box-sizing: border-box;
	border-bottom: 2rpx solid #D8D8D8;
}
</style>
