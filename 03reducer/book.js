//参考用，state的结构如下表：
const stateSchema = {
  booklist: [
    {
      id: '',
      name: '',
      barcode: '',
      author: '',
      date: '',
      cate: '',
      image: ''
    },
  ],
  currbookitem:{
    id: '',
    name: '',
    barcode: '',
    author: '',
    date: '',
    cate: '',
    image: ''
  }
}

import * as actionTypes from '../04action/index';
import _ from 'lodash';

const replaceitem = (list, newItem) => {
  const index = _.findIndex(list, (item) => item.id === newItem.id);
  if (index >= 0) {
    return _.orderBy([...list.slice(0, index), newItem, ...list.slice(index + 1)], ['date', 'id'], ['desc', 'desc']);
  }
  return list;
};

const removeitem = (list, id) => {
  const index = _.findIndex(list, (item) => item.id === id);
  if (index >= 0) {
    return _.orderBy([...list.slice(0, index), ...list.slice(index + 1)], ['date', 'id'], ['desc', 'desc']);
  }
  return list;
};

const appReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.book_loadlist:
      return { ...state, booklist: action.payload.length === 0 ? action.payload : _.orderBy(action.payload, ['date', 'id'], ['desc', 'desc']) };
    case actionTypes.book_additem:
      return { ...state, booklist: _.orderBy(_.concat(state.booklist, action.payload), ['date', 'id'], ['desc', 'desc']) };
    case actionTypes.book_updateitem:
      return { ...state, booklist: replaceitem(state.booklist, action.payload) };
    case actionTypes.book_deleteitem:
      return { ...state, booklist: removeitem(state.booklist, action.payload) };
    case actionTypes.book_clearlist:
      return { ...state, booklist: null, condition: null };
    case actionTypes.book_loadcurritem:
      return { ...state, currbookitem: action.payload };
    case actionTypes.book_updatecate:
      return { ...state, currbookitem: { ...state.currbookitem, cate: action.payload } };
    default:
      return state;
  }
}

export default appReducer;

