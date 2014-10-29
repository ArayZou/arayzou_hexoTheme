$(function(){
    var $gridBody = $('.grid_body');
    var $gridU = $('.grid_u');
    //有效格坐标数组
    var gridXY = [];

    //执行填充方块
    fillInt();

    //填充方块方法
    function fillInt(){
        var Begin = new Date();
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
        var gridNum = 0;
        $gridBody.find('.grid').remove();
        gridXY = [];
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

        //定位所有内容格
        for (var u = 0;u < $gridU.length;u++){
            var uID = '#g_'+String(gridXYran[u]).split('.')[0]+'_'+String(gridXYran[u]).split('.')[1];
            $gridU.eq(u).find('.grid_a').css({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            }).show();
            $gridU.eq(u).attr('data-p',gridXYran[u])
        }

        var Done = new Date();
        console.log('fillInt function cost Time: '+(Done-Begin)+'ms');
    }

    //内容格向周围散开的展现方式定位
    $gridU.find('.grid_1').click(function(){
        //找内容格周围可用单元格的坐标，这个没想到什么好方法。。。
        //先按上左右下，上左，上右，下左，下右，上上，左左，右右，下下找12个，然后排除无用格
        var $this = $(this);
        var thisP = $this.parent().attr('data-p');
        $this.parent().siblings('.grid_u').hide();
        var thisPX = parseInt(String(thisP).split('.')[0]);
        var thisPY = parseInt(String(thisP).split('.')[1]);
        //周围可以用单元格数组，JS小数加减有问题，只好用这种方法
        var thisPX_L1 = thisPX-1;
        var thisPX_L2 = thisPX-2;
        var thisPX_R1 = thisPX+1;
        var thisPX_R2 = thisPX+2;
        var thisPY_T1 = thisPY-1;
        var thisPY_T2 = thisPY-2;
        var thisPY_B1 = thisPY+1;
        var thisPY_B2 = thisPY+2;
        var gridAroundXY = [];
        gridAroundXY.push(thisPX+'.'+thisPY_T1);
        gridAroundXY.push(thisPX_L1+'.'+thisPY);
        gridAroundXY.push(thisPX_R1+'.'+thisPY);
        gridAroundXY.push(thisPX+'.'+thisPY_B1);
        gridAroundXY.push(thisPX_L1+'.'+thisPY_T1);
        gridAroundXY.push(thisPX_R1+'.'+thisPY_T1);
        gridAroundXY.push(thisPX_L1+'.'+thisPY_B1);
        gridAroundXY.push(thisPX_R1+'.'+thisPY_B1);
        gridAroundXY.push(thisPX+'.'+thisPY_T2);
        gridAroundXY.push(thisPX_L2+'.'+thisPY);
        gridAroundXY.push(thisPX_R2+'.'+thisPY);
        gridAroundXY.push(thisPX+'.'+thisPY_B2);
        //排除周围的无用格坐标，两数组求相同元素，要判断上千次，醉了，有更好的方法么
        var thisGridUse = [];
        for(var garo = 0;garo<gridAroundXY.length;garo++){
            for(var gall = 0;gall<gridXY.length;gall++){
                if(gridAroundXY[garo]==gridXY[gall]){
                    thisGridUse.push(gridAroundXY[garo]);
                    continue;
                }
            }
        }
        //定位展开格
        for(var gb=0;gb<$this.siblings('.grid_b').length;gb++){
            var uID = '#g_'+String(thisGridUse[gb]).split('.')[0]+'_'+String(thisGridUse[gb]).split('.')[1];
            console.log(uID);
            $this.siblings('.grid_b').eq(gb).css({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            });
        }

    });

    //resize后重新加载
    $(window).resize(function(){
        fillInt();
    })  
});