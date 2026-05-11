export default function Events(){
return(
    <>
      <div className="page">
      <div className="section-title">Browse Events</div>
      <div className="section-sub">Discover and join amazing events near you</div>
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="🔍  Search events..." />
        <select className="filter-select">
          <option value="">All Categories</option>
          <option>Technology</option><option>Music</option><option>Business</option><option>Art</option><option>Sports</option>
        </select>
        <select className="filter-select">
          <option>Any Date</option><option>This Week</option><option>This Month</option><option>Next 3 Months</option>
        </select>
        <select className="filter-select">
          <option>Any Price</option><option>Free</option><option>Under $50</option><option>$50–$150</option><option>$150+</option>
        </select>
      </div>
      <div className="events-grid" id="events-grid">
      </div>
    </div>
    </>
)
}