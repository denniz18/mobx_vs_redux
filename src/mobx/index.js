import React from 'react';
import {
  makeObservable,
  observable,
  flow,
  onBecomeObserved,
  makeAutoObservable,
} from 'mobx';
import { observer } from 'mobx-react-lite';
import api from '../shared/api';
import User from '../shared/components/User';
import Posts from '../shared/components/Posts';
import NewPost from '../shared/components/NewPost';

class UserStore {
  name = '';
  id = null;

  constructor() {
    makeObservable(this, {
      name: observable,
      id: observable,
      fetch: flow.bound,
    });

    onBecomeObserved(this, 'name', this.fetch);
  }

  *fetch() {
    const response = yield api.getMe();

    this.name = response.name;
    this.id = response.id;
  }
}

class PostStore {
  id;
  title = '';
  text = '';
  authorId = -1;

  constructor({ id, title, text, authorId }) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.id = id;
    this.title = title;
    this.text = text;
    this.authorId = authorId;
  }

  updateText(text) {
    this.text = text;
  }
}

class PostsStore {
  list = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    onBecomeObserved(this, 'list', this.fetch);
  }

  *addPost(payload) {
    yield api.addPost(payload);

    yield this.fetch();
  }

  *deletePost(id) {
    yield api.removePost(id);

    const postIndex = this.list.findIndex((post) => post.id === id);

    this.list.splice(postIndex, 1);
  }

  *fetch() {
    const response = yield api.getPosts();

    this.list = response.map((post) => new PostStore(post));
  }
}

const user = new UserStore();
const posts = new PostsStore();

const ObservablePosts = observer(Posts);

const MobxApp = observer(() => {
  return (
    <div>
      <User name={user.name} />
      <NewPost
        onCreate={(postPayload) => {
          posts.addPost({ ...postPayload, authorId: user.id });
        }}
      />
      <ObservablePosts
        data={posts.list}
        onRemove={(postPayload) => posts.deletePost(postPayload)}
        onEdit={(id, text) => {
          const post = posts.list.find((post) => post.id === id);

          post.updateText(text);
        }}
      />
    </div>
  );
});

export default function MobxWay() {
  return (
    <div>
      Mobx
      <MobxApp />
    </div>
  );
}
