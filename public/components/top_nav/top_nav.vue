<template>
    <div class="c-top-nav">
        <div class="nav"><router-link :to="{name: 'home'}" exact>全部</router-link></div>
        <div class="nav"
            v-for="channel in channels">
            <router-link :to="{name: 'channel', params: {name: channel.name}}">{{channel.text}}</router-link>
        </div>
    </div>
</template>

<script>
    
    import channels from 'mock/channels';

    export default{
        name: 'TopNav',

        data(){

            return {
                channels
            };
        }
    }
</script>

<style lang="less">
    
    .c-top-nav{
        padding: 10px 20px 0;
        display: flex;
        height: 30px;
        line-height: 30px;

        .nav{
            flex: 1;
            text-align: center;

            a{
                display: inline-block;
                color: #333;
                box-sizing: border-box;
                height: 100%;
                text-decoration: none;

                &.router-link-active{
                    color: #e49e64;
                    border-bottom: 3px solid #e49e64; 
                }
            }
        }

                    
    }
</style>