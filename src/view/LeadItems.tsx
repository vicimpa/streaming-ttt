import { useComputed, useSignal } from "@preact/signals-react/runtime";
import { Avatar, LeadsItem } from "./styled";
import { Variables } from "./Variables";
import { int } from "../utils/int";
import { useSocketEvent } from "../utils/socket";

type Lead = { name: string, count: number; avatar?: string; };

export const LeadItems = () => {
  const items = useSignal<Lead[]>([]);

  useSocketEvent('update', ({ leads }: any) => {
    if (leads && Array.isArray(leads))
      items.value = leads;
  });

  return useComputed(() => {
    if (!items.value.length)
      return (
        <LeadsItem>
          <p data-grow data-center>Empty</p>
        </LeadsItem>
      );

    return (
      items.value.slice(0, 9).map((item, i) => (
        <LeadsItem key={i}>
          <Variables image={item.avatar ? `url("${item.avatar}")` : null}>
            <Avatar />
          </Variables>
          <p data-grow>{item.name}</p>
          <p>{int(item.count)}</p>
        </LeadsItem>
      ))
    );
  });
};