//index.js

Page({
  data: {
    city: '广州',
    weatherIcon: '',
    nowTemp: '',
    nowWeather: '',
    todayDate: '',
    todayTemp: ''
  },
  onLoad() {
    var that = this;
    that.getNow();
  },
  onPullDownRefresh() {
    this.getNow(function(){
      wx.stopPullDownRefresh()
    })
  },
  getNow() {
    var that = this;
    wx.request({
      url: 'http://v.juhe.cn/weather/index?format=2&cityname=' + that.data.city + '&key=817072ec690a0cb9b1c8377a36dea76d',
      success: function (res) {
        let result = res.data.result;
        that.setNow(result, that);
        that.setToday(result, that);
        that.setHourlyWeather(result, that)
      },
      complete: function() {
        callback && callback()
      }
    })
  },
  setNow(result, that) {
    let temp = result.sk.temp;
    let weather = result.today.weather;
    let weather_id = result.today.weather_id.fa;
    that.setData({
      nowTemp: temp + '°',
      nowWeather: weather,
      weatherIcon: '/images/g2/120x120/day/' + weather_id + '.png'
    })
  },
  setToday(result, that) {
    let date_y = result.today.date_y;
    let temp = result.today.temperature;
    that.setData({
      todayDate: date_y + '今天',
      todayTemp: temp
    })
  },
  setHourlyWeather(result, that) {
    let nowTime = new Date();
    let weather_id = result.today.weather_id.fa;
    let temp = result.sk.temp;
    let hourlyWeather = [];
    for(var i=0; i<8; i++){
      hourlyWeather.push({
        time: (nowTime.getHours() + i*3) % 24 + '时',
        iconPath: '/images/g1/n' + weather_id + '.gif',
        temp: temp + '°'
      })
    };
    that.setData({
      hourlyWeather: hourlyWeather
    })
  }
})
