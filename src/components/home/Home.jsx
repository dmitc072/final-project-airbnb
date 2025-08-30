import { SearchResults } from '../home/searchResults/SearchResults.jsx';
import { SearchBar } from '../home/searchBar/SearchBar.jsx';
import { useState, React } from 'react';
import { PendingApprovalMessages } from '../pendingApproval/PendingApprovalMessages.jsx';
import { ChangeOfPrice } from '../changeOfPrice/ChangeOfPrice.js';

export const Home = () => {
  const [searchResult, setSearchResult] = useState([]);

  return (
    <>
      <PendingApprovalMessages />{' '}
      {/*send a message out for host if there is a pending request and redirects to pernding page*/}
      <ChangeOfPrice />
      <SearchBar setSearchResult={setSearchResult} /> {/* Passing setSearchResult as a parameter */}
      <SearchResults searchResult={searchResult} />
    </>
  );
};
