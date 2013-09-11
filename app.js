
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , request = require('request')
  , Catalogr = require('./catalogr.js').Catalogr;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var catalogr = new Catalogr('localhost', 27017);

app.get('/', function(req,res){
	catalogr.findAll(function(error, catas){
		res.render('index',{title:"Catalogr", catalogs: catas});
	});
});

app.post('/save', function(req,res){
	console.log('body: ' + JSON.stringify(req.body));
	catalogr.save({
		title: req.body.title,
		url: req.body.url,
		favorite: false
	},function(error, docs){
                if(error)
		   console.log("error in save: "+ docs);
                   req.body._id = docs[0]._id;
        });
	res.send(req.body);
});

app.post('/mark', function(req,res){
	console.log("id: "+req.body.id);
	catalogr.findAll(function(error, results){
		console.log("length:"+results.length);
		if(results.length>0)
			for(var index in results){
				console.log(results[index]);
				results[index].favorite = false;
				catalogr.update(results[index]._id.toString(),results[index], function(error, docs){
                        		if(error)
                        		console.log("Error");
                		})
			}
	});
	catalogr.findById(req.body.id, function(error, result){
		result.favorite = true;
        	catalogr.update(req.body.id,result, function(error, docs){
                	if(error)
                	console.log("Error");
        	})
	});
	res.send("success");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
