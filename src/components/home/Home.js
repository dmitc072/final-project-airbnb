import { SearchResults } from '../home/searchResults/SearchResults.js';
import { SearchBar } from '../home/searchBar/SearchBar.js';
import { useContext, useEffect, useState } from "react";

export const Home = () => {
    const [searchResult, setSearchResult] = useState([])

    return (
        <>
        
        <SearchBar setSearchResult = {setSearchResult} />{/*Passing setSearchResult as a parameter to use in another component in here*/}
        <SearchResults searchResult = {searchResult} />

        </>
    )
}