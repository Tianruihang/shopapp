<template>
	<view class="ithui-content" v-if="userAuthStatus">
		<view class="form">
			<view class="form-item">
				<label>姓名</label>
				<input v-model="userInfo.trueName" maxlength="20" placeholder="请输入姓名" autocomplete="off" class="input" />
			</view>
			<view class="form-item">
				<label>身份证号码</label>
				<input v-model="userInfo.idCardNum" maxlength="18" type="idcard" placeholder="请输入身份证号码" autocomplete="off"
					class="input" />
			</view>
<!--			<view class="form-item">-->
<!--				<label>银行预留手机号</label>-->
<!--				<input v-model="userInfo.phone" maxlength="11" type="number" placeholder="请输入银行预留手机号" autocomplete="off"-->
<!--					class="input" />-->
<!--			</view>-->
<!--			<view class="form-item icon-right">-->
<!--				<label>开户银行</label>-->
<!--				<input @click="showBankList = true" :value="userInfo.bank" type="text" disabled placeholder="请选择开户银行"-->
<!--					autocomplete="off" class="input" />-->
<!--			</view>-->
<!--			<u-picker title="请选择开户银行" closeOnClickOverlay :show="showBankList" :columns="bankList"-->
<!--				@cancel="showBankList = false" @confirm="checkBank">-->
<!--			</u-picker>-->
		</view>
		<view class="upload">
			<view class="upload-item idUp">
				<u-upload @afterRead="afterRead" :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedA" @delete="deletePic" multiple
					:maxCount="1" width="160" height="100">
					<image src="@/static/style-one/sfzzm.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">身份证正面</text>
			</view>
			<view class="upload-item idBack">
				<u-upload @afterRead="afterRead" :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedB" @delete="deletePic" multiple
					:maxCount="1" width="160" height="100">
					<image src="@/static/style-one/sfzfm.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">身份证反面</text>
			</view>
			<!-- <view class="upload-item">
				<u-upload @afterRead="afterRead" :fileList="uploadC" @delete="deletePic" name="uploadC" multiple
					:maxCount="1" width="160" height="100">
					<image src="@/static/style-one/yhk.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">银行卡正面</text>
			</view> -->
			<view class="upload-item idUser">
				<u-upload @afterRead="afterRead"  :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedC" @delete="deletePic" multiple
					:maxCount="1" width="160" height="100" >
					<image src="@/static/style-one/scsfz.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">手持身份证正面</text>
			</view>
      <view class="upload-item">
				<u-upload @afterRead="afterRead" :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedD" @delete="deletePic" multiple
					:maxCount="1" width="160" height="100">
					<image src="@/static/style-one/yhk.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">支付宝收款码</text>
			</view>
      <view class="upload-item">
				<u-upload @afterRead="afterRead" :header=" { accessToken: storage.getAccessToken() }" :action="action" @on-uploaded="onUploadedE" @delete="deletePic"  multiple
					:maxCount="1" width="160" height="100">
					<image src="@/static/style-one/yhk.jpg" style="width: 160px;height: 100px;">
					</image>
				</u-upload>
				<text class="title">微信收款码</text>
			</view>
		</view>
		<view class="submit">
      <u-button @click="submit" shape="circle" type="warning" >提交实名</u-button>
		</view>
	</view>
  <view v-else>
    <u-empty
        mode="coupon"
        text="您已经实名制了"
    ></u-empty>
  </view>
</template>

<script>
  import storage from "@/utils/storage.js";
  import {getUserAuth, userAuth} from "../../api/members";
  import { upload } from "@/api/common.js";
  export default {
		data() {
			return {
				userInfo: {
					name: '',
					code: '',
					phone: '',
					bank: '',
					banknum: '',
          trueName: '',
          idCardNum: '',
          onImg: '',
          backImg: '',
          authImg: '',
          zfbImg: '',
          weChatImg: ''
				},
        userAuthStatus: true,
				uploadA: [],
				uploadB: [],
				uploadC: [],
				uploadD: [],
        uploadE: [],
				showBankList: false,
				bankList: [
					['工商银行', '建设银行', '农业银行', '中国银行']
				],
        action: upload, //图片上传地址
        storage,
			}
		},

    async onShow(){
      await this.getUserAtmPoint();
    },

		onLoad() {},
		methods: {

      getUserAtmPoint(){
        getUserAuth().then((res) =>{
          uni.stopPullDownRefresh();
          if (res.data.success) {
            if (res.data.result)
            this.userAuthStatus = false
          }

        })
      },

      onUploadedA(lists) {
        lists.forEach((item) => {
          this.userInfo.onImg = item.response.result;
        });
      },

      onUploadedB(lists) {
        lists.forEach((item) => {
          this.userInfo.backImg = item.response.result;
        });
      },

      onUploadedC(lists) {
        lists.forEach((item) => {
          this.userInfo.authImg = item.response.result;
        });
      },

      onUploadedD(lists) {
        lists.forEach((item) => {
          this.userInfo.zfbImg = item.response.result;
        });
      },

      onUploadedE(lists) {
        lists.forEach((item) => {
          this.userInfo.weChatImg = item.response.result;
        });
      },

			checkBank(e) {
				this.userInfo.bank = e.value
				this.showBankList = false
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
				if (!this.userInfo.trueName) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none',
						duration: 2000
					});
				} else if (!this.userInfo.idCardNum) {
					uni.showToast({
						title: '请输入身份证号码',
						icon: 'none',
						duration: 2000
					});
				} else if (!this.$u.test.idCard(this.userInfo.idCardNum)) {
					uni.showToast({
						title: '身份证号码格式不正确',
						icon: 'none',
						duration: 2000
					});
				}
        // else if (!this.userInfo.phone) {
				// 	uni.showToast({
				// 		title: '请输入银行预留手机号',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// } else if (!uni.$u.test.mobile(this.userInfo.phone)) {
				// 	uni.showToast({
				// 		title: '手机号格式不正确',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// } else if (!this.userInfo.bank) {
				// 	uni.showToast({
				// 		title: '请选择开户银行',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// } else if (!this.userInfo.banknum) {
				// 	uni.showToast({
				// 		title: '请输入储蓄卡卡号',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// } else if (!uni.$u.test.rangeLength(this.userInfo.banknum, [16, 19])) {
				// 	uni.showToast({
				// 		title: '储蓄卡卡号格式不正确',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// }
        else if (this.userInfo.onImg.length === 0) {
					uni.showToast({
						title: '请上传身份证正面',
						icon: 'none',
						duration: 2000
					});
				} else if (this.userInfo.backImg.length === 0) {
					uni.showToast({
						title: '请上传身份证反面',
						icon: 'none',
						duration: 2000
					});
				} else if (this.userInfo.authImg.length === 0) {
					uni.showToast({
						title: '请上传手持身份证照片',
						icon: 'none',
						duration: 2000
					});
				} else if (this.userInfo.zfbImg.length === 0) {
          uni.showToast({
            title: '请上传支付宝实名认证页面',
            icon: 'none',
            duration: 2000
          });
        } else if (this.userInfo.weChatImg.length === 0) {
					uni.showToast({
						title: '请上传微信实名认证页面',
						icon: 'none',
						duration: 2000
					});
				} else {
          const params = JSON.parse(JSON.stringify(this.userInfo));
					//提交表单
          userAuth(params).then((res) => {
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
			uploadFilePromise(event) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21/upload', // 仅为示例，非真实的接口地址
						filePath: event,
						name: 'file',
						formData: {},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						},
						fail: () => {
							reject()
						}
					});
				})
			}
		}
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
