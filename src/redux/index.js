import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import api from '../shared/api';
import User from '../shared/components/User';
import Posts from '../shared/components/Posts';
import NewPost from '../shared/components/NewPost';

const userState = {
  data: {},
  loading: false,
  error: null,
};

const fetchUsers = () => async (dispatch) => {
  dispatch({ type: 'LOAD_USERS_START' });

  try {
    const response = await api.getMe();
    dispatch({ type: 'LOAD_USERS_SUCCESS', payload: response });
  } catch (e) {
    dispatch({ type: 'LOAD_USERS_FAILURE', payload: e });
  }
};

export function userReducer(state = userState, action) {
  switch (action.type) {
    case 'LOAD_USERS_START': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'LOAD_USERS_SUCCESS': {
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    }
    case 'LOAD_USERS_FAILURE': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
}

const postState = {
  data: [],
  loading: false,
  error: null,
};

const fetchPosts = () => async (dispatch) => {
  dispatch({ type: 'LOAD_POSTS_START' });

  try {
    const response = await api.getPosts();
    dispatch({ type: 'LOAD_POSTS_SUCCESS', payload: response });
  } catch (e) {
    dispatch({ type: 'LOAD_POSTS_FAILURE', payload: e });
  }
};

export function postsReducer(state = postState, action) {
  switch (action.type) {
    case 'LOAD_POSTS_START': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'LOAD_POSTS_SUCCESS': {
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    }
    case 'LOAD_POSTS_FAILURE': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case 'REMOVE_POST': {
      return {
        ...state,
        data: state.data.filter((post) => post.id !== action.payload),
      };
    }
    case 'EDIT_POST': {
      return {
        ...state,
        data: state.data.map((post) => {
          if (post.id === action.payload.id) {
            return {
              ...post,
              text: action.payload.text,
            };
          }

          return post;
        }),
      };
    }
    default:
      return state;
  }
}

const createNewPost = (newPostData) => async (dispatch) => {
  dispatch({ type: 'LOAD_POSTS_START' });

  try {
    await api.addPost(newPostData);
    dispatch(fetchPosts());
  } catch (e) {
    dispatch({ type: 'LOAD_POSTS_FAILURE', payload: e });
  }
};

const removePost = (id) => async (dispatch) => {
  dispatch({ type: 'LOAD_POSTS_START' });

  try {
    await api.removePost(id);

    dispatch({ type: 'REMOVE_POST', payload: id });
  } catch (e) {
    dispatch({ type: 'LOAD_POSTS_FAILURE', payload: e });
  }
};

const currentUserSelector = (state) => state.user.data;
const postsSelector = (state) => state.posts.data;

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default function ReduxWay() {
  return (
    <Provider store={store}>
      <ReduxApp />
    </Provider>
  );
}

function ReduxApp() {
  const me = useSelector(currentUserSelector);
  const posts = useSelector(postsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, []);

  return (
    <>
      <User name={me?.name} />
      <NewPost
        onCreate={(payload) =>
          dispatch(createNewPost({ ...payload, authorId: me?.id }))
        }
      />
      <Posts
        data={posts}
        onRemove={(id) => dispatch(removePost(id))}
        onEdit={(id, text) => {
          dispatch({ type: 'EDIT_POST', payload: { id, text } });
        }}
      />
    </>
  );
}
