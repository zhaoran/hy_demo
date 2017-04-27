<template>
    <div id="app" class="p-business">
        <transition :name="transitionName" :mode="transitionMode">
            <router-view class="view"></router-view>
        </transition>
    </div>
</template>

<script>

    const TRANSITION_HASH = {
        'home:detail': 'slide-left',
        'detail:home': 'slide-right'
    };

    const NO_TRANSITION_NAME = 'nothing';

    export default{

        data(){
            return {
                transitionName: '',
                transitionMode: ''
            };
        },

        watch: {
            '$route'(to, from){
                // debugger
                let fromName = from.name;
                let toName = to.name;

                this.transitionName = TRANSITION_HASH[`${fromName}:${toName}`] || NO_TRANSITION_NAME;

            }
        }
    }
</script>

<style lang="less">

    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }

    body {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
        font-size: 12px;
    }

    html * {
        outline: 0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .p-business {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #fff;

        img{
            width: 100%;
            height: 100%;
        }
    }

    .slide-left-enter{
        transform: translate(100%, 0);
    }

    .slide-left-enter-active{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        transition: transform .5s ease;
    }
    .slide-left-leave{

    }
    .slide-left-leave-active {
        transition: transform .5s ease;
        transform: translate(-30%, 0);
    }


    .slide-right-enter{
        transform: translate(-30%, 0);
    }

    .slide-right-enter-active{
        transition: all .5s ease;
    }
    .slide-right-leave{

    }
    .slide-right-leave-active{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        transition: transform .5s ease;
        transform: translate(100%, 0);
    }

    .nothing-enter{
    }

    .nothing-enter-active{
    }
    .nothing-leave{

    }
    .nothing-leave-active{
        display: none;
    }



</style>