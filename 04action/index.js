export const book_loadlist = 'book_loadlist'
export const book_loadlist_action = (list) => {
    return {
        type: book_loadlist,
        payload: list
    }
}
export const book_clearlist = 'book_clearlist'
export const book_clearlist_action = () => {
    return {
        type: book_clearlist
    }
}

export const book_additem = 'book_additem'
export const book_additem_action = (item) => {
    return {
        type: book_additem,
        payload: item
    }
}

export const book_updateitem = 'book_updateitem'
export const book_updateitem_action = (item) => {
    return {
        type: book_updateitem,
        payload: item
    }
}

export const book_deleteitem = 'book_deleteitem'
export const book_deleteitem_action = (id) => {
    return {
        type: book_deleteitem,
        payload: id
    }
}

export const book_loadcurritem = 'book_loadcurritem'
export const book_loadcurritem_action = (item) => {
    return {
        type: book_loadcurritem,
        payload: item
    }
}
export const book_updatecate = 'book_updatecate'
export const book_updatecate_action = (cate) => {
    return {
        type: book_updatecate,
        payload: cate
    }
}





