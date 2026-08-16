from apps.users.models import User


def create_user(username, email, password, phone_number=None, address=None, avatar=1):
    """
    Creates a new user account and saves it to the database.

    Args:
        username (str): The user's chosen username.
        email (str): The user's email address.
        password (str): The user's password. Gets hashed automatically.
        phone_number (str, optional): The user's phone number. Defaults to None.
        address (str, optional): The user's home address. Defaults to None.
        avatar (int, optional): The user's selected avatar between 1 and 5. Defaults to 1.

    Returns:
        User: The newly created user object.

    Raises:
        ValueError: If the username or email already exists in the database.
    """

    if User.objects.filter(username=username).exists(): # This statement checks if a user with the given username already exists in the database.
        raise ValueError('Username is already taken.') # If a username exists, a ValueError is raised with the message 'Username is already taken.'

    if User.objects.filter(email=email).exists(): # This statement checks if a user with the given email already exists in the database.
        raise ValueError('Email is already registered.') # If an email exists, a ValueError is raised with the message 'Email is already registered.'

    # Code block below creates the user.
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        phone_number=phone_number,
        address=address,
        avatar=avatar,
    )

    return user