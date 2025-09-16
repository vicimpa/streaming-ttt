import getPort from "get-port";
import { Server } from "http";
import type { Plugin } from "vite";
import { main } from "./main";

export function server(port = 0) {
  var server: Server | null = null;


  async function startServer(port: number) {
    server = (await main()).listen(port);
  }

  return {
    name: 'server',
    async config(config) {
      port = await getPort({ port });

      return {
        ...config,
        server: {
          ...config.server,
          proxy: {
            '/api': {
              target: `http://localhost:${port}`,
              ws: true,
            }
          }
        }
      };
    },
    async configureServer({ httpServer }) {
      if (!httpServer)
        return;
      await startServer(port);
      httpServer.once('close', () => {
        server?.close();
      });
    },
    async configurePreviewServer({ httpServer }) {
      await startServer(port);
      httpServer.once('close', () => {
        server?.close();
      });
    }
  } as Plugin;
}