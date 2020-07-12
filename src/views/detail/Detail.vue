<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

<!--    <Toast :message="message" :show="show"></Toast>-->
  </div>
</template>

<script>

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll  from 'components/common/scroll/Scroll'
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {itemListenerMixin,backTopMixin} from 'common/mixin'
  import {debounce} from "../../common/utils";

  //import { mapActions } from 'vuex'
  //import Toast from "../../components/common/toast/Toast";

  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      //Toast
    },
    mixins:[
      itemListenerMixin,backTopMixin
    ],
    data(){
      return {
        iid:null,
        topImages:[],
        goods: {},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        // message:'',
        // show:false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid;

      //2.根据iid请求数据
      getDetail(this.iid).then(res => {
        const data = res.result;
        //获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages;
        //console.log(res)

        //获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

        //创建店铺信息的对象
        this.shop = new Shop(data.shopInfo);

        //保存商品的详情数据
        this.detailInfo = data.detailInfo;

        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);

        //取到评论信息
        if(data.rate.cRate != 0){
          this.commentInfo = data.rate.list[0];
        }

        // this.$nextTick( () => {
        //   this.themeTopYs = [];
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //   console.log(this.themeTopYs)
        // })
      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list;
      })

      //4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
        //console.log(this.themeTopYs)
      },100)
    },
    methods:{
      //...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh();
        this.getThemeTopY();
      },
      titleClick(index){
        //console.log(index)
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],300);
      },
      contentScroll(position){
        //1.获取y值
        const positionY = -position.y;
        //2.positionY和主题中值进行对比
        let length = this.themeTopYs.length;
        for (let i = 0; i < length-1; i++){
          // if (this.currentIndex !== i && ((i < length -1 && positionY >= this.themeTopYs[i] && positionY <
          //   this.themeTopYs[i+1]) || (i === length-1 && positionY > this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }
          //优化
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
        //判断backTop是否显示
        this.isShowBackTop = -position.y > 1000
        //觉得tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      addToCart(){
        //1.获取购物车需要展示的信息添加进去
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        //2.将商品添加到购物车里面
        // this.$store.commit('addCart',product);
        this.$store.dispatch('addCart',product).then(res => {
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = '';
          // },1500)
          // console.log(res)
          console.log(this.$toast)
           this.$toast.show(res,2000);
        });
      }
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImgLoad',this.itemImgListener);
    }
  }
</script>

<style scoped>
 #detail{
   position: relative;
   z-index: 9;
   background-color: #fff;
   height: 100vh;
 }

 .detail-nav{
   position: relative;
   z-index: 9;
   background-color: #fff;
 }

  .content{
    height: calc(100% - 44px);
  }
</style>
