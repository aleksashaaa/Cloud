import re
import hashlib

def validate_password(password):
    if not password:
        return "Password cannot be empty"

    if len(password) < 8:
        return "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"

    if not re.search(r"[0-9]", password):
        return "Password must contain at least one digit"

    if not re.search(r"[^A-Za-z0-9]", password):
        return "Password must contain at least one special character"

    hashed = hashlib.sha1(password.encode()).hexdigest()

    return hashed


# simple test
if __name__ == "__main__":
    pwd = input("Enter password: ")
    result = validate_password(pwd)
    print(result)
