var express = require('express');
var router = express.Router();
var query = require('dao/dbPool');

// list reminders
router.all('/list', function (req, res, next) {
    var out = Out(req, res, 'index');
    query('select `id`,`data`,`status`,`target`,`create` from reminders where uid = ?'
        , 0, function (err, vals) {
            if (err) {
                out.echo({state: 'err', detail: err});
            } else {
                var obj = {};
                for (var i = 0, l = vals.length; i < l; i++) {
                    if (vals[i]) {
                        try{
                            vals[i].data=JSON.parse(vals[i].data);
                        }catch (e){}
                        obj[vals[i].id || i] = vals[i];
                    }
                }
                out.echo({state: 'ok', detail: 'list reminder success', reminders:vals});

            }
        });
});


function Out(req, res, defaultView) {
    return {
        _req: req,
        _res: res,
        _view: defaultView,
        echo: function (obj, view) {
            if (this._req.is('json')) {
                this._res.jsonp(obj);
            } else {
                this._res.render(view || this._view, obj);
            }
        }
    }
}

// All reminders listening
router.all('/', function (req, res, next) {
    res.redirect('list');
});

// add new reminders
router.route('/add')
    .get(function (req, res, next) {
        res.render('edit');
    })
    .post(function (req, res, next) {
        var out = Out(req, res, 'index');
        if (req.body.data && req.body.data.trim().length > 2) {
            var tD = new Date();
            tD.setHours(4);
            tD.setMinutes(0);
            tD.setSeconds(0);
            var values = [
                req.session.userinfo.id,
                req.body.data.trim(),
                tD.getTime(),
                1000 * 60 * 60 * 24,
                'action',
                new Date().getTime()
            ];
            query('insert into reminders (`uid`,`data`,`target`,`interval`,`status`,`create`) values(?,?,?,?,?,?)'
                , values, function (err, vals) {
                    if (err) {
                        out.echo({state: 'err', detail: err});
                    } else {
                        out.echo({state: 'ok', detail: 'create reminder success'});
                    }
                });
        } else {
            out.echo({state: 'err', detail: 'Invaild Param Data'});
        }
    });


// // list reminders
// router.all('/list', function (req, res, next) {
//     var out = Out(req, res, 'index');
//     query('select `id`,`data`,`status`,`target`,`create` from reminders where uid = ?'
//         , [req.session.userinfo.id], function (err, vals) {
//             if (err) {
//                 out.echo({state: 'err', detail: err});
//             } else {
//                 var obj = {};
//                 for (var i = 0, l = vals.length; i < l; i++) {
//                     if (vals[i]) {
//                         obj[vals[i].id || i] = vals[i];
//                     }
//                 }
//                 out.echo({state: 'ok', detail: 'list reminder success', reminders:vals});
//
//             }
//         });
// });

module.exports = router;
