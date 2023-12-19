import echarts from '@/utils/echarts.min.js'


const colorsArr = ['#7021FF', '#C3A5FF', '#00D3FA', '#3181FF', '#A5D9FF'];
const colorsArrTwo = ['#7021FF', '#A5D9FF', '#00D3FA'];


// 填充大数据分析图表 1和2
function fillChartOneTwo(info,dom) {

	let yearArr = []; // 年份
	let FMGB_ZSArr = []; //
	let FMSQ_YXArr = []; //授权
	let SYXX_YXArr = []; //实用新型
	let RZ_YXArr = []; // 软著有效数
	let WGSJ_YXArr = []; // 外观设计有效数
	let DNKJCXCGKBJSHLArr = []; // 当年科技创新成果可比技术含量


	for (let s of info) {

		FMGB_ZSArr.push(s.fmgbZs)
		FMSQ_YXArr.push(s.fmsqYx)
		SYXX_YXArr.push(s.syxxYx)
		RZ_YXArr.push(s.rzYx)
		WGSJ_YXArr.push(s.wgsjYx)
		console.log(s.maxUsualPrice)
		DNKJCXCGKBJSHLArr.push(s.maxUsualPrice)
		//获取日期的日期
		yearArr.push(s.startTime.substring(0, 9));

	}

	//获取 dsj_zscq内容
	var myChart = echarts.init(dom);
	var option;

	option = {
		color: colorsArr,
		silent: false, //取消点击高亮
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// Use axis to trigger tooltip
				type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
			}
		},
		legend: {
			selectedMode: true,
			data: ['走势图']
		},
		grid: {
			left: '2%',
			right: '2%',
			bottom: '2%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: yearArr,
			axisLabel: {

				fontSize: 10
			},
		},
		yAxis: {
			type: 'value'
		},
		series: [{
				name: '走势图',
				type: 'bar',
				barMaxWidth: 30,
				stack: 'total',
				clickable: false,

				emphasis: {
					focus: 'series'
				},
				data: FMSQ_YXArr
			}


		]
	};
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}
	// 企业历年创新成果趋势
	dom = document.getElementById("dsj_cxcg");
	myChart = echarts.init(dom);
	option = {
		color: colorsArr,
		silent: false, //取消点击高亮
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999999'
				}
			}
		},
		legend: {
			selectedMode: true,
		},
		grid: {
			left: '2%',
			right: '2%',
			bottom: '2%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: yearArr,
			axisLabel: {

				fontSize: 10
			},
		},
		yAxis: {
			type: 'value'
		},
		series: [{
				data: DNKJCXCGKBJSHLArr,
				type: 'line',

			}

		]
	};
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}

}








module.exports = {
	fillChartOneTwo
}