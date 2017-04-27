<template>
    <div class="c-slider" ref="slider">
        <div class="slider-container" ref="container"
            :style="{
                transform: styleTranslate
            }">
            <slot></slot>
        </div>
        <div class="indicator-container">
            <span class="indicator"
                v-for="index in sliderCount" 
                :class="{
                    active: index === activeIndex + 1
                }"></span>
        </div>
    </div>
</template>

<script>
    
    export default{

        name: 'Slider',

        props:{

        },

        data(){

            return {
                activeIndex: 0,
                sliderCount: 0
            };
        },

        computed: {
            styleTranslate(){
                let x = (- this.activeIndex * 100) + '%';

                return `translate3d(${x}, 0, 0)`;
            }
        },

        mounted(){
            
            $(this.$refs.slider).on('swipeLeft', this.swipeLeftHandler);
            $(this.$refs.slider).on('swipeRight', this.swipeRightHandler);

            this.sliderCount = this.$children.length;
        },

        destroyed(){
            $(this.$refs.slider).off('swipeLeft', this.swipeLeftHandler);
            $(this.$refs.slider).off('swipeRight', this.swipeRightHandler);
        },

        methods: {
            swipeLeftHandler(){
                this.next();
            },
            swipeRightHandler(){
                this.prev();
            },
            prev(){

                if(this.activeIndex <= 0){

                    return;
                }else{

                    this.activeIndex--;
                }
            },
            next(){

                if(this.activeIndex >= this.sliderCount - 1){

                    return;
                }else{

                    this.activeIndex++;
                }
            }
        }
    }

</script>

<style lang="less">
    
    .c-slider{

        position: relative;
        overflow-x: hidden;

        .slider-container{
            height: 100%;
            display: flex;
            transition: transform .5s ease-in-out;
        }

        .indicator-container{
            position: absolute;
            left: 0;
            bottom: 6px;
            width: 100%;
            text-align: center;

            .indicator{
                margin: 0 5px;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 8px;
                background-color: #fff;

                &.active{
                    background-color: #000;
                }
            }
        }

    }
</style>

