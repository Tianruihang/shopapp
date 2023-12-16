<template>
  <view class="content">
    <!-- 可视化 -->
    <view style="background-color: white; border-radius: 4px; margin-top: -4px;">
      <!-- 折线图 -->
      <h4 style="margin-left: 12px; font-size: 16px; height: 30px; line-height: 30px;"> 折线图
      </h4>
      <div class="mui-content-padded">

        <div id="dsj_cxcg" style="width: calc(100vw - 40px); margin: -18px 0px; height: 280px;">
        </div>
      </div>
    </view>
    <button size="mini" class="share-btn" style="margin-top: 30rpx" @click="onBack" plain="true" open-type="share">
      返回
    </button>
  </view>
</template>
<script>
import myIndex from '@/utils/index.js';
export default {
  data() {
    return {
      title: '走势图'
    }
  },
  mounted() {
    this.refreshEchartData();
  },
  methods: {
    onBack() {
      uni.navigateBack();
    },

    refreshEchartData() {

      // 返回数据需在json转换格式工具 转成Json格式
      let result = {
        "data": {
          "unionCompanyNum": 4,
          "yearList": [{
            "isNewRecord": true,
            "comId": "1",
            "fmgbZs": "1",
            "fmsqYx": "1",
            "syxxYx": "1",
            "wgsjYx": "1",
            "rzYx": "1",
            "years": "2022",
            "dnkjcxcgkbjshl": "1",
            "socialCode": "123456"
          }, {
            "isNewRecord": true,
            "comId": "1",
            "years": "2023",
            "dnkjcxcgkbjshl": "2",
            "socialCode": "123456"
          }, {
            "isNewRecord": true,
            "comId": "1",
            "years": "2026",
            "dnkjcxcgkbjshl": "6",
            "socialCode": "123456"
          }, {
            "isNewRecord": true,
            "comId": "1",
            "years": "2027",
            "dnkjcxcgkbjshl": "7",
            "socialCode": "123456"
          }]
        },
        "statusCode": 200,
        "header": {
          "date": "Tue, 30 May 2023 07:08:28 GMT",
          "powered-by": "JeeSite V5.0.1 0",
          "transfer-encoding": "chunked",
          "content-type": "application/json"
        },
        "errMsg": "request:ok"
      };

      let resultData = result.data;
      var dom = document.getElementById("dsj_cxcg");
      if (resultData.yearList != undefined && resultData.yearList.length > 0) {
        // 填充图表1 2
        myIndex.fillChartOneTwo(resultData.yearList,dom);
      }
    }

  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mui-content-padded {
  margin: 10px 8px;
}

.mui-content-padded div {

  font-size: 13px;
}
</style>