import { useEffect } from 'react';
import { useStore } from '../store';
import PostsView from './PostsView';

export default function DogView() {
    const { dogs, loadingDogs, loadDogs, removeDog } = useStore();
    useEffect(() => { if (dogs.length === 0) loadDogs(); }, []);

    return (
        <>
            <div className="api-card">
                <div className="api-header"><h2 className="api-title">🐕‍🦺 DOG CEO API</h2><span className="api-badge">GET · DELETE</span></div>
                <div className="api-content">
                    {loadingDogs && <div className="loading-shimmer">🐕 ЗАГРУЗКА СОБАК...</div>}
                    {!loadingDogs && dogs.length === 0 && <div className="placeholder-message"><p>🐕 Нет изображений</p></div>}
                    {!loadingDogs && dogs.length > 0 && (
                        <div className="grid-list">
                            {dogs.map((dog, idx) => (
                                <div key={idx} className="dog-card">
                                    <img src={dog.url} className="dog-image" />
                                    <div><strong>Порода:</strong> {dog.breed}</div>
                                    <button className="danger" onClick={() => removeDog(idx)}>🗑 Удалить</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={loadDogs}>🐕 GET (обновить)</button>
                </div>
            </div>
            <PostsView />
        </>
    );
}