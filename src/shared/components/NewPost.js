import React, { useState } from 'react';

const getInitialState = () => {
  return {
    title: '',
    text: '',
    id: Math.ceil(Math.random() * 10000),
  };
};

export default function NewPost({ onCreate = console.log }) {
  const [state, setState] = useState(() => getInitialState());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(state);
        setState(getInitialState());
      }}
    >
      <input
        placeholder="title"
        type="text"
        value={state.title}
        onChange={(e) =>
          setState((prevState) => ({ ...prevState, title: e.target.value }))
        }
      />
      <div>
        <textarea
          placeholder="text"
          value={state.text}
          onChange={(e) =>
            setState((prevState) => ({ ...prevState, text: e.target.value }))
          }
        />
      </div>
      <button type="submit">Submit new post</button>
    </form>
  );
}
