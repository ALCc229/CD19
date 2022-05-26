import * as echarts from '../../ec-canvas/echarts';
import geoJson from './china.js';

const app = getApp();


Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      
    },
    children:[]
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     var that = this;

    wx.request({
      url: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf',
      success(res){
        
        res.data.data.diseaseh5Shelf.areaTree[0].children.forEach(item =>{
          item.name = item.name,
          item.value = item.total.nowConfirm
        })
        that.setData({
          children:res.data.data.diseaseh5Shelf.areaTree[0].children
        })

        console.log(that.data.children)
        that.barComponent = that.selectComponent('#mychart-dom-area');
        that.init_map();
      }
      
    })



    

  },

  init_map: function(){
    this.barComponent.init((canvas, width, height) => {
      //初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(barChart);
      echarts.registerMap('china',geoJson);
      barChart.setOption(this.getBarOption());
      return barChart;
    });
  },

  getBarOption(){
    return{
      tooltip: {
      trigger: 'item'
    },
  //视觉映射
    visualMap: {
      type :'piecewise',
      left: 'left',
      top: 'bottom',
      pieces: [
        { min: 10000 }, // 不指定 max，表示 max 为无限大（Infinity）。
        { min: 1000, max:10000  },
        { min: 500, max: 999 },
        { min: 100, max: 499 },
        { min: 10, max: 99 },
        { min: 1, max:9  },

      ],
      color: ['#7A2F11', '#C94D22', '#EE8859', '#F3B494', '#F5DED3'],
      calculable: true
    },
   
    series: [{
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: true
        },
        emphasis: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {

        normal: {
          borderColor: '#389BB7',
          areaColor: '#fff',
        },
        emphasis: {
          areaColor: '#389BB7',
          borderWidth: 0
        }
      },
      animation: false,
    //数据
      data:this.data.children

    }],
    }

  },

  onReady() {

  }
});
