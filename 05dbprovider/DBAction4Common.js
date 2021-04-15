import _ from 'lodash';
import * as SQLite from 'expo-sqlite';

const DB = SQLite.openDatabase('db')

//登录
export const login = async (pwd) => {
    return new Promise((resolve, reject) => {
        DB.transaction(tx => {
            tx.executeSql(
                'select * from setting where key=? and value =? ;',
                ['pwd', pwd],
                (_, { rows: { length } }) => {
                    if (length > 0) {
                        console.log('从数据库找到当前用户，允许登录');
                        resolve(true)
                    } else {
                        console.log('从数据库找不到当前用户，拒绝登录');
                        resolve(false)
                    }
                },
                (_, error) => {
                    console.log(error);
                    console.log('数据库执行出错:login');
                    resolve(false)
                }
            );
        }
        );
    })
}

//修改密码
export const updatepwd = async (pwd) => {
    return new Promise((resolve, reject) => {
        DB.transaction(tx => {
            tx.executeSql(
                'update setting set value =? where key=? ;',
                [pwd, 'pwd'],
                () => {
                    console.log('更新密码成功');
                    resolve(true)
                },
                (_, error) => {
                    console.log(error);
                    console.log('数据库执行出错:updatepwd');
                    resolve(false)
                }
            );
        }
        );
    })
}