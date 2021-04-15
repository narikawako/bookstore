import _ from 'lodash';
import * as SQLite from 'expo-sqlite';
const DB = SQLite.openDatabase('db');

// DB 字段
// 'id'
// 'barcode text,' +            //条形码
// 'name text,' +               //书名
// 'author text,' +             //作者
// 'date text,' +               //购买日期
// 'cate text,' +               //分类
// 'image text' +               //图片

export const addbook = async (item) => {
  return new Promise((resolve, reject) => {
    DB.transaction(tx => {
      tx.executeSql(
        'insert into book(barcode,name,author,date,cate,image) values (?,?,?,?,?,?) ;',
        [
          item.barcode,
          item.name,
          item.author,
          item.date,
          item.cate,
          item.image
        ],
        (_, { insertId }) => {
          console.log('插入book信息成功，新id是：' + insertId);
          resolve(insertId)
        },
        (_, error) => {
          console.log(error);
          console.log('数据库执行出错addbook');
          resolve(-1)
        }
      );
    }
    );
  })
}

export const updatebook = async (item) => {
  return new Promise((resolve, reject) => {
    DB.transaction(tx => {
      tx.executeSql(
        'update book set barcode=?,name=?,author=?,date=?,cate=?,image=? where id =? ;',
        [
          item.barcode,
          item.name,
          item.author,
          item.date,
          item.cate,
          item.image,
          item.id
        ],
        () => {
          console.log('更新book信息成功');
          resolve(true)
        },
        (_, error) => {
          console.log(error);
          console.log('数据库执行出错updatebook');
          resolve(false)
        }
      );
    }
    );
  })
}

export const deletebook = async (id) => {
  return new Promise((resolve, reject) => {
    DB.transaction(tx => {
      tx.executeSql(
        'delete from book where id =? ;',
        [id],
        () => {
          console.log('删除book成功');
          resolve(true)
        },
        (_, error) => {
          console.log(error);
          console.log('数据库执行出错deletebook');
          resolve(false)
        }
      );
    }
    );
  })
}

export const getbooklist = async () => {
  return new Promise((resolve, reject) => {
    DB.transaction(tx => {
      tx.executeSql(
        'select id,barcode,name,author,date,cate,image from book ;',
        [],
        (_, { rows: { length, _array } }) => {
          if (length > 0) {
            console.log('获取book一览信息成功');
            resolve(_array)
          } else {
            console.log('从数据库找不到任何book数据');
            resolve([])
          }
        },
        (_, error) => {
          console.log(error);
          console.log('数据库执行出错getbooklist');
          resolve(null)
        }
      );
    }
    );
  })
}

export const getbookcatelist = async () => {
  return new Promise((resolve, reject) => {
    DB.transaction(tx => {
      tx.executeSql(
        'select distinct cate from book ;',
        [],
        (_, { rows: { length, _array } }) => {
          if (length > 0) {
            console.log('获取Cate一览信息成功');
            resolve(_array)
          } else {
            console.log('从数据库找不到任何Cate数据');
            resolve([])
          }
        },
        (_, error) => {
          console.log(error);
          console.log('数据库执行出错getbookcatelist');
          resolve(null)
        }
      );
    }
    );
  })
}



