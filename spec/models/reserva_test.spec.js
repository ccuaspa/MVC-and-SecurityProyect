var mongoose = require('mongoose');
var Bicicleta = require("../../models/bicicleta");
var Usuario = require("../../models/usuarios");
var Reserva = require("../../models/reserva");

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe("Testing Reservas", function(){
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
            mongoose.disconnect(err);
            done();
        });
    });  

    describe("Reservas empieza vacia", () => {
        it("comienza vacía", function(done) { // Asegúrate de incluir `done` como parámetro
            Reserva.allReservas()
            .then(reservas => {
                expect(reservas.length).toBe(0);
                done(); // Llama a `done` después de la aserción
            })
            .catch(err => done.fail(err));
        });
    });

    describe("Reserva.findById", () => {
        it("Debe devolver la reserva con el id del usuario", async () => {
            try {
                // Crear usuario y bicicleta
                const usuario = new Usuario({ code: 1, nombre: "Ezequiel" });
                const bicicleta = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
    
                await usuario.save();
                await bicicleta.save();
    
                // Crear reserva
                const hoy = new Date();
                const mañana = new Date();
                mañana.setDate(hoy.getDate() + 1);
                await usuario.reservar(bicicleta.id, hoy, mañana);
    
                // Buscar reservas y verificar resultados
                const reservas = await Reserva.find({})
                    .populate("bicicleta")
                    .populate("usuario");
    
                expect(reservas.length).toBe(1); // Confirmar que hay una reserva
                expect(reservas[0].bicicleta.code).toBe(1);
                expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
    
                // Buscar reserva por ID
                const reservaPorId = await Reserva.findById(reservas[0]._id)
                    .populate("bicicleta")
                    .populate("usuario");
    
                expect(reservaPorId.bicicleta.code).toBe(1);
                expect(reservaPorId.usuario.nombre).toBe(usuario.nombre);
            } catch (error) {
                fail(error); // Informar errores a Jasmine
            }
        });
    });

    describe("Reserva.removeByCode", () => {
        it("Debe terminar vacía", async () => {
            try {
                // Crear usuario y bicicleta
                const usuario = new Usuario({ code: 1, nombre: "Ezequiel" });
                const bicicleta = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
    
                await usuario.save();
                await bicicleta.save();
    
                // Crear reserva
                const hoy = new Date();
                const mañana = new Date();
                mañana.setDate(hoy.getDate() + 1);
                await usuario.reservar(bicicleta.id, hoy, mañana);
    
                // Buscar reservas y verificar su existencia
                const reservas = await Reserva.find({})
                    .populate("bicicleta")
                    .populate("usuario");
    
                expect(reservas.length).toBe(1); // Confirmar que hay una reserva
                expect(reservas[0].bicicleta.code).toBe(1);
                expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
    
                // Eliminar la reserva por su ID
                await Reserva.removeById(reservas[0]._id);
    
                // Verificar que no haya reservas
                const reservasDespues = await Reserva.allReservas();
                expect(reservasDespues.length).toBe(0);
            } catch (error) {
                fail(error); // Informar cualquier error en Jasmine
            }
        });
    });
    
    
    /*
    describe("Reserva.findById", () => {
        it(`Debe devolver la reserva con el id del usuario`, function(done) {
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
                    const reservas = Reserva.find({}).exec()
                    .populate("bicicleta")
                    .populate("usuario")
                    .then(reservas => {
                        Reserva.findById(reservas[0]._id)

                        .then((reservas)=>{
                            expect(reservas[0].bicicleta.code).toBe(1);
                            expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                            done();
                        })
                    })
                })
            })
        });
    });

    describe("Reserva.removeByCode", () => {
        it("Debe terminar vacia", function(done) {
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
                        expect(reservas[0].bicicleta.code).toBe(1);
                        expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                        Reserva.removeById(reservas[0]._id)
                        .then(()=>{
                            Reserva.allReservas()
                            .then(reservas => {
                                expect(reservas.length).toBe(0);
                                done(); // Llama a `done` después de la aserción
                            })
                        })

                    })
                })
            })
        });
    });
    */
})
