import {debounce} from "common/utils";
import BackTop from "components/content/backtop/BackTop";

export const itemListenerMixin = {
  data(){
    return {
      itemImgListener:null,
    }
  },
  mounted(){
    const refresh = debounce(this.$refs.scroll.refresh,500);
    this.itemImgListener = () => {
      refresh();
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener);
    //console.log('我是混入的')
  }
}

export const backTopMixin = {
  components:{
    BackTop,
  },
  data(){
    return {
      isShowBackTop: false,
      tabOffsetTop:0,
    }
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500);
    }
  }
}
