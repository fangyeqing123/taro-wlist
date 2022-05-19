import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, ScrollView,Image } from '@tarojs/components'
import './index.scss'

export default class WListScroll extends Component {

    config = {
        navigationBarTitleText: '滑动列表'
    }

    componentWillMount() {

    }

    componentDidMount() {
        /* 等待DOM挂载完成 */
        Taro.nextTick(() => {
            /* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
            setTimeout(() => {
                /* 等待滚动区域初始化完成 */
                this.initScrollView().then(() => {
                    /* 获取列表数据，你的代码从此处开始 */
                    this.getListData();
                })
            }, 200);
        })

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    state = {
        scrollHeight: 400,
        scrollTopSize: 0,
        fillHeight: 0,	// 填充高度，用于最后一项低于滚动区域时使用
        leftArray: [],
        mainArray: [],
        topArr: [],
        leftIndex: 0,
        scrollInto: '',
        leftIntoView: `left-0`
    }

    /* 初始化滚动区域 */
    initScrollView = () => {
        var that = this
        return new Promise((resolve, reject) => {
            let view = Taro.createSelectorQuery().select('#scroll-panel');
            view.boundingClientRect(res => {
                that.setState({
                    scrollTopSize: res.top,
                    scrollHeight: res.height
                }, () => {
                    Taro.nextTick(() => {
                        resolve();
                    })
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
                let [left, main] = [[], []];

                for (let i = 0; i < 25; i++) {
                    left.push(`${i + 1}类商品`);

                    let list = [];
                    let r = Math.floor(Math.random() * 10);
                    r = r < 1 ? 3 : r;
                    for (let j = 0; j < r; j++) {
                        list.push(j);
                    }
                    main.push({
                        title: `第${i + 1}类商品标题`,
                        list
                    })
                }

                // 将请求接口返回的数据传递给 Promise 对象的 then 函数。
                resolve({ left, main });
            }, 1000);
        }).then((res) => {
            console.log('-----------请求接口返回数据示例-------------');

            Taro.hideLoading();
            this.setState({
                leftArray: res.left,
                mainArray: res.main
            }, () => {
                // DOM 挂载后 再调用 getElementTop 获取高度的方法。
                Taro.nextTick(() => {
                    this.getElementTop();
                });
            })
        });

    }

    /* 左侧导航点击 */
    leftTap = (index) => {
        console.log(index)
        let leftIndex = (index < 0 ? 0 : index);
        this.setState({
            scrollInto: `item-${index}`,
            leftIndex
        })
    }

    /* 主区域滚动监听 */
    mainScroll = (e) => {
        const { topArr } = this.state
        let top = e.detail.scrollTop;
        let index = 0;
        /* 查找当前滚动距离 */
        for (let i = (topArr.length - 1); i >= 0; i--) {
            /* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
            if ((top + 2) >= topArr[i]) {
                index = i;
                break;
            }
        }
        let leftIndex = (index < 0 ? 0 : index);

        this.setState({
            leftIndex,
            leftIntoView: `left-${leftIndex > 3 ? (leftIndex - 3) : 0}`
        })
    }

    /* 获取元素顶部信息 */
    getElementTop = () => {
        const { scrollTopSize, scrollHeight } = this.state
        new Promise((resolve, reject) => {
            let view = Taro.createSelectorQuery().selectAll('.main-item');
            view.boundingClientRect(data => {
                resolve(data);
            }).exec();
        }).then((res) => {
            let topArr = res.map((item) => {
                return item.top - scrollTopSize;	/* 减去滚动容器距离顶部的距离 */
            });
            this.setState({
                topArr
            },()=>{
                console.log(this.state.topArr)
            })

            /* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
            let last = res[res.length - 1].height;
            if (last - 20 < scrollHeight) {
                this.setState({
                    fillHeight: scrollHeight - last + 20
                })
            }
        });
    }

    render() {
        const {
            scrollHeight,
            leftArray,
            leftIndex,
            mainArray,
            fillHeight,
            leftIntoView,
            scrollInto
        } = this.state
        return (
            <View className='container'>

                <View className="top--panel">
                    {/* 顶部面板，可添加所需要放在页面顶部的内容代码。比如banner图 */}
                    <View className="top--panel-text">
                        <View>这里顶部内容占位区域，不需要则删除</View>
                        <View>可添加需放在页面顶部的内容，比如banner图</View>
                    </View>
                </View>

                {/* 滚动区域 */}
                <View className='scroll-panel' id='scroll-panel'>
                    <View className='list-box'>
                        <View className='left'>
                            <ScrollView
                                scrollY={true}
                                style={`height:${scrollHeight}px;`}
                                scrollIntoView={leftIntoView}
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
                            </ScrollView>
                        </View>

                        <View className="main">
                            <ScrollView
                                scrollY={true}
                                style={`height:${scrollHeight}px;`}
                                onScroll={this.mainScroll.bind(this)}
                                scrollWithAnimation={true}
                                scrollIntoView={scrollInto}
                            >
                                {
                                    mainArray.map((item, index) => {
                                        return (
                                            <View
                                                className='item main-item'
                                                key={index}
                                                id={`item-${index}`}
                                            >
                                                <View className="title">
                                                    <View>{item.title}</View>
                                                </View>
                                                {
                                                    item.list.map((item2, index2) => {
                                                        return (
                                                            <View className="goods" key={index2}>
                                                                <Image className="logo" src={require('../../assets/images/Taro.png')} mode=""></Image>
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
                                        )
                                    })
                                }
                                <View className="fill-last" style={`height:${fillHeight};`}></View>
                            </ScrollView>
                        </View>


                    </View>



                </View>

                {/* 底部面板 */}
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
