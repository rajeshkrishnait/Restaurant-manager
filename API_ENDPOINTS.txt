API ENDPOINTs:
/users/me - gives current user details
/users/update_profile - updates current user details
/auth/sigin - sign in user
request:{
    "password":"passwordchecker",
    "username":"lok"
}
response:
{
    {
    "user": {
        "role": "Admin",
        "_id": "6259143f1aa6a82c246d3b73",
        "email": "lokeshwar@gmail.com",
        "name": "lokeshwar lokesh",
        "username": "lok",
        "phone": 9560121221,
        "status": "inactive",
        "restaurant": "sappadu",
        "createdAt": "2022-04-15T06:44:15.256Z",
        "updatedAt": "2022-04-15T06:44:15.256Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjU5MTQzZjFhYTZhODJjMjQ2ZDNiNzMiLCJyb2xlIjoiQWRtaW4iLCJuYW1lIjoibG9rZXNod2FyIGxva2VzaCIsImlhdCI6MTY1MDAwNTE0Mn0.FvVNyUVMbj9mfSa8aLh8oRAgUSy6Mjog71lkh5hXWiw"
}
}
/auth/signup - creates new user profile
request:{
    "email":"rajeshkrishnarajakumar@gmail.com",
    "password":"passwordchecker",
    "username":"raj",
    "phone":"7904601211",
    "role":"Admin",
    "status":"active",
    "restaurant":"sappadu"

}
response:
{
    "user": {
        "role": "Admin",
        "_id": "625911221f562b2e4c3a9d07",
        "email": "rajeshkrishnarajakumar@gmail.com",
        "phone": 7904601211,
        "status": "active",
        "restaurant": "sappadu",
        "createdAt": "2022-04-15T06:30:58.093Z",
        "updatedAt": "2022-04-15T06:30:58.093Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjU5MTEyMjFmNTYyYjJlNGMzYTlkMDciLCJyb2xlIjoiQWRtaW4iLCJuYW1lIjoicmFqZXNoIGtyaXNobmEgUiIsImlhdCI6MTY1MDAwNDI1OH0.kPtQ5twzfJhkIP4sZCe3-G5YZzdZVcI7NligJzfhY7M"
}
/auth/logout - logs out user