import { useRef, useState } from 'react';

const accounts = {
  Admin: { username: 'admin123', password: 'admin123' },
  Viewer: { username: 'user123', password: 'user123' }
};

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([{ id: 1, content: 'Sample post' }]);
  const nextPostId = useRef(2);
  const passwordInput = useRef(null);

  function handleLogin(event) {
    event.preventDefault();
    const role = event.nativeEvent.submitter?.dataset.role;
    if (!role) {
      setError('Choose a role to continue.');
      return;
    }

    const account = accounts[role];
    if (username.trim() !== account.username || password !== account.password) {
      setError('Incorrect username or password for this role.');
      passwordInput.current?.focus();
      return;
    }

    setError('');
    setUser({ username: username.trim(), role });
  }

  function handleLogout() {
    setUser(null);
    setUsername('');
    setPassword('');
    setNewPost('');
    setError('');
  }

  function handleAddPost(event) {
    event.preventDefault();
    const content = newPost.trim();
    if (!content) return;

    setPosts((currentPosts) => [
      ...currentPosts,
      { id: nextPostId.current++, content }
    ]);
    setNewPost('');
  }

  function handleDeletePost(postId) {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  }

  return (
    <main className="shell" aria-live="polite">
      <header className="topline">
        <div className="brand"><span className="brand-mark" aria-hidden="true">P</span> POSTROOM</div>
        {user && <button className="button logout" type="button" onClick={handleLogout}>Log out</button>}
      </header>

      {!user ? (
        <section className="content" aria-labelledby="login-title">
          <span className="eyebrow">Good to have you here</span>
          <h1 id="login-title">Sign in to Postroom</h1>
          <p className="intro">Sign in with one of the demo accounts below.</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <label className="spaced-label" htmlFor="password">Password</label>
            <input
              ref={passwordInput}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <p className="credential-hint">Admin: <code>admin123 / admin123</code> | Viewer: <code>user123 / user123</code></p>
            <div className="role-actions">
              <button className="button button-admin" type="submit" data-role="Admin">Login as Admin</button>
              <button className="button button-viewer" type="submit" data-role="Viewer">Login as Viewer</button>
            </div>
            <p className="hint" role="alert">{error}</p>
          </form>
        </section>
      ) : (
        <section className="content" aria-labelledby="welcome-title">
          <div className="welcome">
            <span className="eyebrow">Postroom account</span>
            <h1 id="welcome-title">Welcome, {user.username} ({user.role})</h1>
            <p className="intro">You are signed in and ready to continue.</p>
          </div>

          {user.role === 'Admin' ? (
            <section className="role-panel" aria-labelledby="admin-title">
              <h2 className="role-label" id="admin-title">Admin controls</h2>
              <form onSubmit={handleAddPost}>
                <label htmlFor="new-post">New post</label>
                <textarea
                  id="new-post"
                  name="new-post"
                  maxLength={500}
                  placeholder="Write something for viewers to read"
                  value={newPost}
                  onChange={(event) => setNewPost(event.target.value)}
                  required
                />
                <button className="button button-admin add-button" type="submit">Add Post</button>
              </form>
            </section>
          ) : (
            <section className="role-panel" aria-labelledby="viewer-title">
              <h2 className="role-label" id="viewer-title">Access level</h2>
              <p className="readonly">Read-only access</p>
            </section>
          )}

          <section className="role-panel posts-panel" aria-labelledby="posts-title">
            <h2 className="role-label" id="posts-title">Posts</h2>
            {posts.length > 0 ? (
              <div className="post-list">
                {posts.map((post) => (
                  <article className="post-entry" key={post.id}>
                    <p className="post-content">{post.content}</p>
                    {user.role === 'Admin' && (
                      <button className="button button-delete" type="button" onClick={() => handleDeletePost(post.id)}>
                        Delete Post
                      </button>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-posts">No posts yet.</p>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
