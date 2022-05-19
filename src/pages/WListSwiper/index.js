import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Swiper, SwiperItem, ScrollView,Image } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '轮播列表'
    }

    componentWillMount() { }

    componentDidMount() {
        Taro.nextTick(() => {
            /* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
            setTimeout(() => {
                /* 等待滚动区域初始化完成 */
                this.initScrollView().then(() => {
                    /* 获取列表数据，你的代码从此处开始 */
                    console.log('获取列表数据')
                    this.getListData();
                })
            }, 200);
        })

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    state = {
        scrollHeight: '400',
        leftArray: [],
        mainArray: [],
        leftIndex: 0,
        leftIntoView: `left-0`
    }

    /* 初始化滚动区域 */
    initScrollView = () => {
        var that = this
        return new Promise((resolve, reject) => {
            let view = Taro.createSelectorQuery().select('#scroll-panel');
            view.boundingClientRect(res => {
                console.log(res)
                that.setState({
                    scrollTopSize: res.top,
                    scrollHeight: res.height
                }, () => {
                    resolve();
                })
            }).exec();
        });
    }

    /* 获取列表数据 */
    getListData = () => {
        // Promise 为 ES6 新增的API ，有疑问的请自行学习该方法的使用。
        new Promise((resolve, reject) => {
            /* 因无真实数据，当前方法模拟数据。正式项目中将此处替换为 数据请求即可 */
            Taro.showLoading();
            setTimeout(() => {
                /* 因无真实数据，当前方法模拟数据 */
                let [left, main] = [[], []];

                for (let i = 0; i < 25; i++) {
                    left.push(`${i + 1}类商品`);

                    let list = [];
                    let max = Math.floor(Math.random() * 15) || 8;
                    for (let j = 0; j < max; j++) {
                        list.push(j);
                    }
                    main.push({
                        title: `第${i + 1}类商品标题`,
                        list
                    })
                }

                // 将请求接口返回的数据传递给 Promise 对象的 then 函数。
                console.log({ left, main })
                resolve({ left, main });
            }, 1000);
        }).then((res) => {
            console.log('-----------请求接口返回数据示例-------------');
            console.log(res);

            this.setState({
                leftArray: res.left,
                mainArray: res.main
            }, () => {
                Taro.hideLoading();
            })

        });

    }

    /* 左侧导航点击 */
    leftTap = (index) => {
        this.setState({
            leftIndex: index,
            leftIntoView: `left-${index > 5 ? (index - 5) : 0}`
        })
    }

    /* 轮播图切换 */
    swiperChange = (e) => {
        console.log(Taro.getEnv())
        let index
        if(Taro.getEnv() === 'WEB'){
            index = e.detail.current;
        }else{
            index = e.currentTarget.current;
        }
        this.setState({
            leftIndex: index,
            leftIntoView: `left-${index > 5 ? index - 5 : 0}`
        })
    }

    render() {
        const { scrollHeight, leftArray, mainArray, leftIndex, leftIntoView } = this.state
        return (
            <View className='container'>

                {/* 顶部面板 */}
                <View className="top--panel">
                    {/* 顶部面板，可添加所需要放在页面顶部的内容代码。比如banner图 */}
                    <View  className="top--panel-text">
                        <View>这里顶部内容占位区域，不需要则删除</View>
                        <View>可添加需放在页面顶部的内容，比如banner图</View>
                    </View>
                </View>

                {/* 滚动区域 */}
                <View className='scroll-panel' id="scroll-panel">

                    <View className='list-box'>

                        <View className="left">
                            {leftArray.length>0&&<ScrollView
                                scrollY={true}
                                style={`height:${scrollHeight}px;`}
                                scrollIntoView={leftIntoView}
                                scrollWithAnimation={true}
                            >
                                {
                                    leftArray.map((item, index) => {
                                        return (
                                            <View
                                                className={`item ${index == leftIndex ? 'active' : ''}`}
                                                key={index}
                                                id={`left-${index}`}
                                                onClick={this.leftTap.bind(this, index)}
                                            >
                                                {item}
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>}
                        </View>

                        <View className='main'>
                        {mainArray.length>0 && <Swiper
                                className='swiper'
                                style={`height:${scrollHeight}px;`}
                                current={leftIndex}
                                onChange={this.swiperChange.bind(this)}
                                vertical={true}
                                duration={300}
                            >
                                {
                                    mainArray.map((item, index) => {
                                        return (
                                            <SwiperItem
                                                key={index}
                                            >
                                                <ScrollView
                                                    scrollY={true}
                                                    style={`height:${scrollHeight}px;`}
                                                >
                                                    <View className='item'>
                                                        <View className='title'>
                                                            <View>{item.title}</View>
                                                        </View>
                                                        {
                                                            item.list.map((item2, index2) => {
                                                                return (
                                                                    <View className='goods' key={index2}>
                                                                        <Image  className='logo' src={require('../../assets/images/Taro.png')}></Image>
                                                                        <View>
                                                                            <View>第{index2 + 1}个商品标题</View>
                                                                            <View className="describe">第{index2 + 1}个商品的描述内容</View>
                                                                            <View className="money">第{index2 + 1}个商品的价格</View>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </ScrollView>
                                            </SwiperItem>
                                        )
                                    })
                                }

                            </Swiper>}
                        </View>

                    </View>


                </View >

                <View className="bottom-panel">
                    {/* 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 */}
                    <View className="bottom-panel-text">
                        <View>这里底部内容占位区域，不需要则删除</View>
                        <View>可添加需放在页面底部的内容，比如购物车栏目</View>
                    </View>
                </View>

            </View >

        )
    }
}
