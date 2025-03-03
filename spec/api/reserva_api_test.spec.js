var mongoose = require("mongoose");
var Reserva = require("../../models/reserva");
var Usuario = require("../../models/usuarios");
var Bicicleta = require("../../models/bicicleta");
var request = require("request");
var server = require("../../bin/www");

var base_url="http://localhost:5000/api/reservas";

describe("Reserva API", () => {

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

    afterEach(async function() {
        try {
            await Reserva.deleteMany({});
            await Usuario.deleteMany({});
            await Bicicleta.deleteMany({});
            await mongoose.disconnect();
        } catch (error) {
            console.error("Error during afterEach cleanup:", error);
        }
    });

    describe("GET RESERVAS empieza vacia/", () => {
        it("Status 200", (done) => {
            request.get(base_url,function(error, response, body) {
                var result=JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.reservas.length).toBe(0);
                done();
            });
        });
    });
    //Actualizar por esta zona
});