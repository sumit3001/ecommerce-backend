# SCHEMA

- # User
    - firstName : String
    - lastName : String
    - email : String
    - password : String (Hashed)
    - address : [
        - Address (from Address schema)
    ]
    - orders : [
        - Address (from Address schema)
    ]

- ## Product
    - name : Schema
    - stickerPrice : Number
    - markedPrice : Number
    - category : Category (from Category schema)
    - image : String (URL)
    - compatibleWith : [ "iphone 13", "iphone 12", "iphone 11"]
    - stock : Number
    - colour : String 
    - weight : Number
    - mfd : Number (manufacturing year)

- ## Category
    - name : String
    - description : String

- ## Order
    - address : Address (from Address schema)
    - user : User (from User schema)
    - products : [
        product : Product (from Product schema)      
    ]
    - total : Number
    - status : [ "payment_pending", "payment_success", "payment_failed" ]

- ## Address
    - houseNumber : String 
    - fullAddress : String 
    - landMark : String