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
                v-if="sliderCount > 1"
                v-for="index in sliderCount" 
                :class="{
                    active: index === activeIndex + 1
                }">
            </span>
        </div>
    </div>
</template>

<script>

    const SLIDER_TRANSITION_CLASS_NAME = 'slider-transition';
    
    export default{

        name: 'Slider',

        props:{
            autoLoop: {
                type: Boolean,
                default: false
            },
            interval: {
                type: Number,
                default: 3000
            }
        },

        data(){

            return {
                activeIndex: 0, // 当前active位置
                activeTranslateIndex: 1, // 添加首尾克隆元素后实际的位置
                sliderCount: 0,
                autoTimeHandler: 0, // 自动轮播定时器
                elContainer: null,
                inTouchStage: false, // 触碰后暂停自动轮播
                touchPauseInerval: 3000, // 触碰后暂停自动轮播的间隔
                pauseTimehandler: 0, // 暂停自动轮播定时器
                inTransitionStage: false // 过渡效果中屏蔽其他操作
            };
        },

        computed: {
            styleTranslate(){
                let x = (- this.activeTranslateIndex * 100) + '%';

                return `translate3d(${x}, 0, 0)`;
            }
        },

        mounted(){
            

            this.sliderCount = this.$children.length;
            let elContainer = this.elContainer = this.$refs.container;

            if(this.sliderCount > 1){

                $(this.$refs.slider).on({
                    touchstart: this.sliderTouchStartHandler,
                    swipeLeft: this.swipeLeftHandler,
                    swipeRight: this.swipeRightHandler
                });

                let clonedFirst = elContainer.firstElementChild.cloneNode(true);
                let clonedLast = elContainer.lastElementChild.cloneNode(true);

                elContainer.insertAdjacentElement('beforeend', clonedFirst);
                elContainer.insertAdjacentElement('afterbegin', clonedLast);

                elContainer.addEventListener('transitionend', this.containerTransitionEnd);

                if(this.autoLoop){

                    this.auto();
                }
            }

        },

        destroyed(){

            let elContainer = this.elContainer

            if(this.sliderCount > 1){

                $(this.$refs.slider).off({
                    touchstart: this.sliderTouchStartHandler,
                    swipeLeft: this.swipeLeftHandler,
                    swipeRight: this.swipeRightHandler
                });

                elContainer.removeEventListener('transitionend', this.containerTransitionEnd);

                // 切换路由时会触发，导致dom变动
                // elContainer.removeChild(elContainer.firstElementChild);
                // elContainer.removeChild(elContainer.lastElementChild);

                clearTimeout(this.autoTimeHandler);
                clearTimeout(this.pauseTimehandler);
            }

        },

        methods: {
            containerTransitionEnd(){

                this.elContainer.classList.remove(SLIDER_TRANSITION_CLASS_NAME);

                this.inTransitionStage = false;

                // 过渡效果完成后再计时下一次自动轮播
                if(!this.inTouchStage
                    && this.autoLoop){

                    this.auto();
                }
                
            },
            // 触碰后暂停自动轮播
            sliderTouchStartHandler(){

                clearTimeout(this.autoTimeHandler);
                clearTimeout(this.pauseTimehandler);

                this.inTouchStage = true;

                this.pauseTimehandler = setTimeout(() => {

                    this.inTouchStage = false;

                    if(this.autoLoop){

                        this.next();
                    }

                }, this.touchPauseInerval);

            },
            swipeLeftHandler(){
                this.next();
            },
            swipeRightHandler(){
                this.prev();
            },
            auto(){

                this.autoTimeHandler = setTimeout(() => {

                    this.next();


                }, this.interval);
            },
            prev(){

                if(this.inTransitionStage){
                    return;
                }

                if(this.activeIndex <= 0){

                    this.activeIndex = this.sliderCount - 1;

                }else{

                    this.activeIndex--;
                }

                if(this.activeTranslateIndex <= 1){

                    this.activeTranslateIndex = this.sliderCount + 1;

                }

                setTimeout(() => {
                    this.$refs.container.classList.add(SLIDER_TRANSITION_CLASS_NAME);
                    this.inTransitionStage = true;
                    this.activeTranslateIndex--;
                }, 30);

                
            },
            next(){

                if(this.inTransitionStage){
                    return;
                }

                if(this.activeIndex >= this.sliderCount - 1){

                    this.activeIndex = 0;

                }else{

                    this.activeIndex++;
                }

                if(this.activeTranslateIndex >= this.sliderCount){

                    this.activeTranslateIndex = 0
                }

                setTimeout(() => {
                    this.$refs.container.classList.add(SLIDER_TRANSITION_CLASS_NAME);
                    this.inTransitionStage = true;
                    this.activeTranslateIndex++;
                }, 30);
            }
        }
    }

</script>

<style lang="less">
    
    .c-slider{

        position: relative;
        overflow-x: hidden;
        width: 100%;
        height: 100%;

        .slider-container{
            height: 100%;
            display: flex;
        }

        .slider-transition{
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

