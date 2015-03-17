/**
 * Created by r_zou on 2015/3/17.
 */
var StartLaryer = cc.Layer.extend({
    ctor:function(){
        this._super();
        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF('Hello World','',38);
        helloLabel.x = size.width/2;
        helloLabel.y = size.height / 2;
        this.addChild(helloLabel);

        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new StartLaryer();
        this.addChild(layer);
    }
})

