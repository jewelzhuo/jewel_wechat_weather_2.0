//index.js
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;

const UNPROMPTED_TIPS = '点击获取当前位置';
const UNAUTHORIZED_TIPS = '点击开启位置权限';
const AUTHORIZED_TIPS = '';

Page({
  data: {
    city: '上海',
    weatherIcon: '',
    nowTemp: '',
    nowWeather: '',
    todayDate: '',
    todayTemp: '',
    hourlyWeather: [],
    locationAuthType: UNPROMPTED
  },
  onLoad() {
    var that = this;
    that.qqmapsdk = new QQMapWX({ //实例化API核心类，qqmapsdk在此程序里不需要声明，是局部变量还是全局变量？
      key: 'I77BZ-GZP3O-D77WO-S2F4Q-YAJXE-QZBQ6'
    })
    wx.getSetting({ //页面刷新后，获取并更新当前页面的设置状态
      success: function(res) {
        let auth = res.authSetting['scope.userLocation'];
        let locationAuthType = auth ? AUTHORIZED : (auth == false) ? UNAUTHORIZED : UNPROMPTED;
        that.setData({
          locationAuthType: locationAuthType
        });
        if(auth) {
          that.getCityAndWeather(that)
        }
        else {
          that.getNow()
        }
      },
      fail: function() {
        that.getNow()
      }
    })
  },
  onPullDownRefresh() {
    this.getNow(function(){
      wx.stopPullDownRefresh()
    })
  },
  getNow(callback) {
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
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city
    })
  },
  onTapLocation() {
    var that = this;
    if (that.data.locationAuthType === UNAUTHORIZED) {
      wx.openSetting({
        success: function(res) {
          let auth = res.authSetting['scope.userLocation'];
          if(auth){
            that.getCityAndWeather(that)
          };
        }
      })
    }
    else {
      that.getCityAndWeather(that)
    }
  },
  getCityAndWeather(that) {
    wx.getLocation({
      success: function (res) {
        that.setData({
          locationAuthType: AUTHORIZED
        });
        that.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            let city = res.result.address_component.city;
            that.setData({
              city: city
            });
            that.getNow()
          },
        });
      },
      fail: function () {
        that.setData({
          locationAuthType: UNAUTHORIZED
        })
      }
    });
  }
})
