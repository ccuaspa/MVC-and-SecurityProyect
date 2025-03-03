var mongoose = require('mongoose');
var Bicicleta = require("../../models/bicicleta");
var Usuario = require("../../models/usuarios");
var Reserva = require("../../models/reserva");

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe("Testing Usuarios", function(){
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB);
        
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database! ');
            done();
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({})
        .then(function(err, success){
            if (err) console.log(err);
            Usuario.deleteMany({})
            .then(function(err, success){
                if (err) console.log(err);
                Bicicleta.deleteMany({})
                .then(function(err, success){
                    if (err) console.log(err);
                    mongoose.disconnect(err);
                    done();
                });
            });        
        });
    });  
    describe("usuarios empieza vacia", () => {
        it("comienza vacía", function(done) { 
            Bicicleta.allBicis()
            .then(bicis => {
                expect(bicis.length).toBe(0);
                done(); 
            })
            .catch(err => done.fail(err));
        });
    });

    describe("Cuando un Usuario reserva una bici", () => {
        it("debe existir la reserva", function(done){
            const usuario = new Usuario({code: 1, nombre: "Ezequiel"});
            usuario.save()
            .then(usuarioSaved =>{
                const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                bicicleta.save()
                .then(bicicletaSaved =>{
                    var hoy = new Date();
                    var mañana = new Date();
                    mañana.setDate(hoy.getDate()+1)
                    usuario.reservar(bicicleta.id, hoy, mañana)
                    const reservas = Reserva.find({})
                    .populate("bicicleta")
                    .populate("usuario")
                    .then(reservas => {
                        console.log(reservas[0]);
                        expect(reservas.length).toBe(1);
                        expect(reservas[0].diasDeReserva()).toBe(2);
                        expect(reservas[0].bicicleta.code).toBe(1);
                        expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                        done();
      
                    })
                })
            })
        });
    });
});
