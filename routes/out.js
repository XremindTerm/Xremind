function Out(req,res,defaultView,defaultViewOpt){
    return {
        _req:req,
        _res:res,
        _view:defaultView,
        _opt:defaultViewOpt||{},//渲染所需的默认参数，参数可被echo中的obj中覆盖
        echo:function(obj,view){
            if(this._req.is('json')){
                this._res.jsonp(obj);
            }else{
                this._opt.json=obj;
                this._res.render(view||this._view,this._opt);
            }
        }
    }
}

module.exports=Out;