import { useBooks } from '../hooks/useBooks';
import BookList from '../components/books/BookList';
import FilterPanel from '../components/search/FilterPanel';
import './HomePage.css';

const HomePage = () => {
  const {
    books,
    filteredBooks,
    selectedGenres,
    setSelectedGenres,
    loading
  } = useBooks();

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-layout">
          {/* Sidebar - Filter Panel */}
          <aside className="home-sidebar">
            <FilterPanel
              books={books}
              selectedGenres={selectedGenres}
              onFilterChange={setSelectedGenres}
            />
          </aside>

          {/* Main Content - Book List */}
          <main className="home-main">
            <div className="home-header">
              <h1>Kitoblar katalogi</h1>
              <p className="home-subtitle">
                {filteredBooks.length} ta kitob topildi
              </p>
            </div>

            <BookList books={filteredBooks} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
