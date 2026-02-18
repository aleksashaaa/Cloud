import re
import hashlib


def validate_password(password):
    # Проверка типа
    if not isinstance(password, str):
        return "Password must be a string"

    if not password:
        return "Password cannot be empty"

    if len(password) < 8:
        return "Password must be at least 8 characters long"

    if " " in password:
        return "Password must not contain spaces"

    # Проверка на одинаковые символы
    if len(set(password)) == 1:
        return "Password must not contain only repeated characters"

    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"

    if not re.search(r"[0-9]", password):
        return "Password must contain at least one digit"

    if not re.search(r"[^A-Za-z0-9]", password):
        return "Password must contain at least one special character"

    # Используем SHA-256
    hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()

    return "Password is valid", hashed


# simple test
if __name__ == "__main__":
    pwd = input("Enter password: ")
    result = validate_password(pwd)
    print(result)
