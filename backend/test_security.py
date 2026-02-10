from app.core.security import hash_password,verify_password,create_access_token
from jose import jwt
import os


SECRET_KEY =  os.getenv("SECRET_KEY")

hashed = hash_password("123456")
print("Hashed: ",hashed)

print("verify correct: ",verify_password("123456",hashed))
print("verify Wrong: ",verify_password("000000",hashed))

token = create_access_token({"sub":"krish"})

print("JWT: ",token)

decode = jwt.decode(token,SECRET_KEY,algorithms=["HS256"])
print("Decoded",decode)