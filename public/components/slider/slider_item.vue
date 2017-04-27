<template>
    <div class="c-slider-item">
        <slot></slot>
    </div>
</template>

<script>
    
    export default{
        name: 'SliderItem'
    }
</script>

<style lang="less">

    .c-slider-item{
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
