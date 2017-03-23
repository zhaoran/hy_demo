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

    html,
    body {
        position: relative;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
    html{
        font-size: 62.5%;
    }
    body {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
        margin: 0;
        padding: 0;
        color: #000;
        font-size: 1.4rem;
        line-height: 1.4;
        width: 100%;
        -webkit-text-size-adjust: 100%;
        overflow: hidden;
    }
    * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        margin: 0;
        padding: 0;
    }
    a,
    input,
    textarea,
    select {
        outline: 0;
    }
    a {
        text-decoration: none;
        color: #007aff;
    }

    .p-business {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>