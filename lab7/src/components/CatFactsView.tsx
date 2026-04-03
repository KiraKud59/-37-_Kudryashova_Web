import { useEffect } from 'react';
import { useStore } from '../store';
import PostsView from './PostsView';

export default function CatFactsView() {
    const { catFacts, loadingFacts, loadCatFacts, removeFact } = useStore();
    useEffect(() => { if (catFacts.length === 0) loadCatFacts(); }, []);

    return (
        <>
            <div className="api-card">
                <div className="api-header"><h2 className="api-title">🐱 CAT FACTS API</h2><span className="api-badge">GET · DELETE</span></div>
                <div className="api-content">
                    {loadingFacts && <div className="loading-shimmer">🐱 ЗАГРУЗКА ФАКТОВ...</div>}
                    {!loadingFacts && catFacts.length === 0 && <div className="placeholder-message"><p>🐱 Нет фактов</p></div>}
                    {!loadingFacts && catFacts.map((fact, idx) => (
                        <div key={idx} className="fact-card" style={{ textAlign: 'left', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>📌 {fact.fact}</div>
                                <button className="danger" onClick={() => removeFact(idx)}>🗑</button>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#8bc34a' }}>📏 {fact.length} симв.</div>
                        </div>
                    ))}
                    <button onClick={loadCatFacts}>🐱 GET (обновить)</button>
                </div>
            </div>
            <PostsView />
        </>
    );
}