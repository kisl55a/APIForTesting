var knex = require("../database/database");
const jwt = require("jsonwebtoken");
const jwtKey = "BWWrCs!|M;e*oU.YWJ_W+6jposZKF-";
const bcryptjs = require("bcryptjs");
const saltRounds = 4;

function generateAuthToken(id, user) {
    const token = jwt.sign(
        {
            id,
            ...user,
        },
        jwtKey,
        { expiresIn: "7d" }
    );
    return token;
}

var user = {
    createTableUsers: () => {
        knex.schema.hasTable("users").then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("users", function (t) {
                    t.increments("id").primary();
                    t.string("username", 255).unique();
                    t.string("email", 255);
                    t.string('name', 255);
                    t.string("dateOfBirth", 255);
                    t.string("address", 255);
                    t.string("country", 255);
                    t.string("city", 255);
                    t.string("password", 255);
                });
            } else {
                return null;
            }
        });
    },
    get: async function (callback) {
        return knex('users')
            .select("username", "name", "dateOfBirth", "address", "city", "country", "email")
            .then(
                data => {
                    callback.then(data);
                })
            .catch(err => {
                callback.catch(err)
            })
    },
    getById: function (id, callback) {
        return knex("users")
            .select("username", "name", "dateOfBirth", "address", "city", "country", "email")
            .where("id", id)
            .then(data => callback.then(data))
            .catch(err => callback.catch(err))
    },
    add: function (user, callback) {
        console.log(user.username);
        bcryptjs.hash(user.password, saltRounds).then(hash => {
            return knex("users")
                .insert([{ ...user, password: hash }])
                .then(data => {
                    callback.then(data);
                })
                .catch(err => {
                    callback.catch(err);
                    console.log(err);
                });
        });
    },
    login: async function (user, callback) {
        // console.log("something");
        // console.log(user);
        let userData = await knex
            .from("users")
            .select()
            .where("username", user.username);
        userData = userData[0];
        if (userData == null) {
            return { code: 0 };
        }
        const correctPasswordSwitch = await bcryptjs.compare(
            user.password,
            userData.password
        );
        // console.log('userData: ', userData);
        // TODO put user's id into the token
        if (correctPasswordSwitch) {
            return {
                id: userData.id,
                code: 1,
                token: generateAuthToken(userData.id, false, userData)
            };
        } else {
            return {
                code: 0
            };
        }
    },
    delete: function (id, callback) {
        return db.query('delete from users where user_id=?', [id], callback);
    },
    update: function (id, user, callback) {
        if (user.password) {
            bcryptjs.hash(user.password, saltRounds).then(hash => {
                console.log(user);
                return knex("users")
                    .where("id", id)
                    .update({
                        ...user,
                        password: hash
                    })
                    .then(data => {
                        callback.then(data);
                    })
                    .catch(err => {
                        callback.catch(err);
                    });
            });
        } else {
            return knex("users")
                .where("id", id)
                .update({
                    ...user
                })
                .then(data => {
                    callback.then(data);
                })
                .catch(err => {
                    callback.catch(err);
                });
        }
    }
};
module.exports = user;