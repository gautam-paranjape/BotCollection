//Import routes
import { auth as Auth } from "./routes/Auth";

import Express, { Request, Response, NextFunction } from "express";

import * as bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import { PORT } from "../PORT.json";

export class Server {
  public app: Express.Application;

  constructor() {
    this.app = Express();

    this.setConfig();
    this.setRequestLogger();
    this.setRoutes();
  }

  public start() {
    this.app.listen(PORT, async () => {
      console.log(`Bot collection started on port ${PORT}`);
    });

    dotenv.config();
  }

  private setConfig() {
    this.app.use(Express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(Express.static(path.join(__dirname, "frontend")));
  }

  private setRequestLogger() {
    this.app.use(async (req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} request made in ${req.path}`);

      next();
    });
  }

  private setRoutes() {
    this.app.get("/", async (req: Request, res: Response) => {
      res.sendFile(__dirname + "/frontend/index.html");
    });

    this.app.get("/new", async (req: Request, res: Response) => {
      res.sendFile(__dirname + "/frontend/html/new.html");
    });

    this.app.get("/discord", async (req: Request, res: Response) => {
      res.redirect("https://discord.com/invite/sound");
    });

    this.app.use("/api/auth", Auth);

    this.app.get("*", async (req: Request, res: Response) => {
      res.send("404");
    });
  }
}
