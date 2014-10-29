$(function(){
    fillInt();
    //填充方块
    function fillInt(){
        var Begin = new Date();
        var $gridBody = $('.grid_body');
        var gridSize = 101;
        //计算宽高各需要多少个格子，先向下取整，然后计算高度要+1
        var bodyWidth = $(window).width()/gridSize>>0;
        var bodyHeight = $(window).height()/gridSize>>0;
        //设置大容器宽高
        $gridBody.css({
            width:(bodyWidth+1)*gridSize,
            height:(bodyHeight+1)*gridSize
        });
        //填充空背景格
        for(var j=0;j<(bodyHeight+1);j++){
            for(var i=0;i<(bodyWidth+1);i++){
                $gridBody.append('<b class="grid" id="g_'+(i+1)+'_'+(j+1)+'"></b>');
            }
        }

        var Done = new Date();
        console.log('fillInt function cost Time: '+(Done-Begin)+'ms');
    }
});