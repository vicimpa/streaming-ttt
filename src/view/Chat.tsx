import { windowEvents } from "@vicimpa/events";
import { useEffect, useState, type FormEventHandler } from "react";
import styled from "styled-components";

const Form = styled.form`
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const Chats = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  background-color: var(--gray);
`;

export const Chat = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    return windowEvents('keydown', e => {
      if (e.code === 'Enter')
        setShow(v => !v);
    });
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data: Record<string, string> = {};

    for (const input of e.currentTarget) {
      if (!(input instanceof HTMLInputElement))
        continue;

      if (!input.name)
        continue;

      if (!input.value)
        continue;

      data[input.name] = input.value;

      if (input.name !== 'name')
        input.value = '';
    }

    fetch('/api/tick', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(e => e.text()).then(console.log).catch(console.error);
  };

  if (!show)
    return null;

  return (
    <Chats>
      <Form onSubmit={onSubmit}>
        <p>Chat</p>
        <input name="id" />
        <input name="name" value="Player 1" readOnly />
        <button>Send</button>
      </Form>
      <Form onSubmit={onSubmit}>
        <p>Chat</p>
        <input name="id" />
        <input name="name" value="Player 2" readOnly />
        <button>Send</button>
      </Form>
    </Chats>
  );
};