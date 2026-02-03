import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { MainLayout } from './layouts/MainLayout';
import { PostDetail } from './pages/Post/PostDetail';
import { Author } from './pages/Post/Author';
import { Tag } from './pages/Post/Tag';

function App() {
    return (
        <>
            {/* Router */}
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/author/:id" element={<Author />} />
                    <Route path="/tag/:value" element={<Tag />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
