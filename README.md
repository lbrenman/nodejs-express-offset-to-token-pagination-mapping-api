# API For Offset to Token Pagination Mapping Testing

Leverages the [Mock API For Token Pagination Testing](https://github.com/lbrenman/nodejs-express-mock-token-pagination-api/blob/main/README.md) as the token pagination API.

## To Run

* Clone Repo
* Run `npm install`
* Run `npm start`
* Make calls to the API

## Curl Commands

* Default offset and limit
```bash
curl -X GET "http://localhost:4000/fdx-items" \
  -H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "limit": 10,
  "offset": 0,
  "total": 1000,
  "items": [
    {
      "id": 1,
      "name": "Item 1"
    },
    {
      "id": 2,
      "name": "Item 2"
    },
    .
    .
    .
    {
      "id": 10,
      "name": "Item 10"
    }
  ]
}
```

* Custom offset and limit
```bash
curl -X GET "http://localhost:4000/fdx-items?limit=10&offset=30" \
  -H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "limit": 10,
  "offset": 30,
  "total": 1000,
  "items": [
    {
      "id": 31,
      "name": "Item 31"
    },
    {
      "id": 32,
      "name": "Item 32"
    },
    .
    .
    .
    {
      "id": 40,
      "name": "Item 40"
    }
  ]
}
```

* Exceeding offset and limit

```bash
curl -X GET "http://localhost:4000/fdx-items?limit=10&offset=2000" \
  -H "x-api-key: myoffsetapikey"
```

Response:

```json
{
  "error": "Offset exceeds data bounds"
}
```