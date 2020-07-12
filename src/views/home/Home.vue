<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <Scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </Scroll>
    <!--监听组件的点击 .native-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";

  //default导出才能不写{}
  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {itemListenerMixin,backTopMixin} from 'common/mixin'


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
    },
    mixins:[
      itemListenerMixin,backTopMixin
    ],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop: false,
        isTabFixed:false,
        saveY:0,
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list;
      }
    },
    //这两个钩子函数必须加<keep-alive>才生效
    activated() {
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0,this.saveY,0);
    },
    deactivated() {
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY();
      //2.取消全局事件的监听
      this.$bus.$off();
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata();
      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
      // const refresh = debounce(this.$refs.scroll.refresh,500);
      // //对监听事件的保存
      // this.itemImgListener = () => {
      //   //this.$refs.scroll.refresh();
      //   refresh();
      // }
      // //3.监听item中图片加载完成
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
    },
    methods:{
      /*
      * 事件监听相关方法
      * */

      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position){
          //判断backTop是否显示
          this.isShowBackTop = -position.y > 1000
          //觉得tabControl是否吸顶(position:fixed)
          this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType);
      },
      /*
      * 网络请求相关方法
      * */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page+1;
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page+=1;

          this.$refs.scroll.finishPullUp();
        })
      },
      swiperImageLoad(){
        //获取tabControl的offsetTop
        //所有的属性都有一个属性$el,用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      }
    }
  }
</script>

<!--scoped作用域-->
<style scoped>
  #home{
   /* padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;

    /*使用原生浏览器的滚动,为了不让导航不跟着滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }


  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

   .tab-control {
     position: relative;
     z-index: 9;
   }

/*  .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/
</style>
