var mongodb = require('./db');
function Message(name, email, website, content) {
  this.name = name;
  this.email = email;
  this.website = website;
  this.content = content;
}
module.exports = Message;

Message.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }


  var message = {
      name: this.name,
      time:time,
      email: this.email,
      website:this.website,
      content: this.content,
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('message', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(message, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null);//返回 err 为 null
      });
    });
  });
};
Message.getAll = function(name,callback){
  mongodb.open(function (err,db){
    if(err){
      return callback(err);
    }
    db.collection('message',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if(name){
        query.name=name;
      }
      collection.find(query).toArray(function(err,docs){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null,docs);
      });
    });
  });
}
