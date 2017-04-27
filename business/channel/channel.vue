<template>
    <div class="p-channel" ref="wrapper">
        <TopNav></TopNav>
        <div class="list">
            <div class="item"
                v-for="item in list">
                <ResponsiveContainer>
                    <div class="img-wrapper">
                        <img :src="item.img">
                    </div>
                </ResponsiveContainer>
                <div class="img-title">{{item.text}}</div>
            </div>
        </div>
    </div>
</template>

<script>

    import ResponsiveContainer from 'components/responsive_container/responsive_container';
    import TopNav from 'components/top_nav/top_nav';
    import channels from 'mock/channels';
    import channelData from 'mock/channel_data';
    
    export default{
        name: 'Channel',

        data(){

            return {
                channels,
                navIndex: 0,
                channelData
            }
        },
        components: {
            TopNav,
            ResponsiveContainer
        },
        computed: {
            channelName(){

                return this.channels[this.navIndex].name;
            },
            list(){

                return this.channelData[this.channelName] || [];
            }
        },
        beforeRouteEnter(to, from, next){

            let name = to.params.name;

            next(vm => {

                vm.navIndex = vm.channels.findIndex(val => val.name === name);
            });
        },
        beforeRouteUpdate(to, from, next){

            let name = to.params.name;
            let vm = this;

            vm.navIndex = vm.channels.findIndex(val => val.name === name);

            next();
        },
        mounted(){

            $(document.body).on('swipeLeft', this.bodySwipeLeftHandler);
            $(document.body).on('swipeRight', this.bodySwipeRightHandler);
        },

        destroyed(){
            $(document.body).off('swipeLeft', this.bodySwipeLeftHandler);
            $(document.body).off('swipeRight', this.bodySwipeRightHandler);
        },
        
        methods:{
            bodySwipeLeftHandler(){

                this.next();
                    
            },
            bodySwipeRightHandler(){

                this.prev();   
            },
            prev(){
                this.navIndex--;

                if(this.navIndex < 0){

                    this.$router.push({
                        name: 'home'
                    });

                }else{

                    let name = this.channels[this.navIndex].name;

                    this.$router.push({
                        name: 'channel',
                        params: {
                            name: name
                        }
                    });
                }
            },
            next(){

                if(this.navIndex >= this.channels.length - 1){

                    return;

                }

                this.navIndex++;

                let name = this.channels[this.navIndex].name;

                this.$router.push({
                    name: 'channel',
                    params: {
                        name: name
                    }
                });
            }
        }
    }
</script>

<style lang="less">
    
    .p-channel{

        .list{
            display: flex;
            flex-wrap: wrap;
            padding: 5px 10px 0;

            .item{
                padding-right: 1px;
                width: 50%;
                box-sizing: border-box;

                &:nth-child(2n){
                    padding-left: 1px;
                    padding-right: 0;
                }
                

                .img-title{
                    height: 30px;
                    line-height: 30px;
                    padding-left: 5px;
                    color: #333;
                }
            }
        }
    }
</style>