from setuptools import setup, find_packages

setup(
    name="telegram_bot",
    version="1.0",
    packages=find_packages(),
    install_requires=[
        'python-telegram-bot==20.3',
        'flask==2.3.2', 
        'nltk==3.8.1',
        'python-dotenv==1.0.0'
    ],
)
