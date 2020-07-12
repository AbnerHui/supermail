<template>
  <div class="bottom-bar">
     <div class="check-content">
       <check-button :is-checked="isSelectAll"
                     class="check-button"
                     @click.native="checkClick"/>
       <span>全选</span>
     </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结算 ({{checkLength}})
    </div>
  </div>
</template>

<script>

  import CheckButton from "components/content/checkButton/CheckButton";

  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥'+ this.cartList.filter(item => {
          return item.checked;
        }).reduce((preValue,item) => {
            return preValue + item.price * item.count;
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item => item.checked).length;
      },
      isSelectAll(){
       //return !(this.cartList.filter(item => !item.checked).length);
        if(this.cartList.length === 0) return false;
        return !this.cartList.find(item => !item.checked);
      }
    },
    methods:{
      checkClick(){
        if (this.isSelectAll){
          this.cartList.forEach(item => item.checked = false);
        }else{
          this.cartList.forEach(item => item.checked = true);
        }
      },
      calcClick(){
        if (!this.isSelectAll){
            this.$toast.show('请选择要结算的商品!');
        }
      }
    }
  }
</script>

<style scoped>
   .bottom-bar{
     height: 48px;
     background-color: #eee;
     position: relative;
     line-height: 48px;
     display: flex;
   }

   .check-content{
      display: flex;
      align-items: center;
      margin-left: 10px;
     width: 60px;
   }

  .check-button{
    width: 22px;
    height: 22px;
    line-height: 22px;
    margin-right: 5px ;
  }

  .price{
    margin-left: 30px;
    flex: 1;
  }

  .calculate{
    width: 90px;
    background: red;
    color: #fff;
    text-align: center;
  }
</style>
