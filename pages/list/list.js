// pages/list/list.js
Page({
  data: {
    weekWeather: [],
    city: '上海'
  },
  onLoad(options) {
    this.setData({
      city: options.city
    })
    this.getWeekWeather()
  },
  onPullDownRefresh() {
    this.getWeekWeather(function() {
      wx.stopPullDownRefresh()
    })
  },
  getWeekWeather(callback){
    var that = this;
    wx.request({
      url: 'http://v.juhe.cn/weather/index?format=2&cityname=' + that.data.city + '&key=817072ec690a0cb9b1c8377a36dea76d',
      success: function (res) {
        let result = res.data.result;
        that.setWeekWeather(result, that)
      },
      complete: function() {
        callback && callback()
      }
    })
  },
  setWeekWeather(result, that) {
    let future = result.future;
    let weekWeather = [];
    for(var i=0; i<7; i++) {
      weekWeather.push({
        day: future[i].date,
        date: future[i].week,
        temp: future[i].temperature,
        iconPath: '/images/g1/n' + future[i].weather_id.fa + '.gif'
      })
    };
    weekWeather[0].day = '今天';
    that.setData({
      weekWeather: weekWeather
    })
  }
})