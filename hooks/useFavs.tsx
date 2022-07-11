import {useState} from 'react';

const useFavs = () => {
  const [favs, setFavs] = useState<number[]>([99, 66, 33]);

  // Adds a favourite
  const addFav = (fav: number) => {
    setFavs((prevState: number[]) => [...prevState, fav]);
  };

  // Removes a favourite
  const removeFav = (fav: number) => {
    setFavs((prevState: number[]) => [
      ...prevState.filter(item => item !== fav),
    ]);
  };

  // Clears all favourites
  const clearFavs = () => {
    setFavs([]);
  };

  return {favs, addFav, removeFav, clearFavs};
};

export default useFavs;
