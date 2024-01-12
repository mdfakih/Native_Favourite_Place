import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

const db = SQLite.openDatabase('places.db');

export const init = () => {
  const promise = new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
            )`,
        [],
        () => {},
        (_, error) => {},
      );
    });
  });

  return promise;
};

export const insertPlace = (place) => {
  const promise = new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ],
        (_, result) => {
          console.log(result);
          res(result);
        },
        (_, error) => {
          rej(error);
        },
      );
    });
  });

  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places`,
        [],
        (_, result) => {
          const places = [];
          for (const dp of result.rows._array) {
            places.push(
              new Place(
                dp.title,
                dp.imageUri,
                { address: dp.address, lat: dp.lat, lng: dp.lng },
                dp.id,
              ),
            );
          }
          //   console.log('fetch', result.rows._array);
          res(places);
        },
        (_, error) => {
          rej(error);
        },
      );
    });
  });

  return promise;
};

export const fetchPlaceDetails = (id) => {
  const promise = new Promise((res, rej) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places WHERE id = ?`,
        [id],
        (_, result) => {
          //   console.log(result.rows._array[0]);
          const dbplace = result.rows._array[0];
          const place = new Place(
            dbplace.title,
            dbplace.imageUri,
            { lat: dbplace.lat, lng: dbplace.lng, address: dbplace.address },
            dbplace.id,
          );
          res(place);
        },
        (_, error) => {
          rej(error);
        },
      );
    });
  });

  return promise;
};
