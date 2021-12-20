export const controlsSetHandlers = (component, movieToDisplay) => {
  component.setFavoriteCallback (()=>{
    movieToDisplay.userDetails.favorite = !movieToDisplay.userDetails.favorite;
  });

  component.setWatchCallback (()=>{
    movieToDisplay.userDetails.alreadyWatched = !movieToDisplay.userDetails.alreadyWatched;
  });

  component.setWatchlistCallback (()=>{
    movieToDisplay.userDetails.watchlist = !movieToDisplay.userDetails.watchlist;
  });
};
