var knex = require("../database/database");

const sensor = {
    createTableSensors: async () => {
        knex.schema.hasTable("sensors").then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("sensors", function (t) {
                    t.increments("idSensor").primary();
                    t.integer("idUser", 10)
                        .unsigned()
                        .notNullable()
                        .references("id")
                        .inTable("users");
                    t.text("deviceType", 255);
                    t.text("description", 255);
                    t.float("latitude", 6, 6).defaultTo(0);
                    t.float("longitude", 6, 6).defaultTo(0);
                    t.text("sensorType", 255);
                });
            } else {
                return null;
            }
        });
    },
    add: async (id, sensor, callback) => {
        await knex("sensors")
            .insert([{ 
                idUser: id,
                latitude: sensor.location.latitude,
                longitude:sensor.location.longitude, 
                deviceType:sensor.deviceType,
                sensorType:sensor.sensorType
            }])
            .then(data => callback.then(data))
            .catch(err => callback.catch(err))   
    },
    get: async (id, callback) => {
        console.log('id: ', id);
        await knex("sensors")
            .select()
            .where('idUser', id)
            .then(data => callback.then(data))
            .catch(err => callback.catch(err))   
    },
}
module.exports = sensor;
