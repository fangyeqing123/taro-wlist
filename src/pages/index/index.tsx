import { Component } from 'react'
import { View, Text,Navigator } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        <View className="t1">点击下方链接体验</View>
        <Navigator className="navigator" url="../WListScroll/index" hoverClass="hover" >
          <View className="title">
            <Text>滚动式联动</Text>
            <Text className="link">立即体验</Text></View>
          <View className="content">
            <View>
              优点：滚动流畅度很好，全平台兼容
				</View>
            <View>
              缺点：因为需要计算高度的原因，需要在页面初始化时将所有商品信息返回，若是有大量的数据，不太建议这样做，会影响到打开时的加载速度
				</View>
          </View>
        </Navigator>
        <Navigator className="navigator" url="../WListSwiper/index" hoverClass="hover">
          <View className="title">
            <Text>轮播式联动</Text>
            <Text className="link">立即体验</Text>
          </View>
          <View className="content">
            <View>
              优点：左侧导航与主内容区域联动性好
				</View>
            <View>
              缺点：因H5平台浏览器众多，体验欠佳，不建议在H5平台使用
				</View>
          </View>
        </Navigator>
        <View className="t2">
          <View>因数据不可控的原因，请各位开发者们选择适合自己的模板使用，各有优缺点，选择适合自己的才是最好的。</View>
        </View>
      </View>
    )
  }
}
