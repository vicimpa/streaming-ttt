import { io } from "socket.io-client";
import { computed, Signal, signal, useSignal } from "@preact/signals-react";
import { useEvents } from "./events";
import { useEffect, useMemo } from "react";

const sockets = signal<Signal<boolean>[]>([]);

export const socketConnected = computed(() => sockets.value.every(e => e));

export function useSocketEvent(event: string, fn: (...args: any[]) => any) {
  const socket = useMemo(() => io({ path: '/api/ws' }), []);
  const listener = useEvents(fn);
  const connected = useSignal(socket.connected);

  useEffect(() => {
    socket.connect();
    socket.on(event, listener);
    sockets.value = [...sockets.value, connected];

    return () => {
      socket.disconnect();
      sockets.value = sockets.value.filter(e => e !== connected);
      socket.off(event, listener);
    };
  }, [connected]);

  useEffect(() => {
    const update = () => {
      connected.value = socket.connected;
    };
    socket.on('connect', update);
    socket.on('disconnect', update);

    return () => {
      socket.off('connect', update);
      socket.off('disconnect', update);
    };
  }, [connected, socket]);
}