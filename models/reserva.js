var mongoose = require("mongoose");
var moment = require("moment");
var Schema = mongoose.Schema;

var reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: "Bicicleta" },
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
});


reservaSchema.methods.toString = function(){
    return `Reserva ID: ${this._id} | Desde: ${this.desde} | Hasta: ${this.hasta}`;

  };
  
  reservaSchema.statics.allReservas = function(){
    return this.find({});
  };
  
  // Función para encontrar una reserva por su ID
  reservaSchema.statics.findById = function(id) { 
    return this.findOne({_id: id});
  };
  
  // Función para eliminar una reserva por su ID
  reservaSchema.statics.removeById = function(id) {
    return this.deleteOne({_id: id});
  };
  
  

reservaSchema.methods.diasDeReserva = function(){
    return moment(this.hasta).diff(moment(this.desde), "days")+1;
}

module.exports = mongoose.model("Reserva", reservaSchema);
