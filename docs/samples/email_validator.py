import re

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+"
    r"@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)

MAX_LOCAL_LEN = 64
MAX_DOMAIN_LEN = 255
MAX_TOTAL_LEN = 320


def validate_email(email: str) -> tuple[bool, str]:
    if not isinstance(email, str):
        return False, "Input must be a string"
    if not email or len(email) > MAX_TOTAL_LEN:
        return False, f"Length must be 1-{MAX_TOTAL_LEN} characters"
    local, _, domain = email.partition("@")
    if not local or not domain:
        return False, "Local and domain parts must be non-empty"
    if len(local) > MAX_LOCAL_LEN:
        return False, f"Local part exceeds {MAX_LOCAL_LEN} characters"
    if len(domain) > MAX_DOMAIN_LEN:
        return False, f"Domain exceeds {MAX_DOMAIN_LEN} characters"
    if not EMAIL_REGEX.match(email):
        return False, "Format does not match RFC 5322 specification"
    return True, "Valid"
