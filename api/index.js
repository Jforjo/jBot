import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = (req, res) => {
    console.log("request", req);
    console.log("response", res);
    return res.json({ message: "Hello World!" });
};