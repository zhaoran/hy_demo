<template>
    <div class="c-responsive-container" ref="container">
        <div class="inner" ref="inner">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    
    export default{

        name: 'ResponsiveContainer',

        props:{
            ratio: {
                type: String,
                default: '2:1'
            }
        },

        mounted(){

            let [width, height] = this.ratio.split(':');

            let percent = height / width;

            if(!isNaN(percent)){

                this.$refs.container.style.paddingBottom = percent * 100 + '%';
            }

            
        }
    }
</script>

<style lang="less">
    
    .c-responsive-container{
        position: relative;
        width: 100%;

        .inner{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
</style>