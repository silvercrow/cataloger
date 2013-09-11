var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Catalogr = function(host,port){
	this.db = new Db('node-mongo-catalogr', new Server(host,port,{safe:false},{auto_reconnect:true},{}));
	this.db.open(function(){});
};

Catalogr.prototype.getCollection = function(callback){
	this.db.collection('catalogs', function(error, catalogr_collection){
		if(error) callback(error);
		else callback(null, catalogr_collection);
	});
};

Catalogr.prototype.findAll = function(callback){
	this.getCollection(function(error, catalogr_collection){
		if(error) callback(error)
		else{
			catalogr_collection.find().toArray(function(error, results){
				if(error) callback(error)
				else callback(null, results)
			});
		}
	});
};

Catalogr.prototype.save = function(catalogs, callback){
	this.getCollection(function(error, catalogr_collection){
		if(error) callback(error)
		else{
			if(typeof(catalogs.length)=="undefined")
			catalogs = [catalogs];
			for(var i=0;i<catalogs.length;i++){
				catalog = catalogs[i];
			}
			catalogr_collection.insert(catalogs, function(){
				callback(null,catalogs);
			});
		}
	});
};

Catalogr.prototype.update = function(catalogId, catalogs, callback){
	this.getCollection(function(error, catalogr_collection){
		if(error) callback(error);
		else{
			catalogr_collection.update(
			{_id: catalogr_collection.db.bson_serializer.ObjectID.createFromHexString(catalogId)},
			catalogs,
			function(error, catalogs){
				if(error) callback(error);
				else callback(null, catalogs)
			});
		}
	});
}

Catalogr.prototype.findById = function(catalogId, callback){
	this.getCollection(function(error, catalogr_collection){
		if(error) callback(error);
		else
			catalogr_collection.findOne({_id:catalogr_collection.db.bson_serializer.ObjectID.createFromHexString(catalogId)}, function(error,result){
				if(error) callback(error);
                        	else{
					callback(null, result);
				}
			});
	})
}

exports.Catalogr = Catalogr;
