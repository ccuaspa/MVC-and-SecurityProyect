var mongoose = require("mongoose");
var Usuario = require("../../models/usuarios");
var request = require("request");
var server = require("../../bin/www");

var base_url="http://localhost:5000/api/usuarios";

describe("Usuario API", () => {

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
        Usuario.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done())
        .catch((err) => {
            console.error(err);
            done.fail(err);
        });
    }); 

    describe("GET USUARIOS empieza vacia/", () => {
        it("Status 200", (done) => {
            request.get(base_url,function(error, response, body) {
                var result=JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.usuarios.length).toBe(0);
                done();
            });
        });
    });

    describe("POST USUARIOS /create", () => {
        it("STATUS 200", (done) => {
            var headers = {"content-type" : "application/json"};
            var usuario = '{ "nombre":"Ezequiel" }';
            request.post({
                headers: headers,
                url: "http://localhost:5000/api/usuarios/create",
                body: usuario
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var user = JSON.parse(body);
                console.log(user);
                expect(user.nombre).toBe("Ezequiel");
                done();
            });
        });
    });

    describe("Usuario.reservar", () => {
        it("Debe reservar", () => {
    
            var headers = {"content-type" : "application/json"};
            var usuario = '{ "nombre":"Ezequiel" }';
            
            request.post({
                headers: headers,
                url: "http://localhost:5000/api/usuarios/create",
                body: usuario
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var user = JSON.parse(body);
                console.log(user);
                expect(user.nombre).toBe("Ezequiel");
                var usuarioRes = JSON.parse(body);
                var usuarioId = usuarioRes._id;
                
                var bici = '{ "code":10, "color": "rojo", "modelo":"urbana", "lat": 4.61044, "lng": -74.08175 }';
                request.post({
                    headers: headers,
                    url: "http://localhost:5000/api/bicicletas/create",
                    body: bici
                }, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    var bici = JSON.parse(body);
                    console.log(bici);
                    expect(bici.code).toBe(10);
                    var bici = JSON.parse(body);
                    var biciId = bici._id;
                    
                    
                    var reserva = JSON.stringify({
                        id: usuarioId,
                        bici_id: biciId,
                        desde: "2018-12-01",
                        hasta: "2018-12-05",
                    });
                    request.post({
                        headers: headers,
                        url: "http://localhost:5000/api/usuarios/reservar",
                        body: reserva
                    }, function(error, response, body){
                        expect(response.statusCode).toBe(200);
                        var reservas = JSON.parse(body);
                        expect(reservas.usuarios.length).toBe(0);
                        done();               
                    });
                });
            });
        });
    });
});