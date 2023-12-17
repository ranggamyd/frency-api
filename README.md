<h1 style="text-align: center;">DOKUMENTASI API</h1>

<h3>PUBLIC API (Allow Unauthorized)</h3>
<hr>

#### REGISTER USER
POST https://frency-api-ofjpwfxlpa-et.a.run.app/users
- *Content-Type: application/json*
```json
{
  "name" : "string",
  "email" : "string",
  "password" : "string",
  "role" : "string"
}
```

#### LOGIN USER
POST https://frency-api-ofjpwfxlpa-et.a.run.app/users/login
- *Content-Type: application/json*
```json
{
  "email" : "john@example.com",
  "password" : "123"
}
```

<hr>
<h3>PRIVATE API (Need Token)</h3>
<hr>

<h3>USER API</h3>

#### GET ALL USERS
GET https://frency-api-ofjpwfxlpa-et.a.run.app/users
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### GET CURRENT USER
GET https://frency-api-ofjpwfxlpa-et.a.run.app/users/current
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### EDIT CURRENT USER
PUT https://frency-api-ofjpwfxlpa-et.a.run.app/users/current
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*
```json
{
  "name" : "string 1",
  "email" : "string 1",
  "password" : "string 1",
  "role" : "string 1"
}
```

#### LOGOUT
DELETE https://frency-api-ofjpwfxlpa-et.a.run.app/users/logout
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*
<hr>

<h3>FRANCHISE API</h3>

#### POST FRANCHISE
POST https://frency-api-ofjpwfxlpa-et.a.run.app/franchises
- *Content-Type: application/json*
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*
```json
{
  "franchise_name" : "string",
  "address" : "string",
  "description" : "string",
  "category" : "string",
  "whatsapp_number" : "string",
  "franchiseType": [1, 2, 3] //franchise_type_id
}
```

#### UPLOAD FRANCHISE GALLERY
POST https://frency-api-ofjpwfxlpa-et.a.run.app/franchises/(:franchise_id)/upload
- Content-Type: multipart/form-data
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*
```json
{
  "gallery" : ["img1.jpg", "img2.jpg", "img2.jpg"] // multiple_upload
}
```

#### GET ALL FRANCHISES
GET https://frency-api-ofjpwfxlpa-et.a.run.app/franchises
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### GET MY FRANCHISES (By Franchisor)
GET https://frency-api-ofjpwfxlpa-et.a.run.app/my_franchises
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### GET A FRANCHISE
GET https://frency-api-ofjpwfxlpa-et.a.run.app/franchises/(:franchise_id)
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### UPDATE FRANCHISE
PUT https://frency-api-ofjpwfxlpa-et.a.run.app/franchises/(:franchise_id)
- *Content-Type: application/json*
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*
```json
{
  "franchise_name" : "string 1",
  "address" : "string 1",
  "description" : "string 1",
  "category" : "string 1",
  "whatsapp_number" : "string 1",
  "franchiseType": [1, 3]
}
```

#### DELETE FRANCHISE
DELETE https://frency-api-ofjpwfxlpa-et.a.run.app/franchises/(:franchise_id)
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*

#### SEARCH FRANCHISES
GET https://frency-api-ofjpwfxlpa-et.a.run.app/franchises
- *Authorization: 4d13ae85-5656-4d69-8747-59fe57f481fd*