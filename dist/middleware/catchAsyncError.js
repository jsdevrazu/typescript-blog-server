"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A Reusable Function to working with async function and  avoid using trycatch block
exports.default = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
