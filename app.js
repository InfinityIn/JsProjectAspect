const GetConnect = () => {
    return new Promise( (resolve, reject) => {
        const conn = require('mysql').createConnection({
            host: "localhost",    
            user: "root",
            database: "test",
            password: "root"
        })
        conn.connect( err => {
            if (err) 
                reject(err)                
            else
                resolve(conn)
            })
})}

const GetData = async (tableName, searchText) => {
    
    let results = await GetConnect()
        .then(conn => {
            return new Promise((resolve,reject) => {
                let query = "SELECT * FROM " + tableName + " WHERE name like '%"+searchText+"%' or description like '%"+searchText+"%' ORDER BY name, description"
                conn.query(query, (err, result) => {
                    if (err) 
                        reject(err)                
                    else
                        resolve(result)
                    })
            })

        })
        .then(result => {        
                    //console.log(result) 
                    return new Promise((resolve) => {                        
                        let results = {
                            data: result.slice(0,20),
                            count: result.length
                        }
                        resolve(results)                        
                    })                     
            })        
        .catch(err => {
            console.log('Ошибка ' + err)
            return new Promise((resolve) => {                        
                let results = {
                    data: [],
                    count: 0
                }
                resolve(results)                        
            })
        })        
    return results                  
}


//Тесты
GetData('table1','55').then(res => {console.log('Совпадений не найдено',res)})
GetData('table1','third').then(res => {console.log('Длина массива равна количеству найденных записей',res)})
GetData('table1','1').then(res => {console.log('Длина массива меньше количества найденных записей',res)})
GetData('table4','1').then(res => {console.log('Несуществующая таблица',res)})


