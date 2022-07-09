"use Strict";

const boughtPlansModel = require("../models/boughtPlans");

/**
 * Returns list of all boughtPlan in database.
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const list = async (req, res) => {
    try {
        const boughtPlans = await boughtPlansModel.find({}).exec();
        return res.status(200).json(boughtPlans);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error: " + err.message,
        });
    }
};

/**
 * Creates a new boughtPlan item in database.
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const create = async (req, res) => {
    // Check if the body of the request is not empty.
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    }

    // Handle the given boughtPlan creation request.
    try {
        // Create boughtPlan in database with supplied request body.
        const boughtPlan = await boughtPlansModel.create(req.body);

        // Return success status with created boughtPlan as json.
        return res.status(201).json(boughtPlan);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error:" + err.message,
        });
    }
};

/**
 * Retrieves item in database.
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const get = async (req, res) => {
    try {
        // get boughtPlan with id from database
        let boughtPlan = await boughtPlansModel.find({userId: req.params.id}).exec();
        // if no boughtPlan with id is found, return 404
        if (!boughtPlan)
            return res.status(404).json({
                error: "Not Found",
                message: `boughtPlan not found`,
            });

        // return gotten boughtPlan
        return res.status(200).json(boughtPlan);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        });
    }
};

module.exports = {
    create,
    list,
    get,
};
