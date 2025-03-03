var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");
var request = require("request");
var server = require("../../bin/www");

var base_url="http://localhost:5000/api/bicicletas";

describe("Bicicleta API", () => {

    beforeEach(function (done) {
        if (mongoose.connection.readyState !== 0) {
            mongoose.disconnect().then(() => connectToDatabase(done));
        } else {
            connectToDatabase(done);
        }
    });

    function connectToDatabase(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB);
        
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database! ');
            done();
        });
    }

    afterEach(function(done){
        Bicicleta.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done())
        .catch((err) => {
            console.error(err);
            done.fail(err);
        });
    }); 

    describe("GET BICICLETAS empieza vacia/", () => {
        it("Status 200", (done) => {
            request.get(base_url,function(error, response, body) {
                var result=JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe("POST BICICLETAS /create", () => {
        it("STATUS 200", (done) => {
            var headers = {"content-type" : "application/json"};
            var aBici = '{ "code":10, "color": "rojo", "modelo":"urbana", "lat": 4.61044, "lng": -74.08175 }';
            request.post({
                headers: headers,
                url: base_url+"/create",
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body);
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(4.61044);
                expect(bici.ubicacion[1]).toBe(-74.08175);
                done();
            });
        });
    });

    describe("POST BICICLETAS /update", () => {
        it("STATUS 200", (done) => {
            var headers = {"content-type" : "application/json"};
            var aBiciPrev = '{ "code":10, "color": "rojo", "modelo":"urbana", "lat": 4.61044, "lng": -74.08175 }';
            var aBiciPost = '{ "code":10, "color": "violeta", "modelo":"montaña", "lat": 4.41044, "lng": -74.10175 }';

            request.post({
                headers: headers,
                url: "http://localhost:5000/api/bicicletas/create",
                body: aBiciPrev
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body);
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(4.61044);
                expect(bici.ubicacion[1]).toBe(-74.08175);

                request.post({
                    headers: headers,
                    url: "http://localhost:5000/api/bicicletas/update",
                    body: aBiciPost
                }, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    var newBici = JSON.parse(body);
                    console.log(newBici);
                    expect(newBici.color).toBe("violeta");
                    expect(newBici.ubicacion[0]).toBe(4.41044);
                    expect(newBici.ubicacion[1]).toBe(-74.10175);
                    done();
                });
            });
        });
    });
    
    describe("POST BICICLETAS /delete", () => {
        it("STATUS 200", (done) => {
            var headers = {"content-type" : "application/json"};
            var aBici = '{ "code": 10, "color": "rojo", "modelo":"urbana", "lat": 4.61044, "lng": -74.08175 }';
            var deleteCode = '{"code": 10}';

            request.post({
                headers: headers,
                url: "http://localhost:5000/api/bicicletas/create",
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body);
                console.log(bici);
                expect(bici.color).toBe("rojo");

                request.post({
                    headers: headers,
                    url: "http://localhost:5000/api/bicicletas/delete",
                    body: deleteCode
                }, function(error, response, body){
                    expect(response.statusCode).toBe(204);
                    //expect(Bicicleta.findByCode(10)).toBeUndefined();
                    done();
                });
            });
        });
    });
});