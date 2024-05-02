<template>
	<view class="ithui-content" >
		<view class="form">
			<view class="form-item">
				<label>充币数量</label>
				<input v-model="atmUserRecharge.num" maxlength="20" placeholder="请输入数量" autocomplete="off" class="input" />
			</view>
			<view class="form-item">
				<label>交易密码</label>
				<input v-model="atmUserRecharge.userId" maxlength="18" placeholder="请输入交易密码" autocomplete="off"
					class="input" />
			</view>
      <view class="form-item">
        <label>atm收款地址</label>
        <input v-model="atmExchangeRule.collectUrl" maxlength="18" placeholder="请输入收款地址" autocomplete="off"
               class="input" />
      </view>
		</view>
    <view>
      <label>atm收款二维码</label>
      <div class='goods' v-if="atmExchangeRule">
        <image class="goods-image" :src="atmExchangeRule.collectImg" alt=""></image>
      </div>
    </view>
		<view class="upload">
			<view class="upload-item">
				<u-upload @afterRead="afterRead" :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedA" @delete="deletePic" multiple
					:maxCount="1" width="160" height="100">
				</u-upload>
				<text class="title">上传凭证</text>
			</view>
		</view>
		<view class="submit">
      <u-button @click="submit" shape="circle" type="warning" >提交</u-button>
		</view>
    <div>
      <u-empty  v-if="whetherEmpty" mode="empty" text="暂无数据"></u-empty>
      <view v-else  v-for="(item, index) in atmRechargePage.records" :key="index">
        <view class="ithui-content"  style="margin-top: 20px">
          <view class="form">
            <view class="form-item">
              <label>充币数量</label>
              <input v-model="item.num" maxlength="20" autocomplete="off" class="input" disabled/>
            </view>
            <view class="form-item">
              <label>币种类型</label>
              <input v-model="item.cashType" maxlength="18" autocomplete="off"
                     class="input" disabled/>
            </view>
            <view class="form-item">
              <label>状态</label>
              <input v-model="item.status == 0 ? '待审核' : item.status == 1 ? '已通过' : '已拒绝'" maxlength="18" autocomplete="off"
                     class="input" disabled/>
            </view>
          </view>
        </view>
      </view>
    </div>
	</view>
</template>

<script>
  import storage from "@/utils/storage.js";
  import {getUserAuth, userAuth, userRechange} from "../../api/members";
  import { upload } from "@/api/common.js";
  import {rechangePage, userWidthdraw} from "../../api/members";
  import {getLastRule} from "../../api/promotions";
  export default {
		data() {
			return {
        whetherEmpty: false, //是否为空
				atmUserRecharge: {
          userId: '',
          type: '0',
          num: '',
          fileImg: '',
				},
        searchParam: {
          type: 0,
        },
        atmRechargePage: [],
        atmExchangeRule: {
          collectImg: '',
          collectUrl: '',
        },
				uploadA: [],
        action: upload, //图片上传地址
        storage,
			}
		},

		onLoad() {
      this.getWidthdrawalPage();
    },
		methods: {

      getUserAtmPoint(){
        getLastRule().then((res) =>{
          if (res.data.success) {
            if (res.data.result)
              this.atmExchangeRule = res.data.result;
            else
              this.atmExchangeRule = {};
          }

        })
      },

      onUploadedA(lists) {
        lists.forEach((item) => {
          this.atmUserRecharge.fileImg = item.response.result;
        });
      },
			// 选择图片
			afterRead(event) {
				this[event.name] = event.file
			},
			// 删除图片
			deletePic(event) {
				this[event.name] = []
			},
			async submit() {
				if (!this.atmUserRecharge.fileImg) {
					uni.showToast({
						title: '请上传凭证',
						icon: 'none',
						duration: 2000
					});
				} else {
          const params = JSON.parse(JSON.stringify(this.atmUserRecharge));
          //获取用户ID
          params.userId = this.$store.state.userInfo.id;
					//提交表单
          userRechange(params).then((res) => {
            let data = res.data;
            if (data.success) {
              uni.showToast({
                title: "保存成功!",
                icon: "none",
              });
              getCurrentPages().length > 1 ?
                  uni.navigateBack({
                    delta: getCurrentPages().length - 2,
                  }) :
                  uni.switchTab({
                    url: "/pages/tabbar/home/index",
                  });
            }
          })
				}
			},
      //列表页面
      //page页面
      getWidthdrawalPage(){
        //获取用户提币页面
        const params = JSON.parse(JSON.stringify(this.searchParam));
        //获取用户ID
        params.userId = this.$store.state.userInfo.id;
        rechangePage(params).then((res) => {
          let data = res.data;
          if (data.success) {
            this.atmRechargePage = data.result;
            if (this.atmRechargePage.total == 0) {
              // 当本次请求数据为空展示空信息
              this.whetherEmpty = true;
            } else {
              this.atmRechargePage.records.push(...this.atmRechargePage.records);
              this.loadStatus = "noMore";
            }
          }
        })
      }
		},

	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style lang="scss" scoped>
	.ithui {
		&-content {
			.form {
				padding: 0 20rpx;
				padding-bottom: 48rpx;

				&-item {
					height: 100rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 34rpx;
					border-bottom: 2rpx solid #eeeeee;
					color: #333;
					padding: 0 20rpx;
					width: 100%;

					label {
						flex-shrink: 0;
						padding-right: 20rpx;
					}

					.input {
						height: 40rpx;
						text-align: right;
						padding-right: 50rpx;
						width: 100%;
					}
				}

				.icon-right:after {
					content: "";
					background: url(@/static/arrow-right.png) center right no-repeat;
					position: relative;
					top: 0;
					right: 40rpx;
					height: 100%;
					display: inline-block;
					background-size: 15rpx 30rpx;
					width: 30rpx;
				}

			}

			.upload {
				justify-content: space-between;
				flex-wrap: wrap;
				&-item {
					width: 310rpx;
          margin: auto;
					padding: 20rpx;
					text-align: center;

					.title {
						color: #999;
						font-size: 28rpx;
						line-height: 28rpx;
					}
				}
			}
      .idUp{
        background: url(@/static/style-one/sfzzm.jpg) no-repeat;
        background-size: contain;
      }
      .idBack{
        background: url(@/static/style-one/sfzfm.jpg) no-repeat;
        background-size: contain;
      }
      .idUser{
        background: url(@/static/style-one/scsfz.jpg) no-repeat;
        background-size: contain;
      }



			.submit {
				margin-top: 40rpx;
				padding: 20px;
			}
		}
	}
</style>
