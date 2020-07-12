<template>
  <div v-if="Object.keys(commentInfo).length !== 0" class="comment-info">
    <div class="info-header">
      <div class="header-title">用户评价</div>
      <div class="header-more">
        更多
        <i class="arrow-right"></i>
      </div>
    </div>
    <div class="info-user">
      <img :src="commentInfo.user.avatar" alt="">
      <span>{{commentInfo.user.uname}}</span>
    </div>
    <div class="info-detail">
      <p>{{commentInfo.content}}</p>
      <div class="info-other">
        <span class="data">{{commentInfo.created | showDate}}</span>
        <span>{{commentInfo.style}}</span>
      </div>
    </div>
    <div class="info-imgs">
      <img :src="item" v-for="(item,index) in commentInfo.images" :key="index" alt="">
    </div>
  </div>

</template>

<script>
  import { formatDate } from "common/utils";
  export default {
    name: "DetailCommentInfo",
    props:{
      commentInfo:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    filters:{
      showDate(value) {
        // 1.将时间戳转化为date对象
        const date = new Date(value * 1000)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        // 2.将date进行格式化
      }
    }
  }
</script>

<style scoped>
  .comment-info{
    border-bottom: 5px solid #f2f5f8;
    padding: 5px 12px;
    color: #333
  }
  .info-header{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(0,0,0,.1);
  }
  .header-title{
    float: left;
    font-size: 15px
  }
  .header-more {
    float: right;
    margin-right: 10px;
    font-size: 13px;
  }
  .info-user {
    padding: 10px 0 5px;
  }
  .info-user img{
    width: 42px;
    height: 42px;
    border-radius: 50%
  }
  .info-user span {
    position: relative;
    font-size: 15px;
    top: -15px;
    margin-left: 10px;
  }
  .info-detail{
    padding: 0 5px 15px;
  }
  .info-detail .info-other{
    font-size: 12px;
    color: #999
  }
  .info-detail p{
    font-size: 14px;
    color: #777;
    line-height: 1.5
  }
  .info-other span {
    margin-right: 8px;
  }
  .info-imgs img{
    margin-right: 6px;
    width: 70px;
    height: 70px
  }
  .info-imgs{
    margin-top: 10px
  }
</style>
