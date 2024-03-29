import { RECEIVED_HOTELS, SELECT_HOTEL, ADD_HOTEL, SET_FILTERS, FILTER_AND_SORT_HOTELS, SORT_HOTELS } from '../../constants/action-types.constants';
import { Hotels, Hotel, SortFilters } from './hotels.types';

const initialState: Hotels = {
  selected: '',
  list: [],
  visibleList: [],
  filters: {
    amenities: [],
    price_category: []
  },
  sort: {
    key: 'rating',
    order: 'desc'
  }
};

export const getSelectedHotel = (hotels: Hotels) => {
  return hotels.list.find(hotel =>  hotel.id === hotels.selected);
}

const addHotelReducer = (state: Hotels, hotel: Hotel) => {
  const currentHotelId = state.list.findIndex((_hotel: Hotel) =>  hotel.id === _hotel.id);
  const hotels = state.list;
  if (currentHotelId !== -1) {
    return { ...state, list: [...hotels.slice(0, currentHotelId), hotel, ...hotels.slice(currentHotelId + 1)]};
  } else {
    return { ...state, list: [...hotels, hotel]};
  }
}

const filterHotels = (hotels: Hotel[], filters: any): Hotel[] => {
  const filterableKeys = Object.keys(filters).filter((k: string) => filters[k].length > 0);
  let _hotels = [...hotels];
  filterableKeys.forEach((key: string) => {
    _hotels = _hotels.filter((hotel: any) => {
      if(typeof hotel[key] === 'string') {
        return filters[key].indexOf(hotel[key]) > -1 ? true : false;
      }
      if(Array.isArray(hotel[key])) {
        let filterValues = filters[key];
        filterValues = filterValues.filter((value: any) => hotel[key].indexOf(value) > -1 ? false : true);
        return filterValues.length === 0;
      }
      return true;
    });
  });
  return _hotels;
}

const setVisibleHotelList = (state: Hotels) => {
  return {...state, visibleList: sortHotelList(filterHotels(state.list, state.filters), state.sort)};
};

const sortHotelList = (hotels: Hotel[], sort: SortFilters) => {
  const _hotels = [...hotels];
  return _hotels.sort((a: any, b: any): number => {
    if (a[sort.key] < b[sort.key]) {
      return (sort.order === 'asc') ? -1 : 1
    }
    if (a[sort.key] > b[sort.key]) {
      return (sort.order === 'asc') ? 1 : -1
    }
    return 0;
  });
};

const reducer = (state = initialState, action: any) => {
  switch (action.type){
    case RECEIVED_HOTELS: 
      return {...state, list: action.hotels};
    case SELECT_HOTEL:
      return {...state, selected: action.hotelId};
    case ADD_HOTEL:
      return addHotelReducer(state, action.hotel);
    case SET_FILTERS:
      return {...state, filters: {...state.filters, ...action.filterChange}};
    case FILTER_AND_SORT_HOTELS:
      return setVisibleHotelList(state);
    case SORT_HOTELS: {
      const newSort = { key: action.key, order: action.order }; 
      return {
        ...state,
        sort: newSort,
        visibleList: sortHotelList(state.visibleList, newSort)
      }
    }
    default:
      return state;
  }
}

export { reducer as HotelsReducer }