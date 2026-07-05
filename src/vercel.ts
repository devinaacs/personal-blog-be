import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { Express } from "express";

import { AppModule } from "@/app.module";
import { setupApp } from "@/app.bootstrap";

let server: Express | undefined;

export async function createServer(): Promise<Express> {
  if (server) {
    return server;
  }

  const instance = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(instance), {
    bufferLogs: true,
  });

  setupApp(app);
  await app.init();

  server = instance;
  return server;
}
