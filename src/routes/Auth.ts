import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import request from "request-promise";

export const auth = Router();

(async () => {
  auth.get("/discord", async (req: Request, res: Response) => {
    res.redirect(
      "https://discord.com/api/oauth2/authorize" +
        "?client_id=" +
        process.env.CLIENT_ID +
        "&redirect_uri=" +
        encodeURIComponent("http://localhost:3000/api/auth/discord/callback") +
        "&response_type=code" +
        "&scope=identify%20email"
    );

    auth.get("/discord/callback", async (req: Request, res: Response) => {
      let code = req.query.code;

      let accessToken = await request({
        method: "post",
        url: "https://discord.com/api/v8/oauth2/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        form: {
          code,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:3000/api/auth/discord/callback",
          scope: "identify email",
        },
        json: true,
        simple: true,
      });

      let user = await request({
        method: "get",
        url: "https://discord.com/api/v8/users/@me",
        headers: {
          Authorization: "Bearer " + accessToken.access_token,
        },
        json: true,
        simple: true,
      });

      res.send(user);
    });
  });
})();
