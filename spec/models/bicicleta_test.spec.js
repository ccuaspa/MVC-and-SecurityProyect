var mongoose = require('mongoose');
var Bicicleta = require("../../models/bicicleta");

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe("Testing Bicicletas", function(){
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
        Bicicleta.deleteMany({})
        .then(function(err, success){
            if (err) console.log(err);
            mongoose.disconnect(err);
            done();
        });
    });  

    describe("Bicicleta.createInstance", () => {
        it("crea una instancia de Bicicleta", () => {
            var bici = Bicicleta.createInstance(1, 'rojo', 'urbana', [4.61044, -74.08175]);
    
            expect(bici.code).toBe(1);
            expect(bici.color).toBe('rojo');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toEqual(4.61044);
            expect(bici.ubicacion[1]).toEqual(-74.08175);
        })
    });

    describe("Bicicleta.allBicis", () => {
        it("comienza vacía", function(done) { // Asegúrate de incluir `done` como parámetro
            Bicicleta.allBicis()
            .then(bicis => {
                expect(bicis.length).toBe(0);
                done(); // Llama a `done` después de la aserción
            })
            .catch(err => done.fail(err));
        });
    });
    describe("Bicicleta.add", () => {
        it("Agrega solo una bici", function(done) {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici)
            
            Bicicleta.allBicis()
            .then(bicis => {
                expect(bicis.length).toEqual(1);
                expect(bicis[0].code).toEqual(aBici.code);
                done();
            });   
        });
    });

    describe("Bicicleta.findByCode", () => {
        it("Debe devolver la bici con code 1", function(done) {
            Bicicleta.allBicis()
            .then(bicis => {
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici)
                var bBici = new Bicicleta({code: 2, color: "roja", modelo: "montaña"});
                Bicicleta.add(bBici)

                Bicicleta.allBicis()
                .then(bicis => {
                    Bicicleta.findByCode(1)
                    .then(targetBici =>{
                        expect(targetBici.code).toEqual(aBici.code);
                        expect(targetBici.color).toEqual(aBici.color);
                        expect(targetBici.modelo).toEqual(aBici.modelo);
                        done();
                    })
                });  
            })
        });
    });

    describe("Bicicleta.removeByCode", () => {
        it("Debe terminar vacia", function(done) {
            Bicicleta.allBicis()
            .then(bicis => {
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici)

                Bicicleta.allBicis()
                .then(bicis => {
                    expect(bicis.length).toBe(1);

                    Bicicleta.removeByCode(1)
                    .then(deletedBici=>{
                        Bicicleta.allBicis()
                        .then(bicis => {
                            expect(bicis.length).toBe(0);
                            done(); // Llama a `done` después de la aserción
                        })
                    })                
                });  
            })
        });
    });
});
