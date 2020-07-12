<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!--商品的列表-->
    <cart-list/>
    <!--底部-->
    <cart-bottom-bar/>
  </div>
</template>

<script>

  import NavBar from "components/common/navbar/NavBar";
  import cartList from "./childComps/cartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {NavBar,cartList,CartBottomBar},
    comments: {
      NavBar
    },
    computed:{
      ...mapGetters(['cartLength','cartList'])
      //...mapGetters({
      // 别名:'cartLength'
      // })
    }
  }
</script>

<style scoped>

  .cart{
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
