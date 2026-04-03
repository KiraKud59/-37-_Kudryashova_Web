import { useState, useEffect } from 'react';
import { useStore } from '../store';

export default function PostsView() {
    const { posts, loadingPosts, loadPosts, addPost, updatePost, deletePost } = useStore();
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');

    useEffect(() => { if (posts.length === 0) loadPosts(); }, []);

    if (loadingPosts) return <div className="loading-shimmer">📋 ЗАГРУЗКА ПОСТОВ...</div>;

    return (
        <div className="api-card">
            <div className="api-header"><h2 className="api-title">📋 JSONPlaceholder API</h2><span className="api-badge">GET · POST · PUT · DELETE</span></div>
            <div className="api-content">
                {/* POST форма */}
                <div className="action-group">
                    <input placeholder="Заголовок" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 2 }} />
                    <input placeholder="Текст" value={newBody} onChange={e => setNewBody(e.target.value)} style={{ flex: 3 }} />
                    <button className="success" onClick={() => { addPost(newTitle, newBody); setNewTitle(''); setNewBody(''); }}>💾 POST</button>
                </div>
                {/* PUT форма */}
                {editId && <div className="action-group" style={{ background: '#0d1b2a', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                    <input placeholder="Новый заголовок" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ flex: 2 }} />
                    <input placeholder="Новый текст" value={editBody} onChange={e => setEditBody(e.target.value)} style={{ flex: 3 }} />
                    <button onClick={() => { updatePost(editId, editTitle, editBody); setEditId(null); }}>✏️ PUT</button>
                    <button className="secondary" onClick={() => setEditId(null)}>Отмена</button>
                </div>}
                {/* Список постов */}
                {posts.map(post => (
                    <div key={post.id} className="post-item">
                        <div className="post-title">📌 {post.title}</div>
                        <div className="post-body">{post.body}</div>
                        <div className="post-actions">
                            <button className="secondary" onClick={() => { setEditId(post.id); setEditTitle(post.title); setEditBody(post.body); }}>✏️ PUT</button>
                            <button className="danger" onClick={() => deletePost(post.id)}>🗑 DELETE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}