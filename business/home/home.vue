<template>
    <div class="p-home">
        <TopNav></TopNav>

        <div class="slider-list">
            <ResponsiveContainer>
                <Slider :autoLoop="true" :interval="2000">
                    <SliderItem v-for="item in homeData['sliderList']">
                        <img :src="item.img">
                    </SliderItem>
                </Slider>
            </ResponsiveContainer>
        </div>
            

        <div class="detail-list">
            <div class="item"
                v-for="item in homeData['detailList']">

                <ResponsiveContainer>

                    <router-link :to="{name: 'detail', params: {id: item.id}}">
                        <img :src="item.img">
                    </router-link>
                </ResponsiveContainer>
            </div>
                
        </div>
        <div class="channel-list">
            <div class="item"
                v-for="item in homeData['channelList']">

                <ResponsiveContainer>

                    <router-link :to="{name: 'channel', params: {name: item.name}}">
                        <img :src="item.img">
                    </router-link>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
</template>

<script>

    import TopNav from 'components/top_nav/top_nav';
    import ResponsiveContainer from 'components/responsive_container/responsive_container';
    import Slider from 'components/slider/slider';
    import SliderItem from 'components/slider/slider_item';

    import homeData from 'mock/home';
    
    export default{
        name: 'Home',

        components: {
            TopNav,
            ResponsiveContainer,
            Slider,
            SliderItem
        },
        data(){

            return {
                homeData
            };
        }
    }
</script>

<style lang="less">
    
    .p-home{

        .slider-list{
            padding: 10px 10px 0;
        }

        .detail-list{
            padding: 20px 10px 0;

            display: flex;

            .item{
                width: 25%;
            }

            a{
                display: block;
            }
        }

        .channel-list{
            padding: 20px 10px 0;
            display: flex;

            .item{
                padding-right: 1px;
                width: 50%;
                box-sizing: border-box;

                &:nth-child(2n){
                    padding-left: 1px;
                    padding-right: 0;
                }
            }

            a{
                display: block;
            }
        }
    }
</style>