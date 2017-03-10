<template>
    <div id="app" class="p-business">
        <router-view></router-view>
    </div>
</template>

<script>

    export default{

        data(){
            return {
            };
        }
    }
</script>

<style type="less">

    ::-webkit-scrollbar{
        width: 0;
        height: 0;
    }

    html,body{
        /*height: 100%;*/
    }

    body{
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
        margin: 0;
        padding: 0;
    }

</style>