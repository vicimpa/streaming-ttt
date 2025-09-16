import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import express, { Router } from "express";
import { Game } from "./game";
import { Value } from "@sinclair/typebox/value";
import { TickDTO, UpdateDTO } from "./dto";

import "./db";
import { createOrUpdateUser, fetchUsersByIds, getLeaderBoard, insertWin, User } from "./db";

export async function main() {
  // TODO Server
  const app = express();
  const route = Router();
  const server = new Server(app);
  const io = new SocketServer(server, { path: '/api/ws' });

  var game = new Game();
  var last = Date.now();

  const interval = setInterval(() => {
    sendLeaderboard(io);
  }, 10000);

  server.on('close', () => {
    clearInterval(interval);
  });

  async function sendGame(target: SocketServer | Socket) {
    const win = game.winner;
    const ids = game.map.map(e => e?.id ?? null).filter(Boolean) as string[];
    const users: Record<string, User> = {};

    for (const user of await fetchUsersByIds(ids)) {
      users[user.id] = user;
    }

    const update = {
      game: game.map.map(item => {
        if (!item)
          return null;

        return {
          id: item.id,
          name: users[item.id]?.name ?? item.id,
          x: item.value === 'x',
          win: win?.line.includes(item) || (!win && game.isEnd)
        };
      }),
      winner: win ? {
        id: win.winner.id,
        name: users[win.winner.id]?.name ?? win.winner.id,
        avatar: users[win.winner.id]?.avatar,
      } : null
    };
    target.emit('update', update);
  }

  async function sendLeaderboard(target: SocketServer | Socket) {
    target.emit('update', { leads: await getLeaderBoard() });
  }

  app.use('/api', route);

  route.use(express.json());
  route.post('/tick', async ({ body }, res) => {
    try {
      if (game.isEnd)
        return res.end('Game stopped');

      if (Date.now() - last < 1000)
        return res.end('Timeout');

      const { id, name, address, avatar } = Value.Parse(TickDTO, body);

      if (game.getValue(id))
        throw new Error('Invalid id');

      const user = await createOrUpdateUser(name, address, avatar);

      game.setValue(id, user.id);
      last = Date.now();

      if (game.isEnd) {
        setTimeout(async () => {
          game = new Game();
          await sendGame(io);
        }, 5000);
        if (game.winner) {
          await insertWin(game.winner.winner.id);
          await sendLeaderboard(io);
        }
      }

      await sendGame(io);
      res.end('Ok');
    } catch (e) {
      res.end(`${e}`);
    }
  });

  route.post('/update', async ({ body }, res) => {
    try {
      const { name, address, avatar } = Value.Parse(UpdateDTO, body);
      res.send(await createOrUpdateUser(name, address, avatar));
    } catch (e) {
      res.end(`${e}`);
    }
  });

  route.get('/leaderboard', async (_, res) => {
    res.send(await getLeaderBoard());
  });

  io.on('connect', async (socket) => {
    await sendGame(socket);
    await sendLeaderboard(io);
  });

  return server;
}