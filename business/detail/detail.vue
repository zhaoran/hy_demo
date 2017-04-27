<template>
        <div class="p-detail">
            <div class="header">
                <a @click="back">返回</a>
                详情
                <span>分享</span>
            </div>
            <div class="content">
                详情-{{id}}
            </div>
        </div>
</template>

<script>
    

    export default{

        name: 'Detail',

        data(){

            return {
                id: ''
            };
        },

        mounted(){

            this.id = this.$route.params.id;
        },

        methods: {
            back(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less">
    
    .p-detail{
        width: 100%;
        min-height: 100%;
        background-color: #fff;

        .header{
            height: 50px;
            line-height: 50px;
            background-color: #31343f;
            text-align: center;
            color: #c7c9d2;

            a{
                float: left;
                width: 80px;
                height: 100%;
                color: #c7c9d2;
                text-decoration: none;
            }

            span{
                float: right;
                width: 80px;
                height: 100%;
                color: #c7c9d2;
            }
        }

        .content{
            text-align: center;
            padding-top: 200px;
        }
    }
</style>