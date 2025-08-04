
import { cities } from '../constants/cities';
import { useFilter } from '../context/FilterContext';

const CityAndSortFilter = () => {
  const { city, setCity, sortByPrice, sortByRating, setSortByPrice, setSortByRating } = useFilter();

  return (
    <div className="mb-3 d-flex gap-3 align-items-center">
      <select className="form-select w-auto" value={city ?? ''} onChange={(e) => setCity(e.target.value)}>
        <option value="">Сите градови</option>
        {cities.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <div className="btn-group">
        <button className={`btn ${sortByPrice ? 'btn-primary' : 'btn-outline-primary'}`} onClick={setSortByPrice}>Цена</button>
        <button className={`btn ${sortByRating ? 'btn-primary' : 'btn-outline-primary'}`} onClick={setSortByRating}>Рејтинг</button>
      </div>
    </div>
  );
};

export default CityAndSortFilter;