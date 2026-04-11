import re

def validate_email(email: str) -> tuple[bool, str]:
    """Validate an email address by checking whether it follows the natural pattern of email syntax.

    Returns:
        A tuple of (is_valid, reason).
    """
    if not email:
        return False, "empty input -- nothing to validate"

    if len(email) > 254:
        return False, "exceeds maximum email length of 254 characters"

    pattern = re.compile(
        r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+"
        r"@[a-zA-Z0-9]"
        r"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
        r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    )

    if not pattern.match(email):
        return False, f"'{email}' does not conform to the natural form of an email address"

    local, domain = email.rsplit("@", 1)

    if len(local) > 64:
        return False, "local part exceeds maximum length of 64 characters"

    if ".." in local:
        return False, "local part contains consecutive dots"

    return True, "valid"


# Quick demonstration
if __name__ == "__main__":
    test_cases = [
        "user@example.com",
        "first.last@sub.domain.org",
        "bad@@example.com",
        "@missing-local.com",
        "no-at-sign.com",
        "",
        "user@.invalid",
        "a" * 65 + "@example.com",
    ]

    for tc in test_cases:
        valid, reason = validate_email(tc)
        print(f"{'valid' if valid else 'invalid':>7} | {tc!r:45s} | {reason}")
