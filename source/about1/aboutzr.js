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

        $gridU.show().find('.grid_b').hide();

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
            $gridU.eq(u).attr('data-p',gridXYran[u]);
        }

        var Done = new Date();
        console.log('fillInt function cost Time: '+(Done-Begin)+'ms');
    }
    
    //移动或点击内容格
    var $moveGrid = '',
        moveGridLeft = 0,
        moveGridTop = 0;
    var ifMove = false,
        ifGridCanMove = true;
    var downClientX = 0,
        downClientY = 0;
    $(document).mousedown(function (e){
        e.preventDefault();
        e.stopPropagation();
        if($(e.target).hasClass('grid_1')){
            $moveGrid = $(e.target);
            // 鼠标点击位置和当前格的坐标差
            ifGridCanMove = $moveGrid.parent().hasClass('clicked')?false:true;

            moveGridLeft = e.offsetX,
            moveGridTop = e.offsetY;

            downClientX = e.clientX,
            downClientY = e.clientY;
        }
    }).mousemove(function (e){
        e.preventDefault();
        e.stopPropagation();
        if($moveGrid&&ifGridCanMove){
            //左右移动超过5像素再计算移动
            if(Math.abs(e.clientX-downClientX)>5&&Math.abs(e.clientY-downClientY)>5){
                $moveGrid.siblings('.grid_b').hide();
                ifMove = true;
                $moveGrid.css({
                    left:e.clientX-moveGridLeft,
                    top:e.clientY-moveGridTop,
                    zIndex:999
                }).siblings('.grid_b').css({
                    left:e.clientX-moveGridLeft,
                    top:e.clientY-moveGridTop
                });
            }
        }
    }).mouseup(function (e){
        e.preventDefault();
        e.stopPropagation();
        //没有做移动，打开展开格
        if($moveGrid&&!ifMove){
            //内容格向周围散开的展现方式定位
            $moveGrid.siblings('.grid_b').show();
            var $this = $moveGrid;
            var thisP = $this.parent().attr('data-p');
            var thisPX = parseInt(String(thisP).split('.')[0]);
            var thisPY = parseInt(String(thisP).split('.')[1]);
            if($this.parent().hasClass('clicked')){
                $this.parent().removeClass('clicked');
                $this.siblings('.grid_b').css({
                    left:$this.offset().left,
                    top:$this.offset().top
                });
                $this.parent().siblings('.grid_u').show();
            }else{
                //找内容格周围可用单元格的坐标，这个没想到什么好方法。。。
                //先按上左右下，上左，上右，下左，下右，上上，左左，右右，下下找12个，然后排除无用格
                $this.parent().addClass('clicked');
                $this.parent().siblings('.grid_u').hide();
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
                    $this.siblings('.grid_b').eq(gb).css({
                        left:$(uID).offset().left,
                        top:$(uID).offset().top
                    });
                }
            }
            //清空对象
            $moveGrid = '';
        }
        //做了移动，直接移动内容格
        else if(ifMove){
            //获取鼠标松开时内容格中心点的坐标，并判断此坐标所在的背景格是否为有效格，若是直接定位到它上面，若不是则在它周围寻找有效格,无效格只会在右下，所以只要向左便宜一格或者向上偏移一格就可以
            var uIDX = ($moveGrid.offset().left+50)/101>>0,
                uIDY = ($moveGrid.offset().top+50)/101>>0;
            var uGridXY = uIDX+'.'+uIDY,
                ifGridXYuse = false;
            for(var gall = 0;gall<gridXY.length;gall++){
                if(uGridXY==gridXY[gall]){
                    ifGridXYuse = true;
                    continue;
                }
            }
            //如果不是有效格
            if(!ifGridXYuse){
                //判断左侧是否为有效格
                var uIDleft = (uIDX-1)+'.'+(uIDY);
                for(var gallr = 0;gallr<gridXY.length;gallr++){
                    if(uIDleft==gridXY[gallr]){
                        //右侧是有效格
                        uIDleft = false;
                        continue;
                    }
                }
                //判断上方是否为有效格
                var uIDtop = (uIDX)+'.'+(uIDY-1);
                for(var gallb = 0;gallb<gridXY.length;gallb++){
                    if(uIDtop==gridXY[gallb]){
                        //下方是有效格
                        uIDtop = false;
                        continue;
                    }
                }
                if(!uIDleft&&uIDtop){       
                    //右边，左侧有效上方无效
                    uIDX = uIDX-1;
                    uIDY = uIDY;
                    uGridXY = uIDX+'.'+uIDY;
                }else if(uIDleft&&!uIDtop){
                    //下边，左侧无效，上方无效
                    uIDX = uIDX;
                    uIDY = uIDY-1;
                    uGridXY = uIDX+'.'+uIDY;
                }else if(uIDleft&&uIDtop){
                    //右下角，左侧无效，上方无效
                    uIDX = uIDX-1;
                    uIDY = uIDY-1;
                    uGridXY = uIDX+'.'+uIDY;
                }
            }else{
                //如果是有效格，再判断当前有效格有没有存在内容格,如果已经有内容格了，返回原位
                for(var ug=0;ug<$moveGrid.parent().siblings('.grid_u').length;ug++){
                    if(uGridXY==$moveGrid.parent().siblings('.grid_u').eq(ug).attr('data-p')){
                        var uID = '#g_'+String($moveGrid.parent().attr('data-p')).split('.')[0]+'_'+String($moveGrid.parent().attr('data-p')).split('.')[1];
                        $moveGrid.animate({
                            left:$(uID).offset().left,
                            top:$(uID).offset().top
                        },300).css({
                            zIndex:10
                        }).siblings('.grid_b').animate({
                            left:$(uID).offset().left,
                            top:$(uID).offset().top
                        },function(){
                            $(this).show();
                        });
                        //清空对象
                        $moveGrid = '';
                        ifMove = false;
                        return false;
                    }
                }
            }

            var uID = '#g_'+ uIDX +'_'+ uIDY;
            $moveGrid.parent().attr('data-p',uGridXY);
            $moveGrid.animate({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            },100).css({
                zIndex:10
            }).siblings('.grid_b').animate({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            },100,function(){
                $(this).show();
            });
            //清空对象
            $moveGrid = '';
            ifMove = false;
        }
    });

    //resize后重新加载
    $(window).resize(function(){
        fillInt();
    })  
});