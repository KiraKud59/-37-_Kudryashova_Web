import { useEffect } from 'react';
import { useStore } from '../store';
import PostsView from './PostsView';

export default function UsersView() {
    const { users, loadingUsers, loadUsers, removeUser } = useStore();
    useEffect(() => { if (users.length === 0) loadUsers(); }, []);

    return (
        <>
            <div className="api-card">
                <div className="api-header"><h2 className="api-title">👥 RANDOMUSER API</h2><span className="api-badge">GET · DELETE</span></div>
                <div className="api-content">
                    {loadingUsers && <div className="loading-shimmer">👥 ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ...</div>}
                    {!loadingUsers && users.length === 0 && <div className="placeholder-message"><p>👥 Нет пользователей</p></div>}
                    {!loadingUsers && users.length > 0 && (
                        <div className="grid-list">
                            {users.map((user, idx) => (
                                <div key={idx} className="user-card">
                                    <img src={user.picture} className="user-avatar" />
                                    <div><strong>{user.name}</strong></div>
                                    <div style={{ fontSize: '0.85rem' }}>📧 {user.email}</div>
                                    <div style={{ fontSize: '0.85rem' }}>🌍 {user.country}</div>
                                    <button className="danger" onClick={() => removeUser(idx)}>🗑 Удалить</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={loadUsers}>👥 GET (обновить)</button>
                </div>
            </div>
            <PostsView />
        </>
    );
}