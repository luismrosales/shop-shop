export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database with version of 1
    const request = window.indexedDB.open("shop-shop", 1);
    // create variables to hold reference to the database, transaction and object store
    let db, tx, store;
    // if version has changed,run this method
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create object store for each type of data
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };
    // handle any errors with connecting
    request.onerror = function (e) {
      console.log("There was an error");
      //
    };
    // on database sucess
    request.onsuccess = function (e) {
      // save a reference of the database to the db variable
      db = request.result;
      tx = db.transaction(storeName, "readwrite");
      store = tx.objectStore(storeName);

      // if theres any errors let us know
      db.onerror = function (e) {
        console.log("error", e);
      };
      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }
      // when the transaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
