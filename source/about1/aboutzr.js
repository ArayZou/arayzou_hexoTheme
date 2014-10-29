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
        //填充空背景格,写入有效格坐标
        var gridXY = [];
        var gridNum = 0;
        for(var j=0;j<(bodyHeight+1);j++){
            for(var i=0;i<(bodyWidth+1);i++){
                $gridBody.append('<b class="grid" id="g_'+i+'_'+j+'"></b>');
                if(i!=bodyWidth&&j!=bodyHeight){
                    gridXY[gridNum] = i+'.'+j;
                    gridNum++
                }
            }
        }
        //随机对有效坐标排序
        var gridXYran=gridXY.sort(function(a,b){return Math.random()>=0.5?-1:1;});

        var $gridU = $('.grid_u');
        //定位所有内容格
        for (var u = 0;u < $gridU.length;u++){
            var uID = '#g_'+String(gridXYran[u]).split('.')[0]+'_'+String(gridXYran[u]).split('.')[1];
            $gridU.eq(u).css({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            })
        }

        var Done = new Date();
        console.log('fillInt function cost Time: '+(Done-Begin)+'ms');
    }
});